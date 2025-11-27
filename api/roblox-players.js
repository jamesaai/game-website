// Vercel Serverless Function to proxy Roblox game stats
// This avoids CORS issues by calling Roblox from the server side.

export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://games.roblox.com/v1/games?universeIds=8107420919"
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Upstream Roblox API error" });
    }

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    return res.status(200).json(data);
  } catch (error) {
    console.error("Roblox proxy error", error);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(500).json({ error: "Failed to fetch Roblox data" });
  }
}
