import {
  createReadStream,
  existsSync,
  mkdirSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { OpenAI } from 'openai';
import { env } from '../env.ts';

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

type TranscribeAudioProps = {
  data: Buffer;
};

export async function transcribeAudio({ data }: TranscribeAudioProps) {
  const dirPath = 'tmp';

  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  const filePath = 'tmp/input.webm';

  writeFileSync(filePath, data);

  const readStream = createReadStream(filePath);

  const response = await client.audio.transcriptions.create({
    model: 'whisper-1',
    file: readStream,
  });
  unlinkSync(filePath);
  return response.text;
}

export async function generateEmbeddings(text: string) {
  const response = await client.embeddings.create({
    input: text,
    model: 'text-embedding-3-small',
  });

  const data = response.data;

  if (!data || data.length === 0 || !data[0].embedding) {
    return null;
  }

  return data[0].embedding;
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  const context = transcriptions.join('\n');

  const prompt =
    `Você é um assistente que responde perguntas com base **exclusivamente** no conteúdo fornecido abaixo.

Responda de forma **objetiva, clara e direta**, utilizando o português do Brasil. Utilize o termo "conteúdo da aula" sempre que fizer referência ao texto fornecido.

### CONTEXTO (conteúdo da aula):
${context}

### PERGUNTA:
${question}

### INSTRUÇÕES IMPORTANTES:
- Se a resposta não estiver claramente presente no conteúdo da aula, diga apenas: "Não há informações suficientes no conteúdo da aula para responder a essa pergunta."
- Seja direto ao ponto, evitando explicações desnecessárias ou informações irrelevantes.
- Caso parte do conteúdo esteja em outro idioma, traduza para o português e avise o usuário que o trecho original estava em outro idioma.
- Evite qualquer tipo de suposição ou invenção de informações.
`.trim();

  const response = await client.responses.create({
    model: 'gpt-3.5-turbo-0125',
    input: prompt,
  });
  return response.output_text;
}
