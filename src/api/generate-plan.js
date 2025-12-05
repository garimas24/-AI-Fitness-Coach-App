// api/generate-plan.js  (CommonJS, server-side only — DO NOT bundle to client)
const { z } = require('zod');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.warn('Missing OPENAI_API_KEY env var');
}

// Zod schema for validation of model output (adjust fields if you change the prompt/doc)
const ExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().optional(),
  sets: z.number().optional(),
  reps: z.string().optional(),
  restSeconds: z.number().optional(),
  notes: z.string().optional()
});

const DaySchema = z.object({
  day: z.string(),
  focus: z.string().optional(),
  durationMinutes: z.number().optional(),
  exercises: z.array(ExerciseSchema)
});

const WorkoutPlanSchema = z.object({
  weekSummary: z.string(),
  days: z.array(DaySchema)
});

const DietPlanSchema = z.object({
  summary: z.string(),
  meals: z.object({
    breakfast: z.array(z.string()),
    lunch: z.array(z.string()),
    snacks: z.array(z.string()),
    dinner: z.array(z.string())
  })
});

const PlanSchema = z.object({
  meta: z.object({
    name: z.string(),
    age: z.number().optional(),
    gender: z.string().optional(),
    goal: z.string().optional(),
    date: z.string().optional()
  }),
  workoutPlan: WorkoutPlanSchema,
  dietPlan: DietPlanSchema,
  workouts: z.array(ExerciseSchema).optional(),
  meals: z.array(z.object({
    id: z.string(),
    name: z.string(),
    calories: z.number().optional(),
    description: z.string().optional()
  })).optional(),
  tips: z.array(z.string()).optional(),
  motivation: z.string().optional()
});

// Helper to extract JSON substring if model wraps it in text
function extractJsonFromText(text) {
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1) return null;
  const raw = text.slice(first, last + 1);
  return raw;
}

module.exports = async function (req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const user = req.body.user || req.body; // support both shapes
    if (!user || !user.name) return res.status(400).json({ error: 'Missing user data' });

    // Build system + user prompts (structured)
    const systemPrompt = `
You are an expert certified fitness coach and registered dietitian. When asked, you MUST return exactly one JSON object and nothing else. The JSON must follow the schema described below. Do not add explanations, code fences, or any extra text outside the JSON object.
`;

    const userPrompt = `
User: ${user.name}, age ${user.age ?? 'unknown'}, gender ${user.gender ?? 'unknown'}, height ${user.heightCm ?? 'unknown'} cm, weight ${user.weightKg ?? 'unknown'} kg.
Fitness goal: ${user.goal ?? 'general_fitness'}.
Level: ${user.level ?? 'beginner'}.
Location: ${user.location ?? 'home'}.
Diet preference: ${user.dietPref ?? 'veg'}.
Medical: ${user.medical ?? 'none'}.
Stress: ${user.stress ?? 'medium'}.

Constraints:
- Output only JSON. Follow this structure exactly:
{
  "meta": {"name": string, "age": number, "gender": string, "goal": string, "date": "YYYY-MM-DD"},
  "workoutPlan": {"weekSummary": string, "days": [{"day": string, "focus": string, "durationMinutes": number, "exercises": [{"id": string, "name": string, "type": string, "sets": number, "reps": string, "restSeconds": number, "notes": string}]}]},
  "dietPlan": {"summary": string, "meals": {"breakfast": [string], "lunch": [string], "snacks": [string], "dinner": [string]}},
  "workouts": [{"id": string, "name": string, "sets": number, "reps": string, "restSeconds": number, "notes": string}],
  "meals": [{"id": string, "name": string, "calories": number, "description": string}],
  "tips": [string],
  "motivation": string
}
- Keep values concise and machine-parseable (numbers for sets/rest when possible).
- Provide substitution options if equipment is missing (e.g., dumbbells -> bodyweight alternative).
`;

    // Call OpenAI Chat Completions API
    // Using POST to https://api.openai.com/v1/chat/completions
    const payload = {
      model: 'gpt-4o-mini', // change to model you have access to; can use gpt-4o or gpt-4o-mini or gpt-3.5-turbo
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 2000
    };

    const openAIResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!openAIResp.ok) {
      const text = await openAIResp.text();
      console.error('OpenAI error:', openAIResp.status, text);
      return res.status(500).json({ error: 'LLM provider error', details: text });
    }

    const openaiJson = await openAIResp.json();
    const assistantText = openaiJson.choices?.[0]?.message?.content ?? '';
    // try to extract JSON
    let jsonStr = extractJsonFromText(assistantText) ?? assistantText;

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      // If parse fails, return an error with assistant text for debugging
      console.error('Failed to parse JSON from model:', e.message);
      return res.status(500).json({ error: 'Failed to parse JSON from model', assistantText });
    }

    // Validate with zod
    const validated = PlanSchema.safeParse(parsed);
    if (!validated.success) {
      console.error('Validation errors:', validated.error.format());
      return res.status(500).json({ error: 'Validation failed', details: validated.error.errors, assistantText });
    }

    // Success — return validated.data
    return res.status(200).json({ plan: validated.data });

  } catch (err) {
    console.error('Unexpected server error', err);
    return res.status(500).json({ error: 'Unexpected server error', message: err.message });
  }
};
