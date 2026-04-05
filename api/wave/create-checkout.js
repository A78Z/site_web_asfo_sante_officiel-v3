export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, donorName, donorPhone } = req.body;

    const WAVE_API_KEY = process.env.WAVE_API_KEY;
    if (!WAVE_API_KEY) {
      console.error('WAVE_API_KEY non configurée');
      return res.status(500).json({ error: 'Configuration serveur manquante. Contactez l\'administrateur.' });
    }

    const montant = Math.floor(parseInt(amount));
    if (!montant || montant < 100) {
      return res.status(400).json({ error: 'Montant minimum : 100 FCFA' });
    }

    const APP_URL = process.env.APP_URL || 'https://asfosante.org';
    const clientReference = `DON-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    const waveResponse = await fetch('https://api.wave.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WAVE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: String(montant),
        currency: 'XOF',
        client_reference: clientReference,
        error_url: `${APP_URL}/donate/error?ref=${clientReference}`,
        success_url: `${APP_URL}/donate/success?ref=${clientReference}&amount=${montant}&name=${encodeURIComponent(donorName || 'Anonyme')}`,
      }),
    });

    const waveData = await waveResponse.json();
    console.log('Wave API response:', waveResponse.status, JSON.stringify(waveData));

    if (!waveResponse.ok) {
      console.error('Wave API error:', waveData);
      return res.status(waveResponse.status).json({
        error: `Erreur Wave: ${waveData.message || waveData.detail || JSON.stringify(waveData)}`,
      });
    }

    return res.status(200).json({
      wave_launch_url: waveData.wave_launch_url,
      checkout_id: waveData.id,
      reference: clientReference,
    });
  } catch (error) {
    console.error('Erreur create-checkout:', error);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}
