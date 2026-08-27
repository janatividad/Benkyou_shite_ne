export async function POST(request: Request) {
  try {
    const key = process.env.SHISA_API_KEY;
    if (!key) return Response.json({ error: 'SHISA API key is not configured' }, { status: 503 });
    const { japanese, translation } = await request.json();
    const response = await fetch('https://api.shisa.ai/openai/v1/chat/completions', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'shisa-ai/shisa-v2.1-llama3.3-70b', temperature: 0.2, stream: false, messages: [
        { role: 'system', content: 'You coach foreign workers in Japan. Given something heard at work, produce one short, polite Japanese response the worker can say and extract exactly 3 useful Japanese keywords from the heard sentence or reply. Return ONLY valid JSON with keys phrase, reading, meaning, intention, vocabulary. vocabulary must be an array of exactly 3 objects with keys jp, reading, en. All readings must be Latin romaji. meaning, intention, and en must be concise English. Never use markdown.' },
        { role: 'user', content: `Heard Japanese: ${japanese}\nEnglish meaning: ${translation}` }
      ] })
    });
    const data = await response.json();
    if (!response.ok) return Response.json({ error: data.error?.message || data.error || 'Coach generation failed' }, { status: response.status });
    const content = data.choices?.[0]?.message?.content || '';
    const cleaned = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    const result = JSON.parse(cleaned);
    if (!result.phrase || !result.meaning || !Array.isArray(result.vocabulary) || result.vocabulary.length < 3) throw new Error('Incomplete coach response');
    result.vocabulary = result.vocabulary.slice(0, 3);
    return Response.json(result);
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Could not generate a response' }, { status: 500 }); }
}
