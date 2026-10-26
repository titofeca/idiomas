// AI Service for LinguaQuest: OpenRouter, DeepSeek, and Gemini integration
import { AiConfig, AiChatResponse, Language, DailyTopic, MangaCompanion } from '../types';

const STORAGE_KEY = 'lq_ai_config';

const envOpenRouter = (import.meta as any).env?.VITE_OPENROUTER_API_KEY || '';
const envDeepseek = (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || '';
const envGemini = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

const defaultProvider = envDeepseek && !envOpenRouter ? 'deepseek' : envGemini && !envOpenRouter ? 'gemini' : 'openrouter';
const defaultModel = defaultProvider === 'deepseek' ? 'deepseek-chat' : defaultProvider === 'gemini' ? 'gemini-2.0-flash' : 'deepseek/deepseek-chat';
const defaultKey = envOpenRouter || envDeepseek || envGemini || '';

const DEFAULT_CONFIG: AiConfig = {
  provider: defaultProvider,
  apiKey: defaultKey,
  model: defaultModel,
  temperature: 0.7,
  enabled: true,
};

export interface ChatContextParams {
  language: Language;
  userRole: 'son' | 'father';
  primaryCompanion: MangaCompanion;
  secondaryCompanion?: MangaCompanion;
  isGroupMode: boolean;
  topic: DailyTopic;
  userSpokenText: string;
  conversationHistory: { sender: 'user' | 'bot'; text: string; companionName?: string }[];
}

class AiService {
  private config: AiConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  public loadConfig(): AiConfig {
    if (typeof window === 'undefined') return DEFAULT_CONFIG;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load AI config from storage', e);
    }
    return DEFAULT_CONFIG;
  }

  public saveConfig(newConfig: AiConfig): void {
    this.config = newConfig;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    }
  }

  public getConfig(): AiConfig {
    return { ...this.config };
  }

  public isKeyConfigured(): boolean {
    return Boolean(this.config.apiKey && this.config.apiKey.trim().length > 4);
  }

  /**
   * Test connection to the configured AI API
   */
  public async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.isKeyConfigured()) {
      return {
        success: false,
        message: 'No has introducido ninguna API Key. Configura tu clave de OpenRouter o DeepSeek.',
      };
    }

    try {
      const testPrompt = 'Say "LinguaQuest connection successful!" in 1 short sentence.';
      const res = await this.callRawApi(testPrompt, 'You are an AI assistant.');
      if (res) {
        return {
          success: true,
          message: `¡Conexión verificada con éxito con ${this.config.provider} (${this.config.model})!`,
        };
      }
      return { success: false, message: 'La API no devolvió contenido.' };
    } catch (err: any) {
      return {
        success: false,
        message: `Error al conectar: ${err?.message || 'Revisa tu clave y saldo de API.'}`,
      };
    }
  }

  /**
   * Send a user turn to the AI tutor and receive an evaluated, formatted in-character response
   */
  public async generateTutorResponse(params: ChatContextParams): Promise<AiChatResponse> {
    // If AI is disabled or no key is provided, use procedural built-in fallback
    if (!this.config.enabled || !this.isKeyConfigured() || this.config.provider === 'builtin') {
      return this.generateProceduralFallback(params);
    }

    try {
      const systemPrompt = this.buildSystemPrompt(params);
      const userMessage = this.buildUserPrompt(params);

      const rawContent = await this.callRawApi(userMessage, systemPrompt);
      const parsed = this.parseAiResponse(rawContent, params);
      return parsed;
    } catch (err) {
      console.warn('AI API Call failed, switching seamlessly to procedural fallback:', err);
      const fallback = this.generateProceduralFallback(params);
      fallback.coachTip = `(Modo Local) ${fallback.coachTip || '¡Bien pronunciado!'}`;
      return fallback;
    }
  }

  private buildSystemPrompt(params: ChatContextParams): string {
    const { language, userRole, primaryCompanion, secondaryCompanion, isGroupMode, topic } = params;
    const isSon = userRole === 'son';

    const langName = language === 'zh' ? 'Mandarin Chinese (Simplified & Pinyin)' : 'Modern English';
    const learnerRoleDesc = isSon
      ? 'a 13-year-old student (teenager, enthusiastic, likes gaming, manga, school, fun topics)'
      : 'the father (an adult professional, focused on travel, precision, natural conversation, confidence)';

    let groupPrompt = '';
    if (isGroupMode && secondaryCompanion) {
      groupPrompt = `
You must also include a secondary response for the second participant in the room: "${secondaryCompanion.name}" (${secondaryCompanion.title}, personality: ${secondaryCompanion.personality}).
`;
    }

    return `You are an elite, highly engaging language tutor inside "LinguaQuest".
You are currently roleplaying as:
1. PRIMARY TUTOR: "${primaryCompanion.name}" (${primaryCompanion.title}).
Personality & Tone: ${primaryCompanion.personality}. Style: ${primaryCompanion.mangaStyle}.
${groupPrompt}
Current Learning Language: ${langName}.
Current Topic: "${topic.title}" (${topic.category}).
Topic Grammar / Key Rule: ${topic.keyGrammarRule.explanation} (Sample: ${topic.keyGrammarRule.sample}).
The human user talking to you is ${learnerRoleDesc}.

CRITICAL INSTRUCTIONS:
1. Always stay in character as ${primaryCompanion.name}. Speak in ${language === 'zh' ? 'ultra-clear beginner Chinese (short, simple, conversational)' : 'natural English'} at the appropriate level.
${language === 'zh' ? `
SPECIAL RULES FOR CHINESE (STARTING FROM ZERO):
- The learner and his 13-year-old son are absolute beginners starting from zero with no prior Chinese knowledge.
- Keep Chinese tutor replies concise (1 single sentence, max 10 characters).
- ALWAYS provide complete, accurate Pinyin with tone marks in 'pinyin'.
- In 'coachTip', explain the pronunciation in plain Spanish (e.g., tone direction: 1º plano, 2º sube, 3º baja y sube, 4º baja tajante) and break down syllables.
- Keep 'suggestedResponses' very easy to pronounce (e.g., "Nǐ hǎo!", "Xièxie!", "Hǎo de!").
` : ''}
2. Provide constructive feedback on what the user said (grammar, natural pronunciation tip, or praise) in Spanish.
3. If the user spoke in Chinese, ALWAYS provide accurate Pinyin with tone marks.
4. Keep the response concise, interactive, and encouraging (1 to 2 sentences). Ask an engaging follow-up question.
5. Provide 2 quick suggested responses that the learner can say next.
${isGroupMode && secondaryCompanion ? `6. Provide a short 1-sentence comment from ${secondaryCompanion.name} reacting to the user.` : ''}

You MUST output ONLY a valid JSON object with NO extra markdown fences outside, adhering strictly to this schema:
{
  "reply": "Tutor response in ${language === 'zh' ? 'Chinese' : 'English'}",
  "pinyin": ${language === 'zh' ? '"Accurate Pinyin with tone marks"' : 'null'},
  "translation": "Spanish translation of the tutor response",
  "coachTip": "Constructive feedback or grammar correction in Spanish (e.g. 'Genial uso del tiempo verbal' or 'Tip: mejor decir...')",
  "pronunciationScore": 88,
  "suggestedResponses": [
    "Option 1 for user to reply next",
    "Option 2 for user to reply next"
  ]${isGroupMode && secondaryCompanion ? `,
  "secondaryCompanionReply": "Short comment from ${secondaryCompanion.name} in ${language === 'zh' ? 'Chinese' : 'English'}",
  "secondaryCompanionPinyin": ${language === 'zh' ? '"Pinyin for secondary reply"' : 'null'},
  "secondaryCompanionTranslation": "Spanish translation of secondary reply"` : ''}
}`;
  }

  private buildUserPrompt(params: ChatContextParams): string {
    const historyLines = params.conversationHistory
      .slice(-4)
      .map((m) => `${m.companionName || (m.sender === 'user' ? 'Learner' : 'Tutor')}: ${m.text}`)
      .join('\n');

    return `Recent dialogue context:\n${historyLines}\n\nLearner just said (by voice or text):\n"${params.userSpokenText}"\n\nPlease evaluate and respond in JSON as instructed.`;
  }

  private async callRawApi(userPrompt: string, systemPrompt: string): Promise<string> {
    const { provider, apiKey, model, temperature } = this.config;

    if (provider === 'openrouter') {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
          'HTTP-Referer': 'https://linguaquest.app',
          'X-Title': 'LinguaQuest',
        },
        body: JSON.stringify({
          model: model || 'deepseek/deepseek-chat',
          temperature: temperature ?? 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter HTTP ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      return json.choices?.[0]?.message?.content || '';
    } else if (provider === 'deepseek') {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey.trim()}`,
        },
        body: JSON.stringify({
          model: model || 'deepseek-chat',
          temperature: temperature ?? 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek HTTP ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      return json.choices?.[0]?.message?.content || '';
    } else if (provider === 'gemini') {
      const geminiModel = model || 'gemini-2.0-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: temperature ?? 0.7,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini HTTP ${response.status}: ${errorText}`);
      }

      const json = await response.json();
      return json.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    throw new Error(`Proveedor desconocido: ${provider}`);
  }

  private parseAiResponse(raw: string, params: ChatContextParams): AiChatResponse {
    let clean = raw.trim();
    // Remove markdown code fences if model returned them
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    try {
      const parsed = JSON.parse(clean);
      return {
        reply: parsed.reply || (params.language === 'zh' ? '你说得很好！' : 'Well said!'),
        pinyin: parsed.pinyin || undefined,
        translation: parsed.translation || '¡Bien dicho!',
        coachTip: parsed.coachTip || '¡Gran fluidez y dicción natural!',
        pronunciationScore: typeof parsed.pronunciationScore === 'number' ? parsed.pronunciationScore : 90,
        suggestedResponses: Array.isArray(parsed.suggestedResponses) ? parsed.suggestedResponses : [],
        secondaryCompanionReply: parsed.secondaryCompanionReply || undefined,
        secondaryCompanionPinyin: parsed.secondaryCompanionPinyin || undefined,
        secondaryCompanionTranslation: parsed.secondaryCompanionTranslation || undefined,
        isAiGenerated: true,
      };
    } catch (e) {
      console.warn('Could not parse JSON response from LLM, using extracted text', e, clean);
      return {
        reply: clean.slice(0, 200),
        translation: 'Respuesta generada por IA',
        coachTip: 'Excelente intento con vocabulario en contexto.',
        pronunciationScore: 88,
        suggestedResponses: [],
        isAiGenerated: true,
      };
    }
  }

  private generateProceduralFallback(params: ChatContextParams): AiChatResponse {
    const { language, userSpokenText, topic, secondaryCompanion, isGroupMode } = params;
    const lower = userSpokenText.toLowerCase();

    // Match dialogue flow keyword
    const matched = topic.botRoleplay.dialogueFlow.find((flow) =>
      flow.triggerUserContains.some((kw) => lower.includes(kw.toLowerCase()))
    );

    let reply = '';
    let pinyin: string | undefined = undefined;
    let translation = '';
    let coachTip = '';
    let suggestedResponses: string[] = [];

    if (matched) {
      reply = matched.botResponse;
      pinyin = matched.pinyin;
      translation = matched.translation;
      coachTip = matched.feedbackNote || '¡Muy buena pronunciación!';
      suggestedResponses = matched.nextSuggestions;
    } else {
      if (language === 'zh') {
        reply = '你说得很地道！而且发音越来越清晰了。继续保持这个状态！';
        pinyin = 'Nǐ shuō de hěn dìdao! Érqiě fāyīn yuèláiyuè qīngchu le. Jìxù bǎochí zhè ge zhuàngtài!';
        translation = '¡Lo has dicho de forma muy auténtica! Tu pronunciación es cada vez más clara. ¡Sigue así!';
        coachTip = 'Control de tonos y ritmo muy acertado.';
        suggestedResponses = [
          '太好了，我想多练习一下！ (Tài hǎo le, wǒ xiǎng duō liànxí yíxià!)',
          '请问你可以再说慢一点吗？ (Qǐngwèn nǐ kěyǐ zài shuō màn yìdiǎn ma?)',
        ];
      } else {
        reply = 'Fantastic effort! Your rhythm is sounding more natural every day. Keep that momentum going!';
        translation = '¡Fantástico esfuerzo! Tu ritmo suena cada día más natural. ¡Mantén ese impulso!';
        coachTip = 'Great sentence melody and connected speech!';
        suggestedResponses = [
          'I totally agree with that plan.',
          'Let’s take the lead together.',
          'Could you repeat that once more, please?',
        ];
      }
    }

    let secondaryReply: string | undefined = undefined;
    let secondaryPinyin: string | undefined = undefined;
    let secondaryTrans: string | undefined = undefined;

    if (isGroupMode && secondaryCompanion) {
      if (language === 'en') {
        if (secondaryCompanion.id === 'arthur') {
          secondaryReply = 'Indeed! An exquisite choice of phrasing. Composure and precision always win!';
          secondaryTrans = '¡En efecto! Una elección de frases exquisita. ¡La compostura y la precisión siempre vencen!';
        } else {
          secondaryReply = 'Yeah! Totally agreed, let’s keep this hype going, nice job on the mic!';
          secondaryTrans = '¡Eso es! Totalmente de acuerdo, mantengamos este ritmo, ¡genial al micro!';
        }
      } else {
        if (secondaryCompanion.id === 'long') {
          secondaryReply = '发音沉稳有力，颇有大师风范。继续保持！';
          secondaryPinyin = 'Fāyīn chénwěn yǒulì, pō yǒu dàshī fēngfàn. Jìxù bǎochí!';
          secondaryTrans = 'Tu pronunciación es firme y pausada, con aire de gran maestro. ¡Sigue así!';
        } else {
          secondaryReply = '对呀！声音非常好听，我给你点个大大的赞！';
          secondaryPinyin = 'Duì ya! Shēngyīn fēicháng hǎotīng, wǒ gěi nǐ diǎn gè dàdà de zàn!';
          secondaryTrans = '¡Eso es! Tu voz suena súper bien, ¡te doy un gran aplauso!';
        }
      }
    }

    return {
      reply,
      pinyin,
      translation,
      coachTip,
      pronunciationScore: 86 + Math.floor(Math.random() * 12),
      suggestedResponses,
      secondaryCompanionReply: secondaryReply,
      secondaryCompanionPinyin: secondaryPinyin,
      secondaryCompanionTranslation: secondaryTrans,
      isAiGenerated: false,
    };
  }
}

export const aiService = new AiService();
