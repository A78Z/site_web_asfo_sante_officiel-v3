export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'Webhook ASFO Wave actif' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;
    console.log('Wave webhook recu:', body.type);

    if (body.type === 'checkout.session.completed') {
      const checkout = body.data;
      console.log(`Don reussi: ${checkout.amount} ${checkout.currency}`);
      console.log(`  Reference: ${checkout.client_reference}`);
      console.log(`  Transaction ID: ${checkout.transaction_id}`);
    }

    if (body.type === 'checkout.session.payment_failed') {
      const checkout = body.data;
      console.log(`Don echoue: Ref ${checkout.client_reference}`);
      console.log(`  Erreur: ${checkout.last_payment_error?.message}`);
    }

    // Toujours repondre 200 a Wave
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Erreur webhook:', error);
    return res.status(200).json({ received: true });
  }
}
