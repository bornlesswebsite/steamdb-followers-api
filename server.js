const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("SteamDB Follower API is running");
});

app.get("/followers/:2411280", async (req, res) => {
  const { appid } = req.params;
  const url = `https://steamdb.info/app/2411280}/charts/`;

  try {
    const { data } = await axios.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://steamdb.info/",
    "Connection": "keep-alive"
  }
});


    const $ = cheerio.load(data);
    let followers = null;

    $('div.span4').each((i, el) => {
      const header = $(el).find('h3').text().trim();
      if (header === 'Store data') {
        followers = $(el).find('ul.app-chart-numbers li').first().find('strong').text().trim();
      }
    });

    if (!followers) {
      return res.status(404).json({ error: "Follower count not found." });
    }

    res.json({ appid, followers });

  } catch (error) {
    console.error("Scraping failed:", error.message);
    res.status(500).json({ error: "Failed to fetch data from SteamDB." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
