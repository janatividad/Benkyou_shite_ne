export async function POST(request: Request) {
  try {
    const key = process.env.SHISA_API_KEY;
    if (!key) return Response.json({ error: 'SHISA API key is not configured' }, { status: 503 });
    const form = await request.formData();
    const audio = form.get('audio');
    const language = form.get('language') === 'en' ? 'en' : 'ja';
    if (!(audio instanceof Blob)) return Response.json({ error: 'Audio is required' }, { status: 400 });
    const base64 = Buffer.from(await audio.arrayBuffer()).toString('base64');
    const response = await fetch('https://api.shisa.ai/asr/srt/audio_llm', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ audio: base64, language, hotwords: language === 'ja' ? ['仕込み', '冷蔵庫', '補充'] : [], temperature: 0 }) });
    const data = await response.json();
    if (!response.ok) return Response.json({ error: data.error || 'Transcription failed' }, { status: response.status });
    return Response.json(data);
  } catch { return Response.json({ error: 'Could not process this recording' }, { status: 500 }); }
}
