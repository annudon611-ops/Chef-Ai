/**
 * AI Service for Chef Al-Smart Recipe Generator
 * Integrates with OpenRouter API using DeepSeek model
 */

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'tngtech/deepseek-r1t2-chimera:free';

/**
 * Get API key from environment
 * @returns {string} - API key
 * @throws {Error} - If API key is not configured
 */
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
    throw new Error('OpenRouter API key is not configured. Please add your API key to the .env file.');
  }
  
  return apiKey;
};

/**
 * Build the system prompt for the AI
 * @param {string} language - 'english' or 'hinglish'
 * @returns {string} - System prompt
 */
const buildSystemPrompt = (language) => {
  const languageInstruction = language === 'hinglish' 
    ? 'Use Hinglish (Hindi words written in English script mixed with English). Do NOT use Devanagari script.'
    : 'Use Professional English only. No regional language scripts.';

  return `You are Chef Al-Smart, a master Indian chef with expertise in both traditional home cooking and high-end restaurant cuisine. You have deep knowledge of Indian spices, cooking techniques, and regional cuisines.

CRITICAL RULES:
1. ${languageInstruction}
2. NEVER use Devanagari or any non-English script.
3. Always provide accurate cooking times and nutritional estimates.
4. Automatically add essential base ingredients (spices, oil, salt) that an Indian kitchen would have.
5. Adjust recipes based on the cooking style requested (home vs restaurant).
6. Be precise with measurements and cooking instructions.
7. Include professional chef tips.

OUTPUT FORMAT (STRICT - DO NOT DEVIATE):

Title: <Creative Recipe Name>

Cooking Time: <Estimated time in minutes>

NUTRITION START
Calories: <number> kcal
Protein: <number>g
Carbs: <number>g
Fats: <number>g
NUTRITION END

Ingredients:
- <ingredient 1 with quantity>
- <ingredient 2 with quantity>
(include all auto-added base ingredients)

Method:
1. <Step 1 with clear instructions>
2. <Step 2 with clear instructions>
(continue with numbered steps)

Chef Tips:
- <Professional tip 1>
- <Professional tip 2>
(2-3 actionable tips)`;
};

/**
 * Build the user prompt for recipe generation
 * @param {object} params - Recipe parameters
 * @returns {string} - User prompt
 */
const buildUserPrompt = ({
  ingredients,
  dietType,
  cookingStyle,
  recipeDepth,
}) => {
  const styleDescription = cookingStyle === 'home' 
    ? 'simple home-style cooking with moderate spices and easy-to-follow steps, using common household ingredients'
    : 'restaurant-style cooking with rich flavors, professional techniques, generous use of ghee/butter/cream, and impressive presentation';

  const depthDescription = recipeDepth === 'quick'
    ? 'Keep it concise. Quick overview with essential steps only.'
    : 'Provide detailed instructions with explanations for each technique.';

  const dietDescription = dietType === 'vegetarian'
    ? 'This is a VEGETARIAN recipe. Do not suggest any meat, fish, or egg alternatives.'
    : 'This is a NON-VEGETARIAN recipe. Focus on the meat preparation and cooking.';

  return `Create an authentic Indian ${cookingStyle}-style recipe using these main ingredients:
${ingredients.map(ing => `- ${ing}`).join('\n')}

Diet Type: ${dietDescription}

Cooking Style: ${styleDescription}

Recipe Detail Level: ${depthDescription}

Remember to:
1. Auto-add necessary base ingredients (oil/ghee, onions, tomatoes, ginger-garlic, green chilies, common Indian spices)
2. Adjust spice levels for ${cookingStyle} style (${cookingStyle === 'home' ? 'moderate' : 'bold and rich'})
3. Estimate accurate cooking time and nutrition
4. Provide clear, numbered cooking steps
5. Include 2-3 professional chef tips

Generate the complete recipe now following the exact format specified.`;
};

/**
 * Parse the AI response into structured data
 * @param {string} response - Raw AI response
 * @returns {object} - Parsed recipe object
 */
