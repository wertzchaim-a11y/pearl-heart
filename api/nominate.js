const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { empName, dept, message, nomName, phone, rating, date, type } = req.body;
    if (!empName || !message) return res.status(400).json({ error: 'Missing required fields' });
    const record = await base('Nominations').create({
      'Employee Name': empName,
      'Department': dept || '',
      'Message': message,
      'Submitted By': nomName || 'Anonymous',
      'Phone': phone || '',
      'Rating': Number(rating) || 0,
      'Date': date || new Date().toISOString(),
      'Facility': 'The Pearl Nursing Center',
      'Type': type || 'Nomination',
    });
    return res.status(200).json({ success: true, id: record.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save nomination' });
  }
};
