function config() {
  const uri = process.env.NEO4J_URI, username = process.env.NEO4J_USERNAME, password = process.env.NEO4J_PASSWORD;
  if (!uri || !username || !password) throw new Error('Neo4j is not configured');
  return { host: uri.replace(/^neo4j\+s:\/\//, 'https://').replace(/\/$/, ''), username, password };
}

async function query(statement: string, parameters: Record<string, unknown> = {}) {
  const { host, username, password } = config();
  const configured = process.env.NEO4J_DATABASE || 'neo4j';
  const databases = configured === 'neo4j' ? ['neo4j'] : [configured, 'neo4j'];
  let last: Response | null = null;
  for (const database of databases) {
    const response = await fetch(`${host}/db/${database}/query/v2`, {
      method: 'POST', headers: { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ statement, parameters })
    });
    if (response.ok) return response.json();
    last = response;
    if (response.status !== 404) break;
  }
  const detail = last ? await last.text() : '';
  throw new Error(`Neo4j request failed${detail ? `: ${detail.slice(0, 180)}` : ''}`);
}

export async function POST(request: Request) {
  try {
    const { phrase, reading, meaning, situation } = await request.json();
    const topic = situation === 'At the clinic' ? 'Health' : situation === 'Restaurant' ? 'Food' : 'Daily life';
    await query(`MERGE (u:Learner {id: $userId})
      MERGE (p:Phrase {japanese: $phrase}) SET p.reading=$reading, p.meaning=$meaning
      MERGE (s:Situation {name: $situation}) MERGE (t:Topic {name: $topic})
      MERGE (u)-[:LEARNED]->(p) MERGE (p)-[:USEFUL_IN]->(s) MERGE (p)-[:ABOUT]->(t)`,
      { userId: 'tokyo-hacker', phrase, reading, meaning, situation, topic });
    return Response.json({ ok: true, nodes: ['You', phrase, situation, topic] });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Graph save failed' }, { status: 500 }); }
}
