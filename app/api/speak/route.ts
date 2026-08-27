export async function POST(request: Request) {
  try {
    const key = process.env.SHISA_API_KEY;
    if (!key) return Response.json({ error: 'SHISA API key is not configured' }, { status: 503 });
    const { text } = await request.json();
    const response = await fetch('https://api.shisa.ai/tts', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ voice_id: 'c3abe79a-99b3-4a5f-8549-f5cb42985291', format: 'mp3', stream: false, text }) });
    if (!response.ok) return Response.json({ error: 'Speech generation failed' }, { status: response.status });
    return new Response(await response.arrayBuffer(), { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Could not generate speech' }, { status: 500 }); }
}
