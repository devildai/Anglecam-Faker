export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured in Vercel' });
    }

    try {
        // Strip out the data type prefix from the Base64 string
        const base64Data = req.body.image.split(',')[1]; 
        
        // Grab the custom prompt sent from the frontend
        const customPrompt = req.body.prompt; 

        // Call Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: customPrompt },
                        { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                    ]
                }]
            })
        });

        // Catch errors from Google's side
        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`Google API responded with status ${response.status}: ${errorDetails}`);
        }

        const result = await response.json();
        
        // Extract the text response
        const aiText = result.candidates[0].content.parts[0].text;

        // Send it back to the frontend
        res.status(200).json({ text: aiText });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ error: error.message || 'Failed to process request' });
    }
}
