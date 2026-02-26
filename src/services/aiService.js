/**
 * AI Service for Chef Al-Smart Recipe Generator
 */

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-r1-0528:free';

/**
 * Get API key from environment
 */
const getApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.error('API Key not found in environment variables');
    throw new Error('API key is not configured. Please contact support.');
  }
  
  return apiKey;
};

/**
 * Build the system prompt
 */
const buildSystemPrompt = (language) => {
  const languageInstruction = language === 'hinglish' 
    ? 'Use Hinglish (Hindi words written in English script mixed with English). Do NOT use Devanagari script.'
    : 'Use Professional English only. No regional language scripts.';

  return `You are Chef Al-Smart, a master Indian chef with expertise in both traditional home cooking and restaurant cuisine.

RULES:
1. ${languageInstruction}
2. NEVER use Devanagari or any non-English script.
3. Always provide accurate cooking times and nutritional estimates.
4. Automatically add essential base ingredients (spices, oil, salt).
5. Adjust recipes based on cooking style (home vs restaurant).
6. Be precise with measurements.

OUTPUT FORMAT (STRICT):

Title: <Recipe Name>

Cooking Time: <time in minutes>

NUTRITION START
Calories: <number> kcal
Protein: <number>g
Carbs: <number>g
Fats: <number>g
NUTRITION END

Ingredients:
- <ingredient with quantity>
- <ingredient with quantity>

Method:
1. <Step 1>
2. <Step 2>
3. <Step 3>

Chef Tips:
- <tip 1>
- <tip 2>`;
};

/**
 * Build user prompt
 */
const buildUserPrompt = ({ ingredients, dietType, cookingStyle, recipeDepth }) => {
  const styleDesc = cookingStyle === 'home' 
    ? 'simple home-style with moderate spices'
    : 'rich restaurant-style with bold flavors and ghee/butter';

  const depthDesc = recipeDepth === 'quick'
    ? 'Keep it brief with essential steps only.'
    : 'Provide detailed step-by-step instructions.';

  return `Create an Indian ${cookingStyle}-style recipe using:
${ingredients.map(ing => `- ${ing}`).join('\n')}

Diet: ${dietType === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}
Style: ${styleDesc}
Detail: ${depthDesc}

Auto-add base ingredients (oil, onion, tomato, ginger-garlic, spices).
Follow the exact output format.`;
};

/**
 * Parse AI response
 */
