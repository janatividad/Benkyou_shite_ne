export async function POST(request: Request) {
  try {
    const key = process.env.SHISA_API_KEY;
    if (!key) return Response.json({ error: 'SHISA API key is not configured' }, { status: 503 });
    const { text, sourceLang = 'ja' } = await request.json();
    const body = new FormData(); body.append('text', text); body.append('source_lang', sourceLang); body.append('target_lang', sourceLang === 'en' ? 'ja' : 'en'); body.append('stream', 'false');
    const response = await fetch('https://api.shisa.ai/translate/', { method: 'POST', headers: { Authorization: `Bearer ${key}` }, body });
    const data = await response.json();
    if (!response.ok) return Response.json({ error: data.error || 'Translation failed' }, { status: response.status });
    return Response.json({ translation: data.choices?.[0]?.message?.content || data.translation || '' });
  } catch { return Response.json({ error: 'Could not translate this text' }, { status: 500 }); }
}
