import {
  VEGETABLES,
  NON_VEG_ITEMS,
  MAX_VEG_INGREDIENTS,
  MAX_NON_VEG_INGREDIENTS,
  MIN_INGREDIENT_LENGTH,
  MAX_INGREDIENT_LENGTH,
  DIET_TYPES,
  ERROR_MESSAGES,
} from './constants';

/**
 * Validates if the ingredient name is valid
 * @param {string} ingredient - The ingredient to validate
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export const validateIngredientName = (ingredient) => {
  if (!ingredient || typeof ingredient !== 'string') {
    return { isValid: false, error: ERROR_MESSAGES.INVALID_INGREDIENT };
  }

  const trimmed = ingredient.trim();

  if (trimmed.length < MIN_INGREDIENT_LENGTH) {
    return { isValid: false, error: 'Ingredient name too short' };
  }

  if (trimmed.length > MAX_INGREDIENT_LENGTH) {
    return { isValid: false, error: 'Ingredient name too long' };
  }

  // Check for valid characters (letters, spaces, hyphens only)
  const validPattern = /^[a-zA-Z\s-]+$/;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, error: 'Only letters and spaces allowed' };
  }

  return { isValid: true, error: null };
};

/**
 * Detects if an ingredient is vegetarian or non-vegetarian
 * @param {string} ingredient - The ingredient to check
 * @returns {string} - 'vegetarian' | 'nonVegetarian' | 'unknown'
 */
export const detectIngredientType = (ingredient) => {
  if (!ingredient) return 'unknown';

  const normalized = ingredient.toLowerCase().trim();

  // Check against non-veg list first (more specific)
  const isNonVeg = NON_VEG_ITEMS.some(
    (item) =>
      normalized === item.toLowerCase() ||
      normalized.includes(item.toLowerCase()) ||
      item.toLowerCase().includes(normalized)
  );

  if (isNonVeg) return DIET_TYPES.NON_VEG;

  // Check against vegetables
  const isVeg = VEGETABLES.some(
    (item) =>
      normalized === item.toLowerCase() ||
      normalized.includes(item.toLowerCase()) ||
      item.toLowerCase().includes(normalized)
  );

  if (isVeg) return DIET_TYPES.VEG;

  // Default to vegetarian for unknown items (safer assumption)
  return DIET_TYPES.VEG;
};

/**
 * Validates if a new ingredient can be added to the list
 * @param {string} newIngredient - The ingredient to add
 * @param {Array} currentIngredients - Current list of ingredients
 * @param {string} dietType - Current diet type selection
 * @returns {object} - { canAdd: boolean, error: string | null }
 */
export const validateIngredientAddition = (
  newIngredient,
  currentIngredients,
  dietType
) => {
  // First validate the ingredient name
  const nameValidation = validateIngredientName(newIngredient);
  if (!nameValidation.isValid) {
    return { canAdd: false, error: nameValidation.error };
  }

  const normalized = newIngredient.toLowerCase().trim();

  // Check for duplicates
  const isDuplicate = currentIngredients.some(
    (ing) => ing.toLowerCase().trim() === normalized
  );
  if (isDuplicate) {
    return { canAdd: false, error: ERROR_MESSAGES.DUPLICATE_INGREDIENT };
  }

  // Check ingredient type matches diet selection
  const ingredientType = detectIngredientType(newIngredient);

  if (dietType === DIET_TYPES.VEG) {
    // Veg mode - reject non-veg items
    if (ingredientType === DIET_TYPES.NON_VEG) {
      return {
        canAdd: false,
        error: 'This is a non-veg item. Switch to non-veg mode.',
      };
    }

    // Check max veg limit
    if (currentIngredients.length >= MAX_VEG_INGREDIENTS) {
      return { canAdd: false, error: ERROR_MESSAGES.MAX_VEG_REACHED };
    }
  } else {
    // Non-veg mode - only allow non-veg items, max 1
    if (ingredientType !== DIET_TYPES.NON_VEG) {
      return {
        canAdd: false,
        error: 'Only non-veg items allowed in non-veg mode.',
      };
    }

    if (currentIngredients.length >= MAX_NON_VEG_INGREDIENTS) {
      return { canAdd: false, error: ERROR_MESSAGES.MAX_NON_VEG_REACHED };
    }
  }

  return { canAdd: true, error: null };
};

/**
 * Validates if the ingredient list is ready for recipe generation
 * @param {Array} ingredients - List of ingredients
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export const validateIngredientsForRecipe = (ingredients) => {
  if (!ingredients || ingredients.length === 0) {
    return { isValid: false, error: ERROR_MESSAGES.EMPTY_INGREDIENTS };
  }

  // Validate each ingredient
  for (const ing of ingredients) {
    const validation = validateIngredientName(ing);
    if (!validation.isValid) {
      return { isValid: false, error: `Invalid ingredient: ${ing}` };
    }
  }

  return { isValid: true, error: null };
};

/**
 * Formats ingredient name for display
 * @param {string} ingredient - The ingredient to format
 * @returns {string} - Formatted ingredient name
 */
export const formatIngredientName = (ingredient) => {
  if (!ingredient) return '';

  return ingredient
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get suggestions based on partial input
 * @param {string} input - Partial ingredient input
 * @param {string} dietType - Current diet type
 * @param {Array} currentIngredients - Already added ingredients
 * @returns {Array} - List of suggestions
 */
export const getIngredientSuggestions = (
  input,
  dietType,
  currentIngredients = []
) => {
  if (!input || input.length < 2) return [];

  const normalized = input.toLowerCase().trim();
  const sourceList = dietType === DIET_TYPES.VEG ? VEGETABLES : NON_VEG_ITEMS;

  return sourceList
    .filter((item) => {
      const itemLower = item.toLowerCase();
      const isMatch =
        itemLower.startsWith(normalized) || itemLower.includes(normalized);
      const notAdded = !currentIngredients.some(
        (ing) => ing.toLowerCase() === itemLower
      );
      return isMatch && notAdded;
    })
    .slice(0, 5); // Limit to 5 suggestions
};

/**
 * Check if diet types are mixed
 * @param {Array} ingredients - List of ingredients
 * @returns {boolean} - True if mixed
 */
export const hasMixedDietTypes = (ingredients) => {
  if (!ingredients || ingredients.length <= 1) return false;

  const types = ingredients.map((ing) => detectIngredientType(ing));
  const hasVeg = types.includes(DIET_TYPES.VEG);
  const hasNonVeg = types.includes(DIET_TYPES.NON_VEG);

  return hasVeg && hasNonVeg;
};
