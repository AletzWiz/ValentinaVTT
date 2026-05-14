export default async function handler(req, res) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Faltan las llaves en Vercel" });
  }

  try {
    // 1. Conseguimos el pase VIP (Token) de Twitch en secreto
    const tokenReq = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: 'POST' });
    const tokenData = await tokenReq.json();
    const token = tokenData.access_token;

    // 2. Buscamos el ID interno del canal de Valentina
    const username = "valentinavtt"; // <-- CONFIRMA QUE ASÍ ESTÁ EN TWITCH
    const userReq = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const userData = await userReq.json();
    const broadcasterId = userData.data[0].id;

    // 3. Pedimos los 20 mejores clips a partir del 13 de mayo de 2026
    const startDate = new Date('2026-05-13T00:00:00Z').toISOString();
    const clipsReq = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&started_at=${startDate}&first=20`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const clipsData = await clipsReq.json();

    // Le mandamos los clips de forma segura a tu página web
    res.status(200).json(clipsData.data || []);
  } catch (error) {
    res.status(500).json({ error: "Error conectando con Twitch" });
  }
}
