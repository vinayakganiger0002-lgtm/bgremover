export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  // Check if API key is configured
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error('API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error. API key not found.' });
  }

  try {
    // Get the image from the request body
    // The frontend will send the image as base64 or FormData
    let imageBuffer;
    let filename = 'image.png';

    if (req.body) {
      // Handle base64 image string
      if (typeof req.body === 'object' && req.body.image) {
        if (typeof req.body.image === 'string') {
          // Remove data URL prefix if present
          const base64Data = req.body.image.replace(/^data:image\/\w+;base64,/, '');
          imageBuffer = Buffer.from(base64Data, 'base64');
          filename = req.body.filename || 'image.png';
        }
      }
      // Handle raw buffer (if sent directly)
      else if (Buffer.isBuffer(req.body)) {
        imageBuffer = req.body;
      }
    }

    if (!imageBuffer) {
      return res.status(400).json({ error: 'No image provided. Please send an image file.' });
    }

    // Create FormData for Remove.bg API
    // Using form-data package for Node.js compatibility
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    
    // Append the image buffer as a file
    formData.append('image_file', imageBuffer, {
      filename: filename,
      contentType: 'application/octet-stream'
    });
    formData.append('size', 'auto');

    // Call Remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        ...formData.getHeaders()
      },
      body: formData
    });

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.errors?.[0]?.title || `API Error: ${response.status} ${response.statusText}`;
      
      // Return appropriate status code
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key. Please check your configuration.' });
      } else if (response.status === 402) {
        return res.status(402).json({ error: 'API quota exceeded. Please upgrade your plan.' });
      } else if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      } else {
        return res.status(response.status).json({ error: errorMessage });
      }
    }

    // Get the processed image as a buffer
    const imageArrayBuffer = await response.arrayBuffer();
    const processedBuffer = Buffer.from(imageArrayBuffer);

    // Return the processed image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="removed-background.png"');
    return res.status(200).send(processedBuffer);

  } catch (error) {
    console.error('Error processing background removal:', error);
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

