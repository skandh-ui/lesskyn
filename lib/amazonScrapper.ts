import axios from "axios";
import * as cheerio from "cheerio";
import {
  getCachedProduct,
  cacheCompleteProduct,
  cacheProductPrice,
} from "./redisCache";

interface AmazonProduct {
  name: string;
  company: string | null;
  price: number | null;
  image: string | null;
}

/**
 * Scrape Amazon product with intelligent caching
 * - Price cached for 12 hours
 * - Details (name, company, image) cached for 7 days
 */
export async function scrapeAmazonProduct(
  url: string,
): Promise<AmazonProduct | null> {
  try {
    // 1️⃣ Check cache first
    const cached = await getCachedProduct(url);

    if (cached) {
      // If we have both price and details from cache
      if (cached.price !== null && cached.name) {
        console.log(`✅ Cache hit (full): ${cached.name.substring(0, 40)}...`);
        return {
          name: cached.name,
          company: cached.company,
          price: cached.price,
          image: cached.image,
        };
      }

      // If we only have details, scrape just the price
      if (cached.name && cached.price === null) {
        console.log(`🔄 Cache hit (details only), fetching fresh price...`);
        const freshPrice = await scrapePrice(url);

        if (freshPrice !== null) {
          await cacheProductPrice(url, freshPrice);
        }

        return {
          name: cached.name,
          company: cached.company,
          price: freshPrice,
          image: cached.image,
        };
      }
    }

    // 2️⃣ No cache or incomplete cache - do full scrape
    console.log(`🌐 Cache miss, scraping: ${url}`);
    const product = await scrapeFullProduct(url);

    if (!product) {
      return null;
    }

    // 3️⃣ Cache the scraped product
    await cacheCompleteProduct(url, product);

    return product;
  } catch (error) {
    console.error("Amazon scrape failed:", url, error);
    return null;
  }
}

/**
 * Scrape complete product data
 */
async function scrapeFullProduct(url: string): Promise<AmazonProduct | null> {
  try {
    // Add short random delay to avoid rate limiting
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 500 + 300),
    );

    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-IN,en-US;q=0.9,en;q=0.8,hi;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
        Referer: "https://www.amazon.in/",
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    console.log(
      `📡 Response Status: ${res.status}, Final URL: ${res.request.res.responseUrl || url}`,
    );

    // Check for CAPTCHA before parsing
    if (res.data.includes("captcha") || res.data.includes("robot")) {
      console.error(`🤖 CAPTCHA detected for: ${url}`);
      console.error(
        `   Solution: Use a proxy service or Amazon Product Advertising API`,
      );
      return null;
    }

    const $ = cheerio.load(res.data);

    /* ---------- PRODUCT NAME ---------- */
    const name =
      $("#productTitle").text().trim() || $("h1 span").first().text().trim();

    if (!name) {
      // Debug: Check if we got blocked or redirected
      const pageTitle = $("title").text();
      const isErrorPage =
        res.data.includes("Sorry!") || res.data.includes("Page Not Found");

      console.error(`❌ Scraping failed - No product name found: ${url}`);
      console.error(`   Page title: "${pageTitle}"`);
      console.error(`   Is Error Page: ${isErrorPage}`);
      return null;
    }

    /* ---------- PRICE ---------- */
    const priceText =
      $("span.a-price-whole").first().text() ||
      $("#priceblock_ourprice").text() ||
      $("#priceblock_dealprice").text() ||
      $("span.a-price span.a-offscreen").first().text();

    let price: number | null = null;

    if (priceText) {
      price = Number(priceText.replace(/[₹,\s.]/g, "").trim());
      if (Number.isNaN(price)) price = null;
    }

    /* ---------- IMAGE ---------- */
    const image =
      $("#landingImage").attr("src") ||
      $("#imgTagWrapperId img").attr("src") ||
      null;

    /* ---------- COMPANY / BRAND ---------- */
    let company: string | null = null;

    const byline = $("#bylineInfo").text().trim();
    if (byline) {
      company = byline
        .replace(/brand:/i, "")
        .replace(/visit the/i, "")
        .replace(/store/i, "")
        .trim();
    }

    if (!company) {
      $("tr").each((_, el) => {
        const label = $(el).find("th").text().trim().toLowerCase();
        const value = $(el).find("td").text().trim();

        if (label === "brand" && value) {
          company = value;
        }
      });
    }

    if (!company && name) {
      company = name.split(" ")[0];
    }

    // Log warnings for missing data
    if (!price) {
      console.warn(
        `⚠️ Price not found for: ${name.substring(0, 50)}... (${url})`,
      );
    }
    if (!image) {
      console.warn(
        `⚠️ Image not found for: ${name.substring(0, 50)}... (${url})`,
      );
    }
    if (!company) {
      console.warn(
        `⚠️ Company not found for: ${name.substring(0, 50)}... (${url})`,
      );
    }

    return {
      name,
      company,
      price,
      image,
    };
  } catch (error) {
    console.error(
      `❌ Scraping failed for ${url}:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
}

/**
 * Scrape only the price (faster, used when details are cached)
 */
async function scrapePrice(url: string): Promise<number | null> {
  try {
    // Add short random delay
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 500 + 300),
    );

    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "en-IN,en;q=0.9",
        Referer: "https://www.amazon.in/",
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    // Check for CAPTCHA
    if (res.data.includes("captcha") || res.data.includes("robot")) {
      console.error(`🤖 CAPTCHA detected (price scrape): ${url}`);
      return null;
    }

    const $ = cheerio.load(res.data);

    const priceText =
      $("span.a-price-whole").first().text() ||
      $("#priceblock_ourprice").text() ||
      $("#priceblock_dealprice").text() ||
      $("span.a-price span.a-offscreen").first().text();

    if (priceText) {
      const price = Number(priceText.replace(/[₹,\s.]/g, "").trim());
      return Number.isNaN(price) ? null : price;
    }

    return null;
  } catch (error) {
    return null;
  }
}