const parseRecipeResponse = (response) => {
  const recipe = {
    title: '',
    cookingTime: '',
    nutrition: {
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
    },
    ingredients: [],
    method: [],
    chefTips: [],
    rawResponse: response,
  };

  try {
    // Extract title
    const titleMatch = response.match(/Title:\s*(.+?)(?:\n|Cooking Time)/s);
    if (titleMatch) {
      recipe.title = titleMatch[1].trim();
    }

    // Extract cooking time
    const timeMatch = response.match(/Cooking Time:\s*(.+?)(?:\n|NUTRITION)/s);
    if (timeMatch) {
      recipe.cookingTime = timeMatch[1].trim();
    }

    // Extract nutrition
    const nutritionMatch = response.match(/NUTRITION START([\s\S]*?)NUTRITION END/);
    if (nutritionMatch) {
      const nutritionText = nutritionMatch[1];
      
      const caloriesMatch = nutritionText.match(/Calories:\s*(\d+)/);
      const proteinMatch = nutritionText.match(/Protein:\s*(\d+)/);
      const carbsMatch = nutritionText.match(/Carbs:\s*(\d+)/);
      const fatsMatch = nutritionText.match(/Fats:\s*(\d+)/);

      recipe.nutrition = {
        calories: caloriesMatch ? `${caloriesMatch[1]} kcal` : 'N/A',
        protein: proteinMatch ? `${proteinMatch[1]}g` : 'N/A',
        carbs: carbsMatch ? `${carbsMatch[1]}g` : 'N/A',
        fats: fatsMatch ? `${fatsMatch[1]}g` : 'N/A',
      };
    }

    // Extract ingredients
    const ingredientsMatch = response.match(/Ingredients:([\s\S]*?)(?:Method:|Steps:)/);
    if (ingredientsMatch) {
      const ingredientLines = ingredientsMatch[1].trim().split('\n');
      recipe.ingredients = ingredientLines
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    // Extract method
    const methodMatch = response.match(/(?:Method:|Steps:)([\s\S]*?)(?:Chef Tips:|Tips:|$)/);
    if (methodMatch) {
      const methodLines = methodMatch[1].trim().split('\n');
      recipe.method = methodLines
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    // Extract chef tips
    const tipsMatch = response.match(/(?:Chef Tips:|Tips:)([\s\S]*?)$/);
    if (tipsMatch) {
      const tipLines = tipsMatch[1].trim().split('\n');
      recipe.chefTips = tipLines
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

  } catch (error) {
    console.error('Error parsing recipe response:', error);
  }

  return recipe;
};

/**
 * Generate a recipe using the AI
 * @param {object} params - Recipe generation parameters
 * @param {Array} params.ingredients - List of ingredients
 * @param {string} params.dietType - 'vegetarian' or 'nonVegetarian'
 * @param {string} params.cookingStyle - 'home' or 'restaurant'
 * @param {string} params.recipeDepth - 'quick' or 'detailed'
 * @param {string} params.language - 'english' or 'hinglish'
 * @returns {Promise<object>} - Generated recipe
 */
export const generateRecipe = async ({
  ingredients,
  dietType,
  cookingStyle,
  recipeDepth,
  language = 'english',
}) => {
  const apiKey = getApiKey();

  const systemPrompt = buildSystemPrompt(language);
  const userPrompt = buildUserPrompt({
    ingredients,
    dietType,
    cookingStyle,
    recipeDepth,
  });

  const requestBody = {
    model: MODEL,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
    top_p: 0.9,
  };

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Chef Al-Smart Recipe Generator',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from AI');
    }

    const rawContent = data.choices[0].message.content;
    const parsedRecipe = parseRecipeResponse(rawContent);

    return {
      success: true,
      recipe: parsedRecipe,
      usage: data.usage,
    };

  } catch (error) {
    console.error('Recipe generation error:', error);
    
    // Provide user-friendly error messages
    let userMessage = 'Failed to generate recipe. Please try again.';
    
    if (error.message.includes('API key')) {
      userMessage = 'API configuration error. Please check your settings.';
    } else if (error.message.includes('network') || error.name === 'TypeError') {
      userMessage = 'Network error. Please check your internet connection.';
    } else if (error.message.includes('rate limit')) {
      userMessage = 'Too many requests. Please wait a moment and try again.';
    }

    return {
      success: false,
      error: userMessage,
      details: error.message,
    };
  }
};

/**
 * Validate ingredients using AI
 * @param {string} ingredient - Ingredient to validate
 * @param {string} dietType - Expected diet type
 * @returns {Promise<object>} - Validation result
 */
export const validateIngredientWithAI = async (ingredient, dietType) => {
  // This is a lightweight validation that can be done locally
  // For more complex validation, we could use the AI
  
  const nonVegKeywords = [
    'chicken', 'mutton', 'fish', 'prawn', 'egg', 'meat',
    'lamb', 'crab', 'lobster', 'duck', 'turkey', 'goat',
    'keema', 'liver', 'brain', 'paya', 'beef', 'pork'
  ];

  const normalizedIngredient = ingredient.toLowerCase().trim();
  const isNonVeg = nonVegKeywords.some(keyword => 
    normalizedIngredient.includes(keyword)
  );

  if (dietType === 'vegetarian' && isNonVeg) {
    return {
      isValid: false,
      error: `"${ingredient}" is a non-vegetarian item. Please switch to non-veg mode.`,
      detectedType: 'nonVegetarian',
    };
  }

  if (dietType === 'nonVegetarian' && !isNonVeg) {
    return {
      isValid: false,
      error: `"${ingredient}" appears to be vegetarian. In non-veg mode, please add meat/fish/egg items.`,
      detectedType: 'vegetarian',
    };
  }

  return {
    isValid: true,
    error: null,
    detectedType: isNonVeg ? 'nonVegetarian' : 'vegetarian',
  };
};

/**
 * Format recipe for sharing
 * @param {object} recipe - Recipe object
 * @returns {string} - Formatted text for sharing
 */
export const formatRecipeForSharing = (recipe) => {
  let text = `🍳 *${recipe.title}*\n`;
  text += `⏱️ Cooking Time: ${recipe.cookingTime}\n\n`;

  text += `📊 *Nutrition Info:*\n`;
  text += `• Calories: ${recipe.nutrition.calories}\n`;
  text += `• Protein: ${recipe.nutrition.protein}\n`;
  text += `• Carbs: ${recipe.nutrition.carbs}\n`;
  text += `• Fats: ${recipe.nutrition.fats}\n\n`;

  text += `🥘 *Ingredients:*\n`;
  recipe.ingredients.forEach(ing => {
    text += `• ${ing}\n`;
  });

  text += `\n👨‍🍳 *Method:*\n`;
  recipe.method.forEach((step, index) => {
    text += `${index + 1}. ${step}\n`;
  });

  if (recipe.chefTips.length > 0) {
    text += `\n💡 *Chef Tips:*\n`;
    recipe.chefTips.forEach(tip => {
      text += `• ${tip}\n`;
    });
  }

  text += `\n---\n`;
  text += `Generated by Chef Al-Smart 🧑‍🍳\n`;
  text += `Your Smart Recipe Companion`;

  return text;
};

export default {
  generateRecipe,
  validateIngredientWithAI,
  formatRecipeForSharing,
};
