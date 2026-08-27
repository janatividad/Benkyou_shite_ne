export async function POST(request: Request) {
  try {
    const key = process.env.SHISA_API_KEY;
    if (!key) return Response.json({ error: 'SHISA API key is not configured' }, { status: 503 });
    const { text } = await request.json();
    const voiceId = process.env.SHISA_TTS_VOICE_ID || 'ff5c959b-0c47-4dc9-b008-6237da78ecc1';
    const response = await fetch('https://api.shisa.ai/tts', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ voice_id: voiceId, format: 'mp3', stream: false, text }) });
    if (!response.ok) { const detail = await response.json().catch(() => null); return Response.json({ error: detail?.error || 'Speech generation failed' }, { status: response.status }); }
    return new Response(await response.arrayBuffer(), { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Could not generate speech' }, { status: 500 }); }
}
