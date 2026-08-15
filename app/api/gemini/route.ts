import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import {
  AI_FILTER_JSON_SCHEMA,
  AI_SEARCH_SYSTEM_INSTRUCTION,
  buildSearchSummary,
  parseExtractedFilters,
  searchListingsFromFilters,
} from '@/lib/aiSearch';

if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is not set');
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { prompt?: unknown; language?: unknown };
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const language = body.language === 'ru' ? 'ru' : 'en';

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const extractRes = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: `Input: ${prompt}`,
      config: {
        systemInstruction: AI_SEARCH_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseJsonSchema: AI_FILTER_JSON_SCHEMA,
      },
    });

    const filters = parseExtractedFilters(extractRes.text);
    const { listings, total } = await searchListingsFromFilters(filters);
    const text = buildSearchSummary(filters, listings, total, language);

    return NextResponse.json({
      text,
      results: listings,
      total,
      filters,
    });
  } catch (error: unknown) {
    console.error('GEMINI API ROUTE ERROR:', error);
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
