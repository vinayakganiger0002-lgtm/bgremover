export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // NEW: use your Replicate token
  const replicateToken = process.env.REPLICATE_API_TOKEN;
  if (!replicateToken) {
    console.error('REPLICATE_API_TOKEN environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error. API key not found.' });
  }

  try {
    let imageBuffer;
    let filename = 'image.png';

    if (req.body) {
      if (typeof req.body === 'object' && req.body.image) {
        if (typeof req.body.image === 'string') {
          const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
          imageBuffer = Buffer.from(base64Data, 'base64');
          filename = req.body.filename || 'image.png';
        }
      } else if (Buffer.isBuffer(req.body)) {
        imageBuffer = req.body;
      }
    }

    if (!imageBuffer) {
      return res.status(400).json({ error: 'No image provided. Please send an image file.' });
    }

    // 1) Upload image buffer to a temporary URL that Replicate can read.
    // Simplest option: convert to base64 and pass as data URL (if model supports it).
    const base64 = imageBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    // 2) Call Replicate predictions API
    const createRes = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Use the latest version from the model’s API tab
        version: 'd074564ce6815285f6a7a2b641d1dabe86c97aaeb02fc573dc4869089e05df75', // example [web:195]
        input: {
          // According to the schema, the field is input_image_path; this model also accepts data URLs. [web:192][web:195]
          input_image_path: dataUrl,
        },
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      console.error('Replicate create error:', err);
      return res.status(500).json({ error: 'Failed to start background removal.' });
    }

    let prediction = await createRes.json();

    // 3) Poll until done
    while (prediction.status === 'starting' || prediction.status === 'processing') {
      await new Promise(r => setTimeout(r, 1000));
      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: { 'Authorization': `Bearer ${replicateToken}` },
      });
      prediction = await pollRes.json();
    }

    if (prediction.status !== 'succeeded') {
      console.error('Replicate failed:', prediction);
      return res.status(500).json({ error: 'Background removal failed.' });
    }

    // prediction.output is a URL to the processed PNG. [web:195]
    const outputUrl = prediction.output;
    const imgRes = await fetch(outputUrl);
    const arrayBuf = await imgRes.arrayBuffer();
    const processedBuffer = Buffer.from(arrayBuf);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="removed-background.png"');
    return res.status(200).send(processedBuffer);

  } catch (error) {
    console.error('Error processing background removal:', error);
    return res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
}
