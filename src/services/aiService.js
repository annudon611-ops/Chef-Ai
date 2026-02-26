const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat";

const getApiKey = () => {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("API key not configured.");
  }
  return key;
};

const buildPrompt = ({
  ingredients,
  dietType,
  cookingStyle,
  recipeDepth,
  language,
}) => {
  const langRule =
    language === "hinglish"
      ? "Use Hinglish (Hindi words written in English script only)."
      : "Use Professional English only.";

  return `
You are Chef Al-Smart.

RULES:
- ${langRule}
- Auto add oil, spices, onion, garlic.
- Adjust spice for ${cookingStyle} style.
- Follow exact format below.

FORMAT:

Title: <Recipe Name>

Cooking Time: <Time>

NUTRITION START
Calories: <number> kcal
Protein: <number>g
Carbs: <number>g
Fats: <number>g
NUTRITION END

Ingredients:
- item

Method:
1. step

Chef Tips:
- tip

User Ingredients:
${ingredients.join(", ")}

Diet Type: ${dietType}
Detail Level: ${recipeDepth}
`;
};

const parseRecipe = (text) => {
  const recipe = {
    title: "",
    cookingTime: "",
    nutrition: {
      calories: "",
      protein: "",
      carbs: "",
      fats: "",
    },
    ingredients: [],
    method: [],
    chefTips: [],
  };

  try {
    const titleMatch = text.match(/Title:\s*(.+)/i);
    if (titleMatch) recipe.title = titleMatch[1].trim();

    const timeMatch = text.match(/Cooking Time:\s*(.+)/i);
    if (timeMatch) recipe.cookingTime = timeMatch[1].trim();

    const nutritionMatch = text.match(
      /NUTRITION START([\s\S]*?)NUTRITION END/i
    );
    if (nutritionMatch) {
      const nut = nutritionMatch[1];
      recipe.nutrition.calories =
        nut.match(/Calories:\s*(.+)/i)?.[1] || "";
      recipe.nutrition.protein =
        nut.match(/Protein:\s*(.+)/i)?.[1] || "";
      recipe.nutrition.carbs =
        nut.match(/Carbs:\s*(.+)/i)?.[1] || "";
      recipe.nutrition.fats =
        nut.match(/Fats:\s*(.+)/i)?.[1] || "";
    }

    const ingredientsMatch = text.match(
      /Ingredients:([\s\S]*?)Method:/i
    );
    if (ingredientsMatch) {
      recipe.ingredients = ingredientsMatch[1]
        .split("\n")
        .map((l) => l.replace("-", "").trim())
        .filter((l) => l.length > 0);
    }

    const methodMatch = text.match(
      /Method:([\s\S]*?)Chef Tips:/i
    );
    if (methodMatch) {
      recipe.method = methodMatch[1]
        .split("\n")
        .map((l) => l.replace(/^\d+\./, "").trim())
        .filter((l) => l.length > 0);
    }

    const tipsMatch = text.match(/Chef Tips:([\s\S]*)/i);
    if (tipsMatch) {
      recipe.chefTips = tipsMatch[1]
        .split("\n")
        .map((l) => l.replace("-", "").trim())
        .filter((l) => l.length > 0);
    }

    if (!recipe.title) recipe.title = "Delicious Indian Recipe";
  } catch (err) {
    console.error("Parsing error:", err);
  }

  return recipe;
};

export const generateRecipe = async (data) => {
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
            role: "user",
            content: buildPrompt(data),
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Invalid AI response.");
    }

    const parsed = parseRecipe(content);

    return {
      success: true,
      recipe: parsed,
    };
  } catch (error) {
    console.error("Recipe error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const formatRecipeForSharing = (recipe) => {
  return `
${recipe.title}

Cooking Time: ${recipe.cookingTime}

Ingredients:
${recipe.ingredients.join("\n")}

Method:
${recipe.method.join("\n")}

Chef Tips:
${recipe.chefTips.join("\n")}
`;
};
