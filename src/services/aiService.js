/**
 * Chef Al-Smart AI Service
 * OpenRouter Integration - Production Safe
 */

const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

// ✅ Stable working model
const MODEL = "deepseek/deepseek-chat";

/**
 * Get API Key from Vite environment
 */
const getApiKey = () => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!key) {
    throw new Error("API key not configured in environment variables.");
  }

  return key;
};

/**
 * Build system prompt
 */
const buildSystemPrompt = (language) => {
  const langRule =
    language === "hinglish"
      ? "Use Hinglish (Hindi words in English script only). Do NOT use Devanagari."
      : "Use Professional English only.";

  return `
You are Chef Al-Smart, a master Indian chef.

STRICT RULES:
1. ${langRule}
2. Never use non-English scripts.
3. Auto-add oil, spices, onion, ginger-garlic.
4. Adjust spice level based on cooking style.
5. Follow output format EXACTLY.

FORMAT:

Title: <Recipe Name>

Cooking Time: <time in minutes>

NUTRITION START
Calories: <number> kcal
Protein: <number>g
Carbs: <number>g
Fats: <number>g
NUTRITION END

Ingredients:
- item

Method:
1. Step

Chef Tips:
- tip
`;
};

/**
 * Build user prompt
 */
const buildUserPrompt = ({ ingredients, dietType, cookingStyle, recipeDepth }) => {
  return `
Create an Indian ${cookingStyle} style recipe using:

${ingredients.map((i) => `- ${i}`).join("\n")}

Diet Type: ${dietType}
Detail Level: ${recipeDepth}

Follow exact output format.
`;
};

/**
 * Parse AI response safely
 */
const parseRecipe = (text) => {
  return {
    raw: text,
  };
};

/**
 * Generate Recipe
 */
export const generateRecipe = async ({
  ingredients,
  dietType,
  cookingStyle,
  recipeDepth,
  language,
}) => {
  try {
    const apiKey = getApiKey();

    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "Chef Al-Smart",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(language),
          },
          {
            role: "user",
            content: buildUserPrompt({
              ingredients,
              dietType,
              cookingStyle,
              recipeDepth,
            }),
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`API Error ${response.status}: ${err}`);
    }

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid AI response");
    }

    return {
      success: true,
      recipe: parseRecipe(content),
    };
  } catch (error) {
    console.error("Recipe Generation Failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Share format
 */
export const formatRecipeForSharing = (recipe) => {
  return recipe?.raw || "No recipe available";
};
