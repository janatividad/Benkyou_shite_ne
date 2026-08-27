# Nihongo Lens

**Understand it. Use it at work.**

Nihongo Lens is a five-minute Japanese learning companion for foreign workers living in Japan. It turns a real workplace conversation—or something the user wants to say in English—into an understandable translation, a natural Japanese reply, audio practice, a practical shift mission, and personalized review cards.

Live demo: [nihongo-lens-tokyo.lr-janatividad.chatgpt.site](https://nihongo-lens-tokyo.lr-janatividad.chatgpt.site)

## The product loop

1. **See it** — Type or record Japanese heard at work, or switch to English and describe what you need to say.
2. **Understand it** — SHISA translates the input and explains the workplace intention.
3. **Say it** — SHISA generates a short, polite Japanese reply with romaji, English meaning, and text-to-speech audio.
4. **Use it** — Take one practical shift mission and record whether it worked, was forgotten, or was difficult.
5. **Review it** — Practice three conversation-specific vocabulary cards and save them to a Neo4j knowledge graph.

## Main features

- Japanese and English text input
- Japanese and English microphone recording
- SHISA speech-to-text transcription
- Japanese ↔ English translation
- AI-generated workplace replies and cultural context
- Japanese text-to-speech with a device-voice fallback
- Dynamic two-minute vocabulary review
- Neo4j-backed phrase and flashcard storage
- Visible learning knowledge graph
- Responsive desktop and mobile interface

## Technology

- Next.js-compatible application built with Vinext and React
- TypeScript and Tailwind CSS
- SHISA APIs for speech recognition, translation, language generation, and speech synthesis
- Neo4j Aura Query API for graph persistence
- OpenAI Sites-compatible deployment

## Run locally

### Requirements

- Node.js 22.13 or later
- npm
- A SHISA API key
- A Neo4j Aura database

### 1. Clone and install

```bash
git clone https://github.com/janatividad/Benkyou_shite_ne.git
cd Benkyou_shite_ne
npm install
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Fill in `.env` with your own credentials:

```dotenv
SHISA_API_KEY=your_shisa_api_key
SHISA_TTS_VOICE_ID=your_shisa_voice_id
NEO4J_URI=neo4j+s://your-instance.databases.neo4j.io
NEO4J_USERNAME=your_neo4j_username
NEO4J_PASSWORD=your_neo4j_password
NEO4J_DATABASE=your_neo4j_database
```

Never commit `.env`. It is already excluded by `.gitignore`.

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). If the terminal prints a different address, use that address instead.

### 4. Create a production build

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```

## How to use the app

1. Choose a workplace situation, such as receiving an instruction or reporting that something is running out.
2. In Section 1, select **日本語** or **ENGLISH**.
3. Type a sentence, or click **Record Japanese/English**, speak, and click **Stop & transcribe**.
4. Review the translation and workplace intention in Section 2.
5. Practice the generated Japanese response in Section 3. Click **Listen** to hear it.
6. Click **Remember** to save the response to Neo4j.
7. Complete the shift-mission feedback in Section 4.
8. Flip the review cards in Section 5 and add useful words to the Neo4j review schedule.

## API routes

| Route | Purpose |
| --- | --- |
| `POST /api/transcribe` | Converts recorded WAV audio to text with SHISA ASR |
| `POST /api/translate` | Translates Japanese ↔ English with SHISA |
| `POST /api/coach` | Generates a workplace reply, intention, and vocabulary |
| `POST /api/speak` | Generates Japanese MP3 audio with SHISA TTS |
| `POST /api/graph` | Saves phrases, flashcards, situations, and topics to Neo4j |

All credentials are read only on the server. They are never included in the browser bundle.

## Neo4j learning graph

Nihongo Lens stores learning as connected knowledge rather than isolated cards:

```text
Learner → Phrase/Flashcard → Situation → Topic
```

This makes it possible to build later features such as spaced review, difficult-phrase prioritization, workplace-specific progress, and related phrase recommendations.

## Safety

The app encourages learners to practice before or after work and during safe breaks. It should not be used while operating machinery, handling hot food, driving, or performing hazardous work.

## Built at Fast Hacks Tokyo

Created for **OpenAI Codex — Fast Hacks in Tokyo**, August 27, 2026, with SHISA for Japanese AI capabilities and Neo4j for connected learning memory.