const parseRecipeResponse = (response) => {
  const recipe = {
    title: '',
    cookingTime: '',
    nutrition: { calories: 'N/A', protein: 'N/A', carbs: 'N/A', fats: 'N/A' },
    ingredients: [],
    method: [],
    chefTips: [],
    rawResponse: response,
  };

  try {
    // Extract title
    const titleMatch = response.match(/Title:\s*(.+?)(?:\n|Cooking)/si);
    if (titleMatch) recipe.title = titleMatch[1].trim();

    // Extract cooking time
    const timeMatch = response.match(/Cooking Time:\s*(.+?)(?:\n|NUTRITION)/si);
    if (timeMatch) recipe.cookingTime = timeMatch[1].trim();

    // Extract nutrition
    const nutritionMatch = response.match(/NUTRITION START([\s\S]*?)NUTRITION END/i);
    if (nutritionMatch) {
      const nut = nutritionMatch[1];
      const cal = nut.match(/Calories:\s*(\d+)/i);
      const pro = nut.match(/Protein:\s*(\d+)/i);
      const carb = nut.match(/Carbs:\s*(\d+)/i);
      const fat = nut.match(/Fats:\s*(\d+)/i);
      
      recipe.nutrition = {
        calories: cal ? `${cal[1]} kcal` : 'N/A',
        protein: pro ? `${pro[1]}g` : 'N/A',
        carbs: carb ? `${carb[1]}g` : 'N/A',
        fats: fat ? `${fat[1]}g` : 'N/A',
      };
    }

    // Extract ingredients
    const ingMatch = response.match(/Ingredients:([\s\S]*?)(?:Method:|Steps:)/i);
    if (ingMatch) {
      recipe.ingredients = ingMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    // Extract method
    const methodMatch = response.match(/(?:Method:|Steps:)([\s\S]*?)(?:Chef Tips:|Tips:|$)/i);
    if (methodMatch) {
      recipe.method = methodMatch[1]
        .split('\n')
        .map(line => line.replace(/^\d+\.\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    // Extract tips
    const tipsMatch = response.match(/(?:Chef Tips:|Tips:)([\s\S]*?)$/i);
    if (tipsMatch) {
      recipe.chefTips = tipsMatch[1]
        .split('\n')
        .map(line => line.replace(/^[-•*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    // Fallback if parsing failed
    if (!recipe.title) recipe.title = 'Delicious Indian Recipe';
    if (recipe.ingredients.length === 0) {
      recipe.ingredients = ['Recipe ingredients not parsed correctly'];
    }
    if (recipe.method.length === 0) {
      recipe.method = ['Please see the raw recipe below', response.substring(0, 500)];
    }

  } catch (error) {
    console.error('Parse error:', error);
    recipe.title = 'Recipe Generated';
    recipe.method = [response.substring(0, 1000)];
  }

  return recipe;
};

/**
 * Generate recipe using OpenRouter API
 */
export const generateRecipe = async ({
  ingredients,
  dietType,
  cookingStyle,
  recipeDepth,
  language = 'english',
}) => {
  console.log('Generating recipe with:', { ingredients, dietType, cookingStyle, language });

  try {
    const apiKey = getApiKey();
    
    const systemPrompt = buildSystemPrompt(language);
    const userPrompt = buildUserPrompt({ ingredients, dietType, cookingStyle, recipeDepth });

    console.log('Making API request...');

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Chef Al-Smart',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your configuration.');
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please wait and try again.');
      } else if (response.status === 402) {
        throw new Error('API credits exhausted. Please add credits.');
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from AI');
    }

    const rawContent = data.choices[0].message.content;
    console.log('Raw content:', rawContent.substring(0, 200));

    const parsedRecipe = parseRecipeResponse(rawContent);
    console.log('Parsed recipe:', parsedRecipe);

    return {
      success: true,
      recipe: parsedRecipe,
    };

  } catch (error) {
    console.error('Generate recipe error:', error);
    
    return {
      success: false,
      error: error.message || 'Failed to generate recipe. Please try again.',
    };
  }
};

/**
 * Format recipe for sharing
 */
export const formatRecipeForSharing = (recipe) => {
  if (!recipe) return 'No recipe available';

  let text = `🍳 *${recipe.title || 'Recipe'}*\n`;
  text += `⏱️ ${recipe.cookingTime || '30-40 mins'}\n\n`;

  text += `📊 *Nutrition:*\n`;
  text += `• Calories: ${recipe.nutrition?.calories || 'N/A'}\n`;
  text += `• Protein: ${recipe.nutrition?.protein || 'N/A'}\n`;
  text += `• Carbs: ${recipe.nutrition?.carbs || 'N/A'}\n`;
  text += `• Fats: ${recipe.nutrition?.fats || 'N/A'}\n\n`;

  text += `🥘 *Ingredients:*\n`;
  (recipe.ingredients || []).forEach(ing => {
    text += `• ${ing}\n`;
  });

  text += `\n👨‍🍳 *Method:*\n`;
  (recipe.method || []).forEach((step, i) => {
    text += `${i + 1}. ${step}\n`;
  });

  if (recipe.chefTips?.length > 0) {
    text += `\n💡 *Chef Tips:*\n`;
    recipe.chefTips.forEach(tip => {
      text += `• ${tip}\n`;
    });
  }

  text += `\n---\nGenerated by Chef Al-Smart 🧑‍🍳`;
  return text;
};

export default { generateRecipe, formatRecipeForSharing };
