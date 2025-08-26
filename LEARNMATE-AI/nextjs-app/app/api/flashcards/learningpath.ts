import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { studentData } = await req.json();

    if (!studentData) {
      return NextResponse.json(
        { error: 'Student data is required' },
        { status: 400 }
      );
    }

    const prompt = `Analyze the following student data and recommend a personalized study plan: ${JSON.stringify(studentData)}`;

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
    return NextResponse.json({ studyPlan: data.response || 'No study plan available.' });
  } catch (error) {
    console.error('Personal Learning Path API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate study plan' },
      { status: 500 }
    );
  }
}
