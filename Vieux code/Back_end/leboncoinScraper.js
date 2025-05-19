// scraper/leboncoinScraper.js
const puppeteer = require('puppeteer');
const Apartment = require('../models/Apartment');

async function scrapeLeboncoin() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const url = 'https://www.leboncoin.fr/recherche?category=10&locations=Paris_75000';
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36'
  );

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Attendre que les annonces soient chargées
    await page.waitForSelector('ul[data-qa-id="search-results"]', { timeout: 60000 });

    const apartments = await page.evaluate(() => {
      const listings = document.querySelectorAll('ul[data-qa-id="search-results"] li');
      const data = [];

      listings.forEach(listing => {
        const title = listing.querySelector('p[data-qa-id="aditem_title"]')?.innerText?.trim();
        const priceText = listing.querySelector('span[data-qa-id="aditem_price"]')?.innerText?.trim();
        const location = listing.querySelector('p[data-qa-id="aditem_location"]')?.innerText?.trim();

        const price = priceText ? parseInt(priceText.replace(/[^\\d]/g, '')) : null;

        if (title && location && price) {
          data.push({
            title,
            description: title,
            country: 'France',
            city: location,
            street: '',
            streetNumber: '',
            price,
            location: null,
            owner: null
          });
        }
      });
      return data;
    });

    if (apartments.length > 0) {
      await Apartment.insertMany(apartments);
      console.log(`✅ ${apartments.length} appartements ajoutés depuis Leboncoin.`);
    } else {
      console.warn('⚠️ Aucun appartement trouvé.');
    }
  } catch (err) {
    console.error('❌ Erreur lors du scraping Leboncoin :', err.message);
  } finally {
    await browser.close();
  }
}

module.exports = scrapeLeboncoin;
