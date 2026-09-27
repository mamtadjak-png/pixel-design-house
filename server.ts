import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ 
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// System Instruction for Pixel Design House AI Studio Director
const STUDIO_DIRECTOR_SYSTEM_INSTRUCTION = `
You are the Lead Creative Director & AI Design Strategist at "Pixel Design House" (Tagline: "Pixels with Purpose").
Pixel Design House is a world-class digital creative studio specializing in:
1. Poster Design (Print & Digital, CMYK 300DPI, typographic hierarchy)
2. Invitation Design (Luxury & Events, tactile foil-stamp specs, stationery suites)
3. Advertisement Design (High-conversion commercial OOH billboards, digital display campaigns)
4. Logo & Brand Identity (Enduring marks, comprehensive brand bibles, vector systems)
5. Social Media Design Systems (Modular Figma carousels, editorial feeds)
6. Video Editing & Motion (Cinematic brand reels, 3D kinetic typography, color grading)
7. Custom Studio Commissions (Generative art, 3D spatial environments, luxury packaging)

Your voice is editorial, intelligent, discerning, inspiring, and concise.
You guide founders and clients to clarify their vision, recommend precise aesthetic pairings (typography, color palettes, layouts), and help formulate creative briefs for Pixel Design House commissions.
Never output AI slop or generic boilerplate. Emphasize deliberate craft and pixels with purpose.
`;

// API endpoint for multi-turn Gemini chat
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages, model = 'gemini-3.5-flash' } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    if (!aiClient) {
      // Return a smart fallback response if no API key is configured
      return res.json({
        reply: "As the Creative Director at Pixel Design House, I recommend starting with our 5-step methodology: Discover your brand's core tension, Plan with a disciplined typography matrix, and Design with mathematical precision. How can I help shape your upcoming commission?",
        modelUsed: 'studio-director-fallback'
      });
    }

    // Format conversation history for Gemini SDK
    // Convert array of { role: 'user' | 'assistant', content: string }
    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content || '' }]
    }));

    // Generate content using GoogleGenAI
    const response = await aiClient.models.generateContent({
      model: model || 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: STUDIO_DIRECTOR_SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    const replyText = response.text || 'Thank you for reaching out to Pixel Design House.';
    return res.json({ reply: replyText, modelUsed: model });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to generate response from Gemini.',
      fallback: "Our studio director is currently in review sessions. Feel free to describe your project requirements in the commission form."
    });
  }
});

// Helper: Extract raw base64 and mimeType
function parseDataUri(dataUri: string) {
  if (dataUri.startsWith('data:')) {
    const parts = dataUri.split(',');
    const match = parts[0].match(/:(.*?);/);
    const mimeType = match ? match[1] : 'image/png';
    const base64 = parts[1];
    return { mimeType, base64 };
  }
  return { mimeType: 'image/png', base64: dataUri };
}

// 1. Text-to-Image Generation
app.post('/api/gemini/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', imageSize = '1K', stylePreset } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let enhancedPrompt = prompt;
    if (stylePreset) {
      enhancedPrompt = `${prompt}. Visual Style: ${stylePreset}. Masterpiece quality, commercial studio art direction, sharp typography and details.`;
    }

    if (!aiClient) {
      return res.json({
        imageUrl: `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80`,
        prompt: enhancedPrompt,
        aspectRatio,
        isSimulated: true,
        notice: 'Studio Preview mode (No active Gemini API key configured in server environment).'
      });
    }

    // Call generateContent with gemini-3.1-flash-image or gemini-3.1-flash-lite-image
    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
            imageSize: imageSize as any,
          }
        }
      });
    } catch (primaryErr: any) {
      console.warn('Falling back to gemini-3.1-flash-lite-image:', primaryErr?.message);
      response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enhancedPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          }
        }
      });
    }

    let imageUrl: string | null = null;
    let textDescription = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textDescription += part.text;
      }
    }

    if (!imageUrl) {
      throw new Error(textDescription || 'No image data returned from model.');
    }

    return res.json({
      imageUrl,
      prompt: enhancedPrompt,
      aspectRatio,
      textDescription
    });
  } catch (err: any) {
    console.error('Image Generation Error:', err);
    return res.status(500).json({
      error: err.message || 'Image generation failed',
      fallbackImageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80'
    });
  }
});

