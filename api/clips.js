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

    // --- MAGIA DE TEMPORADAS INFINITAS (61 días) ---
    const fechaInicioGlobal = new Date('2026-05-13T00:00:00Z').getTime();
    const ahora = Date.now();
    const msPorDia = 1000 * 60 * 60 * 24;
    
    // Calculamos en qué temporada estamos
    const diasTranscurridos = Math.max(0, Math.floor((ahora - fechaInicioGlobal) / msPorDia));
    const indiceTemporada = Math.floor(diasTranscurridos / 61);
    const numeroTemporada = indiceTemporada + 1; // Para que empiece en Temporada 1
    
    const inicioTemporadaActualMs = fechaInicioGlobal + (indiceTemporada * 61 * msPorDia);
    const finTemporadaActualMs = inicioTemporadaActualMs + (61 * msPorDia);
    
    const startDateString = new Date(inicioTemporadaActualMs).toISOString();
    const endDateString = new Date(finTemporadaActualMs).toISOString();
    const diasRestantes = Math.ceil((finTemporadaActualMs - ahora) / msPorDia);

    // Pedimos hasta 100 clips para tener margen de filtrado
    const clipsReq = await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${broadcasterId}&started_at=${startDateString}&first=100`, {
      headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${token}` }
    });
    const clipsData = await clipsReq.json();

    // FILTRO MAESTRO: Adiós colados y adiós ValentinaVTT
    const clipsReales = (clipsData.data || [])
      .filter(clip => new Date(clip.created_at).getTime() >= inicioTemporadaActualMs)
      .filter(clip => clip.creator_name.toLowerCase() !== 'valentinavtt') // <-- Aquí la baneamos del top
      .slice(0, 10); // Nos quedamos solo con los 10 mejores

    // Mandamos los clips y la información de la temporada a tu web
    res.status(200).json({
      clips: clipsReales,
      meta: {
        temporada: numeroTemporada,
        diasRestantes: diasRestantes,
        fechaInicio: startDateString,
        fechaFin: endDateString
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error conectando con Twitch" });
  }
}
