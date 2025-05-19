const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const Apartment = require('../models/Apartment');
const { getAddressFromCoordinates } = require('./geocode');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROBOT_USER_ID = '6813ebb33c6ac35cbac3e718';
puppeteer.use(StealthPlugin());

function cleanDescription(rawDescription, { city, surface, rooms, bedrooms }) {
  if (!rawDescription) return '';

  const lines = rawDescription
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  const firstUsefulIndex = lines.findIndex(line =>
    /(appartement|maison|studio|duplex|villa|copropriété|résidence|séjour|chambre|cuisine|salle de bain)/i.test(line)
  );

  const filteredLines = lines
    .slice(firstUsefulIndex >= 0 ? firstUsefulIndex : 2)
    .filter(line => {
      if (line.includes(city)) return false;
      if (surface && line.includes(`${surface} m²`)) return false;
      if (rooms && line.includes(`${rooms} pièce`)) return false;
      if (bedrooms && line.includes(`${bedrooms} chambre`)) return false;
      if (/^\d{1,3}(?:[.,]\d{3})* € le m²/i.test(line)) return false;
      if (/Classe énergie|GES/i.test(line)) return false;
      if (/^[A-G]\s*$/i.test(line)) return false;
      if (/Taverny|Beauchamp|Vaucelles/i.test(line)) return false;
      if (/voir l'adresse du bien sur une carte|voir la visite virtuelle|voir la commune sur une carte/i.test(line)) return false;

      return true;
    });

  return filteredLines.join('\n').replace(/\s{2,}/g, ' ').trim();
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) return reject('Image not accessible');
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

async function scrapePap() {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  );
  await page.setExtraHTTPHeaders({ 'accept-language': 'fr-FR,fr;q=0.9' });

  try {
    console.log('🔍 Début du scraping de PAP.fr');
    await page.goto('https://www.pap.fr/annonce/vente-appartement', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
    await page.waitForSelector('a.item-title', { timeout: 30000 });

    const links = await page.$$eval('a.item-title', anchors =>
      anchors.slice(0, 50).map(a => a.href)
    );

    for (const url of links) {
      const detailPage = await browser.newPage();
      try {
        await detailPage.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const validAnnonce = await detailPage.$('h1.item-title');
        if (!validAnnonce) {
          console.warn(`⚠️ Ignoré : ${url} n'est pas une annonce valide`);
          await detailPage.close();
          continue;
        }

        const data = await detailPage.evaluate(() => {
          const getText = (selector) => document.querySelector(selector)?.innerText.trim() || '';
          const imageUrls = Array.from(document.querySelectorAll('.owl-item img'))
            .map(img => img.src)
            .filter(src => src && src.startsWith('https://cdn.pap.fr/photos/'));
          const title = getText('h1.item-title');
          const priceText = getText('span.item-price');
          const price = parseInt(priceText.replace(/[^\d]/g, ''), 10) || 0;
          const description = getText('div.margin-bottom-30');
          const city = getText('h2.margin-bottom-8');

          const infoText = Array.from(document.querySelectorAll('.item-tags li')).map(li => li.innerText.trim()).join(' | ');
          const surfaceMatch = infoText.match(/(\d+)\s?m²/);
          const roomsMatch = infoText.match(/(\d+)\s?pi[èe]ce/);
          const bedroomsMatch = infoText.match(/(\d+)\s?chambre/);

          const surface = surfaceMatch ? parseInt(surfaceMatch[1], 10) : null;
          const rooms = roomsMatch ? parseInt(roomsMatch[1], 10) : null;
          const bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1], 10) : null;

          const floor = (() => {
            const match = infoText.match(/étage\s+(\d+)/i);
            return match ? match[1] : null;
          })();

          const energyClass = document.querySelector('.energy-indice li.active')?.innerText.trim() || null;
          const ges = document.querySelector('.ges-indice li.active')?.innerText.trim() || null;

          const detailsSection = document.querySelector('.item-infos')?.innerText || '';
          const chargesMatch = detailsSection.match(/Charges.*?(\d+)[^\d]*€/i);
          const taxeFonciereMatch = detailsSection.match(/Taxe fonci[eè]re.*?(\d+)[^\d]*€/i);

          const charges = chargesMatch ? parseInt(chargesMatch[1], 10) : null;
          const taxeFonciere = taxeFonciereMatch ? parseInt(taxeFonciereMatch[1], 10) : null;

          return {
            title,
            price,
            description,
            city,
            energyClass,
            ges,
            surface,
            rooms,
            bedrooms,
            floor,
            charges,
            taxeFonciere,
            imageUrls
          };
        });

        const allowedClasses = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        if (!allowedClasses.includes(data.energyClass)) data.energyClass = null;
        if (!allowedClasses.includes(data.ges)) data.ges = null;

        let imagePaths = [];
        for (const imgUrl of data.imageUrls.slice(0, 5)) {
          try {
            const filename = `apt_${Date.now()}_${Math.floor(Math.random() * 10000)}.jpg`;
            const savePath = path.join(__dirname, '..', '..', 'frontend-app', 'public', 'images', filename);
            await downloadImage(imgUrl, savePath);
            imagePaths.push(`/images/${filename}`);
          } catch (err) {
            console.warn('⚠️ Image ignorée :', err.message);
          }
        }

        let location = null;
        let addressDetails = {
          street: '',
          streetNumber: '',
          city: data.city,
          country: 'France'
        };

        try {
          await detailPage.click('a.dialog-box-handler-carte');
          await detailPage.waitForSelector('#carte_mappy', { timeout: 10000 });

          location = await detailPage.evaluate(() => {
            const mapDiv = document.querySelector('#carte_mappy');
            if (!mapDiv) return null;
            try {
              const json = mapDiv.getAttribute('data-mappy');
              const parsed = JSON.parse(json);
              const [lat, lng] = parsed.center.map(Number);
              return { lat, lng };
            } catch {
              return null;
            }
          });

          if (location) {
            try {
              const reverse = await getAddressFromCoordinates(location.lat, location.lng);
              addressDetails = { ...addressDetails, ...reverse };
            } catch (err) {
              console.warn(`📍 Adresse inverse non récupérée : ${err.message}`);
            }
          }
        } catch (err) {
          console.warn(`📍 Localisation non récupérée pour ${data.title}`);
        }

        const cleanedDescription = cleanDescription(data.description, {
          city: data.city,
          surface: data.surface,
          rooms: data.rooms,
          bedrooms: data.bedrooms
        });

    const apartmentData = {
      titre: data.title,
      description: cleanedDescription,
      pays: addressDetails.country,
      ville: addressDetails.city,
      rue: addressDetails.street,
      rueNombre: addressDetails.streetNumber,
      postalCode: '', // facultatif, pas toujours fourni par le site
      price: data.price,
      surface: data.surface,
      piece: data.rooms,
      chambre: data.bedrooms,
      etage: data.floor,
      charges: data.charges,
      taxeFonciere: data.taxeFonciere,
      energyClass: data.energyClass,
      ges: data.ges,
      location,
      images: imagePaths,
      auteur: ROBOT_USER_ID,
      sourceUrl: url,
      scrapedAt: new Date()
    };


        await Apartment.findOneAndUpdate(
          { sourceUrl: url },
          apartmentData,
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
          }
        );

        console.log(`✅ Enregistré ou mis à jour : ${data.title}`);
      } catch (err) {
        console.warn(`⚠️ Erreur avec ${url} : ${err.message}`);
      } finally {
        try {
          if (!detailPage.isClosed()) await detailPage.close();
        } catch (e) {
          console.warn(`⚠️ Fermeture de page échouée : ${e.message}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Erreur scraping PAP.fr :', error.message);
  } finally {
    try {
      if (browser && browser.isConnected()) {
        await browser.close();
      }
    } catch (err) {
      console.warn(`⚠️ Fermeture du navigateur échouée : ${err.message}`);
    }
  }
}

module.exports = scrapePap;