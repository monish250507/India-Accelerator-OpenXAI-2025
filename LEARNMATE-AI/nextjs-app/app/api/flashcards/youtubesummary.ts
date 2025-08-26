import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { youtubeUrl } = await req.json();

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const prompt = `Summarize the content of the YouTube video at the following URL: ${youtubeUrl}. Provide a concise summary.`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:1b',
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Ollama');
    }

    const data = await response.json();
    return NextResponse.json({ summary: data.response || 'No summary available.' });
  } catch (error) {
    console.error('YouTube Summarizer API error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize YouTube video' },
      { status: 500 }
    );
  }
}
