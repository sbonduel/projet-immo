// selogerScraper.js
const puppeteer = require('puppeteer');
const Apartment = require('../models/Apartment');

async function scrapeSelogerWithPuppeteer() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const url = 'https://www.seloger.com/list.htm?types=1&projects=2&places=[{"inseeCodes":[750056]}]'; // Paris
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36'
  );

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Attend que les annonces soient rendues
    await page.waitForSelector('[data-test="sl-results-list"]', { timeout: 60000 });

    const apartments = await page.evaluate(() => {
      const listings = document.querySelectorAll('[data-test="sl-results-list"] article');
      const data = [];

      listings.forEach(listing => {
        const title = listing.querySelector('h2')?.innerText?.trim();
        const priceText = listing.querySelector('[data-test="price"]')?.innerText?.trim();
        const city = listing.querySelector('[data-test="locality"]')?.innerText?.trim();

        const price = priceText ? parseInt(priceText.replace(/[^\d]/g, '')) : null;

        if (title && city && price) {
          data.push({
            title,
            description: title,
            country: 'France',
            city,
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
      console.log(`✅ ${apartments.length} appartements ajoutés depuis SeLoger (via Puppeteer).`);
    } else {
      console.warn('⚠️ Aucun appartement trouvé.');
    }
  } catch (err) {
    console.error('❌ Erreur lors du scraping Seloger avec Puppeteer :', err.message);
  } finally {
    await browser.close();
  }
}

module.exports = scrapeSelogerWithPuppeteer;