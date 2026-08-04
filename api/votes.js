// Vercel Serverless Function para Votaciones Antifraude & Conteo Global
// Almacena y valida votos por ID de Discord en el servidor

// Cache global en memoria del servidor
const VOTOS_GLOBALES = {}; // nId -> totalVotos
const REGISTRO_USUARIOS = {}; // `${discordUserId}_${catId}` -> Set of nIds voted

export default async function handler(req, res) {
  // Configurar headers CORS para permitir peticiones desde la web
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Obtener conteos de votos globales actualizados
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      votosGlobales: VOTOS_GLOBALES
    });
  }

  // POST: Registrar o retirar voto comprobando ID de Discord en el servidor
  if (req.method === 'POST') {
    try {
      const { discordUserId, categoryId, nomineeId, action } = req.body || {};

      // 1. Validaciones antifraude de seguridad
      if (!discordUserId || typeof discordUserId !== 'string' || !discordUserId.trim()) {
        return res.status(401).json({
          error: "Acceso denegado: Es obligatorio identificarse con Discord para votar."
        });
      }

      if (!categoryId || !nomineeId) {
        return res.status(400).json({
          error: "Faltan parámetros de categoría o nominado."
        });
      }

      const userKey = `${discordUserId.trim()}_${categoryId}`;
      if (!REGISTRO_USUARIOS[userKey]) {
        REGISTRO_USUARIOS[userKey] = new Set();
      }

      const votosUsuarioCat = REGISTRO_USUARIOS[userKey];

      if (action === 'add') {
        // Antifraude: Máximo 3 votos por categoría por usuario de Discord
        if (votosUsuarioCat.size >= 3 && !votosUsuarioCat.has(nomineeId)) {
          return res.status(403).json({
            error: "Límite alcanzado: Ya utilizaste tus 3 votos permitidos en esta categoría."
          });
        }

        if (!votosUsuarioCat.has(nomineeId)) {
          votosUsuarioCat.add(nomineeId);
          VOTOS_GLOBALES[nomineeId] = (VOTOS_GLOBALES[nomineeId] || 0) + 1;
        }
      } else if (action === 'remove') {
        if (votosUsuarioCat.has(nomineeId)) {
          votosUsuarioCat.delete(nomineeId);
          VOTOS_GLOBALES[nomineeId] = Math.max(0, (VOTOS_GLOBALES[nomineeId] || 0) - 1);
        }
      }

      return res.status(200).json({
        success: true,
        misVotos: Array.from(votosUsuarioCat),
        votosGlobales: VOTOS_GLOBALES
      });

    } catch (err) {
      return res.status(500).json({ error: "Error procesando el voto en el servidor" });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
