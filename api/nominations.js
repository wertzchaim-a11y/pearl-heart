const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const records = await base('Nominations').select({ sort: [{ field: 'Date', direction: 'desc' }] }).all();
    const noms = records.map(r => ({
      id: r.id,
      empName: r.get('Employee Name') || '',
      dept: r.get('Department') || '',
      message: r.get('Message') || '',
      nomName: r.get('Submitted By') || '',
      phone: r.get('Phone') || '',
      rating: r.get('Rating') || 0,
      date: r.get('Date') || '',
    }));
    return res.status(200).json(noms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch nominations' });
  }
};
