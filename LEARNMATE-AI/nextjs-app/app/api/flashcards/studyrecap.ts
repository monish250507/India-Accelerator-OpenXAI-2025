import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { notes } = await req.json();

    if (!notes) {
      return NextResponse.json(
        { error: 'Notes are required' },
        { status: 400 }
      );
    }

    const prompt = `Summarize the following study session notes and suggest next steps: ${notes}`;

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
    return NextResponse.json({ recap: data.response || 'No recap available.' });
  } catch (error) {
    console.error('Study Assistant API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate study recap' },
      { status: 500 }
    );
  }
}
