export interface LlmTaxonDisambiguation {
  is_animal: boolean;
  confidence?: 'high' | 'medium' | 'low';
  canonical_common_name?: string;
  scientific_name?: string;
  alternative_names?: string[];
  taxonomic_rank?: string;
  classification?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
  };
  description?: string;
  habitat?: string;
  diet?: string;
  distribution?: string;
  conservation_status?: string;
}

// In-memory cache to prevent redundant LLM invocations
const llmCache = new Map<string, { data: LlmTaxonDisambiguation | null; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

function getApiKey(): string | undefined {
  return process.env.DEEPSEEK_API_KEY || process.env.LLM_API_KEY;
}

function getBaseUrl(): string {
  const url = process.env.LLM_BASE_URL || 'https://api.deepseek.com';
  return url.replace(/\/+$/, '');
}

function getModelName(): string {
  return process.env.LLM_MODEL || 'deepseek-flash';
}

/**
 * Disambiguates a wildlife query using the team's LLM API (DeepSeek-V4.1-Flash).
 * Resolves slang, spelling errors, regional terms, and obscure animal queries into
 * verified scientific taxonomy and natural history details.
 */
export async function disambiguateWildlifeQuery(
  query: string,
  externalSignal?: AbortSignal
): Promise<LlmTaxonDisambiguation | null> {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  // Check cache
  const cached = llmCache.get(normalized);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const prompt = `You are a world-class zoologist, evolutionary biologist, and biodiversity taxonomy specialist.
User query: "${query}"

Analyze this query:
1. Determine if this refers to an animal organism (Mammalia, Aves, Reptilia, Amphibia, Actinopterygii, Chondrichthyes, Insecta, Arachnida, Mollusca, Crustacea, Cnidaria, or any Animalia group).
2. If it is definitely NOT an animal (e.g. plant, fungus, inanimate object, vehicle, city, mineral), return {"is_animal": false}.
3. If it IS an animal:
   - Identify the exact canonical animal entity.
   - For ambiguous queries (e.g. "deer" refers to family Cervidae or white-tailed deer; "peacock" refers to Pavo cristatus; "rat" refers to Rattus genus; "dolphin" refers to Delphinidae family / common dolphin), choose the primary animal entity and list key alternative scientific names.
   - For obscure animals or regional names (e.g. "aye aye", "quokka", "binturong", "pink fairy armadillo", "axolotl", "fossa", "narwhal", "pangolin"), determine its canonical accepted binomial species or genus.
   - For spelling errors (e.g. "aligator", "hipopotamus", "komodo dragon"), correct to the accepted taxon.
   - Provide accurate taxonomic hierarchy (kingdom: Animalia, phylum, class, order, family, genus).
   - Provide concise natural history details: 2-3 sentence overview description, native habitat biome, primary diet, geographic distribution, and IUCN conservation status.

Return STRICTLY a JSON object with this exact structure:
{
  "is_animal": true,
  "confidence": "high",
  "canonical_common_name": "Common Name",
  "scientific_name": "Genus species or Genus",
  "alternative_names": ["Name 1", "Name 2"],
  "taxonomic_rank": "SPECIES",
  "classification": {
    "kingdom": "Animalia",
    "phylum": "Chordata",
    "class": "Mammalia",
    "order": "Carnivora",
    "family": "Felidae",
    "genus": "Panthera"
  },
  "description": "Factual 2-3 sentence description...",
  "habitat": "Biome / ecosystem description",
  "diet": "Dietary classification and food items",
  "distribution": "Geographic regions / native continents",
  "conservation_status": "e.g. Least Concern, Vulnerable, Endangered, Critically Endangered"
}
Output only the JSON object, nothing else.`;

  const baseUrl = getBaseUrl();
  const model = getModelName();
  const endpoint = `${baseUrl}/chat/completions`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  // Link external signal if provided
  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });


    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[WildLife Explorer LLM] DeepSeek HTTP ${response.status}: ${await response.text().catch(() => '')}`);
      return null;
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed: LlmTaxonDisambiguation = JSON.parse(content);
    if (!parsed || typeof parsed !== 'object') return null;

    // Cache the result
    llmCache.set(normalized, { data: parsed, timestamp: Date.now() });
    return parsed;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    const err = error as { name?: string; message?: string };
    if (err.name === 'AbortError') {
      console.warn(`[WildLife Explorer LLM] Request timed out for "${query}"`);
    } else {
      console.warn(`[WildLife Explorer LLM] Error disambiguating "${query}":`, err.message ?? error);
    }
    return null;
  }
}