// 2. Image-to-Image Editing
app.post('/api/gemini/edit-image', async (req, res) => {
  try {
    const { prompt, image, aspectRatio = '1:1' } = req.body;
    if (!prompt || !image) {
      return res.status(400).json({ error: 'Prompt and base image are required for image editing' });
    }

    const { mimeType, base64 } = parseDataUri(image);

    if (!aiClient) {
      return res.json({
        imageUrl: image,
        prompt,
        aspectRatio,
        isSimulated: true,
        notice: 'Studio Preview mode (No active Gemini API key configured in server environment).'
      });
    }

    let response;
    try {
      response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64,
                mimeType: mimeType || 'image/png',
              }
            },
            { text: `Edit instructions: ${prompt}. Retain core brand elements with refined studio execution.` }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          }
        }
      });
    } catch (primaryErr: any) {
      console.warn('Falling back to gemini-3.1-flash-lite-image for edit:', primaryErr?.message);
      response = await aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64,
                mimeType: mimeType || 'image/png',
              }
            },
            { text: prompt }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio as any,
          }
        }
      });
    }

    let imageUrl: string | null = null;
    let textDescription = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        textDescription += part.text;
      }
    }

    if (!imageUrl) {
      throw new Error(textDescription || 'No edited image returned from model.');
    }

    return res.json({
      imageUrl,
      prompt,
      aspectRatio,
      textDescription
    });
  } catch (err: any) {
    console.error('Image Editing Error:', err);
    return res.status(500).json({
      error: err.message || 'Image editing failed'
    });
  }
});

// 3. Animate Image into Video (Veo) - Step 1: Start Generation
app.post('/api/gemini/generate-video', async (req, res) => {
  try {
    const { prompt, image, aspectRatio = '16:9', resolution = '720p', cameraMotion } = req.body;
    
    let combinedPrompt = prompt || 'Cinematic studio camera movement with elegant dynamic lighting and subtle parallax.';
    if (cameraMotion) {
      combinedPrompt = `${combinedPrompt}. Camera direction: ${cameraMotion}. High production aesthetic.`;
    }

    if (!aiClient) {
      // Simulate video operation if no API key
      const mockOpName = `simulated/operations/veo-${Date.now()}`;
      return res.json({
        operationName: mockOpName,
        isSimulated: true,
        aspectRatio,
        message: 'Studio preview operation initiated'
      });
    }

    let imagePayload = undefined;
    if (image) {
      const { mimeType, base64 } = parseDataUri(image);
      imagePayload = {
        imageBytes: base64,
        mimeType: mimeType || 'image/png'
      };
    }

    const operation = await aiClient.models.generateVideos({
      model: 'veo-3.1-lite-generate-preview',
      prompt: combinedPrompt,
      image: imagePayload,
      config: {
        numberOfVideos: 1,
        resolution: resolution === '1080p' ? '1080p' : '720p',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9'
      }
    });

    return res.json({
      operationName: operation.name,
      aspectRatio
    });
  } catch (err: any) {
    console.error('Veo Video Start Error:', err);
    // Provide friendly fallback if quota or model restriction is hit
    return res.status(500).json({
      error: err.message || 'Failed to start video generation',
      fallbackNotice: 'Veo video generation requires access permissions or paid tier quota in Google Cloud.'
    });
  }
});

// 4. Animate Image into Video (Veo) - Step 2: Poll Status
app.post('/api/gemini/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    // If simulated
    if (operationName.startsWith('simulated/')) {
      return res.json({
        done: true,
        isSimulated: true,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      });
    }

    if (!aiClient) {
      return res.json({ done: true, isSimulated: true });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await aiClient.operations.getVideosOperation({ operation: op });

    return res.json({
      done: updated.done,
      error: updated.error
    });
  } catch (err: any) {
    console.error('Video Status Polling Error:', err);
    return res.status(500).json({ error: err.message || 'Polling error' });
  }
});

// 5. Animate Image into Video (Veo) - Step 3: Download & Stream Video
app.post('/api/gemini/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    if (operationName.startsWith('simulated/')) {
      return res.redirect('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    }

    if (!aiClient || !apiKey) {
      return res.status(400).json({ error: 'No API key available for download' });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await aiClient.operations.getVideosOperation({ operation: op });

    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found in completed operation' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey }
    });

    if (!videoRes.ok) {
      throw new Error(`Failed to fetch video stream: ${videoRes.statusText}`);
    }

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline; filename="pixel-studio-animation.mp4"');

    const arrayBuffer = await videoRes.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err: any) {
    console.error('Video Download Error:', err);
    return res.status(500).json({ error: err.message || 'Failed to stream video' });
  }
});

// Vite Middleware for development
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  // Production static files
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Pixel Design House server listening on port ${port}`);
});
