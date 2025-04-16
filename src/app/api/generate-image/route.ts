import Replicate from 'replicate';
import { NextResponse } from 'next/server';

// Fallback GIFs/stickers for when AI generation fails
const FALLBACK_IMAGES = [
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtbjlpY2JnOXQyOWIyeWF0NnEzNWRxNnJ5NnJxdWV1ZWdlNmxrayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKr3nzbh5WgCFxe/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWJqcWNxeGJxcXRkNGdnNHZlZnRnNnRnbWZnZnVlcnJlZGJlZWZlYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHZqZXJtdGJjMWZkMnRkZnFqcnRxdWJtZnFwdGJlZXRqZGVnMWJnZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjHAUOqG3lSS0f1C/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGZqZWdnbXVtcnFtZXVtbWJjcnRnbWNlcWVxZnVnZWRtcWJlcWJnYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT0xeJpnrWC4XWblEk/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHRqbWZnZXVnZnJnbWZxZXJxdWVxdGJnZnRnZXJnZXJnZnRnZXJnZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46CyJmS9N2fpmqeQ/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVxZnRnZXJnZXJnZnRnZXJnZXJnZnRnZXJnZXJnZnRnZXJnZXJnZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKr3nzbh5WgCFxe/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXJnZXJnZnRnZXJnZXJnZnRnZXJnZXJnZnRnZXJnZXJnZnRnZXJnZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2VyZ2VyZ2Z0Z2VyZ2VyZ2Z0Z2VyZ2VyZ2Z0Z2VyZ2VyZ2Z0Z2VyZ2UmZXA9djFfaW50ZXJuYWxfZ2lmX2J5X2lkJmN0PWc/3oEjHAUOqG3lSS0f1C/giphy.gif',
];

// Get a random fallback image
function getRandomFallbackImage() {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  return FALLBACK_IMAGES[randomIndex];
}

export async function POST(request) {
  try {
    const { promptText } = await request.json();
    
    if (!promptText || promptText.trim() === '') {
      return NextResponse.json(
        { error: 'Prompt text is required' },
        { status: 400 }
      );
    }

    // Initialize Replicate client
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Use a cartoon-style image generation model
    // black-forest-labs/flux-pro is a good option for cartoon-style images
    const output = await replicate.run(
      "black-forest-labs/flux-pro:b5c0d8b6c2f2a3d0b2d2b2d2b2d2b2d2b2d2b2d2b2d2b2d2b2d2b2d2b2d2b2",
      {
        input: {
          prompt: promptText,
          style: "cartoon",
          width: 768,
          height: 768,
          num_inference_steps: 25,
          guidance_scale: 7.5,
          negative_prompt: "ugly, deformed, disfigured, poor quality, low quality",
        },
      }
    );

    // Check if we got a valid image URL
    if (output && output.length > 0 && typeof output[0] === 'string') {
      return NextResponse.json({ imageUrl: output[0] });
    } else {
      // If AI generation fails, use a fallback image
      return NextResponse.json({ 
        imageUrl: getRandomFallbackImage(),
        fallback: true
      });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Return a fallback image in case of any error
    return NextResponse.json({ 
      imageUrl: getRandomFallbackImage(),
      fallback: true,
      error: error.message
    });
  }
}
