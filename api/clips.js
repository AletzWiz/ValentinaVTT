export default async function handler(req, res) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "Faltan las llaves en Vercel" });
  }

  try {
    const tokenReq = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: 'POST' });
    const tokenData = await tokenReq.json();
    const token = tokenData.access_token;

    const username = "valentinavtt";
    const userReq = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const userData = await userReq.json();
    const broadcasterId = userData.data[0].id;

    // Fecha estricta: 13 de Mayo de 2026
    const startDateString = '2026-05-13T00:00:00Z';
    const startDate = new Date(startDateString);
    
    // Pedimos el top 10 a Twitch
    const clipsReq = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&started_at=${startDateString}&first=10`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const clipsData = await clipsReq.json();

    // Candado extra de seguridad: Filtramos nosotros mismos para eliminar colados viejos
    const clipsReales = (clipsData.data || []).filter(clip => new Date(clip.created_at) >= startDate);

    res.status(200).json(clipsReales);
  } catch (error) {
    res.status(500).json({ error: "Error conectando con Twitch" });
  }
}
