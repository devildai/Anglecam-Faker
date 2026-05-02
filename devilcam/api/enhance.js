// api/enhance.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // Vercel safely stores your key here, away from the user
  const apiKey = process.env.GEMINI_API_KEY; 
  const imageData = req.body.image; // The image sent from your website

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         // ... Your Gemini API payload goes here ...
      })
    });

    const data = await response.json();
    res.status(200).json(data); // Send result back to your website
  } catch (error) {
    res.status(500).json({ error: 'Failed to enhance image' });
  }
}
