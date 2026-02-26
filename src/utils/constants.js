// App Constants
export const APP_NAME = 'Chef Al-Smart';
export const APP_VERSION = '1.0.0';
export const APP_TAGLINE = 'Your Smart Recipe Companion';

// Navigation Screens
export const SCREENS = {
  WELCOME: 'welcome',
  INGREDIENTS: 'ingredients',
  COOKING_STYLE: 'cookingStyle',
  LOADING: 'loading',
  RESULT: 'result',
};

// Language Options
export const LANGUAGES = {
  ENGLISH: 'english',
  HINGLISH: 'hinglish',
};

// Diet Types
export const DIET_TYPES = {
  VEG: 'vegetarian',
  NON_VEG: 'nonVegetarian',
};

// Cooking Styles
export const COOKING_STYLES = {
  HOME: 'home',
  RESTAURANT: 'restaurant',
};

// Recipe Depth
export const RECIPE_DEPTH = {
  QUICK: 'quick',
  DETAILED: 'detailed',
};

// Common Vegetables List
export const VEGETABLES = [
  'Potato',
  'Tomato',
  'Onion',
  'Cauliflower',
  'Cabbage',
  'Carrot',
  'Capsicum',
  'Brinjal',
  'Ladyfinger',
  'Spinach',
  'Peas',
  'Beans',
  'Bottle Gourd',
  'Ridge Gourd',
  'Bitter Gourd',
  'Pumpkin',
  'Radish',
  'Beetroot',
  'Mushroom',
  'Corn',
  'Cucumber',
  'Zucchini',
  'Turnip',
  'Sweet Potato',
  'Drumstick',
  'Fenugreek Leaves',
  'Coriander',
  'Mint',
  'Ginger',
  'Garlic',
  'Green Chilli',
  'Bell Pepper',
  'Broccoli',
  'Asparagus',
  'Artichoke',
];

// Non-Veg Items
export const NON_VEG_ITEMS = [
  'Chicken',
  'Mutton',
  'Fish',
  'Prawns',
  'Eggs',
  'Lamb',
  'Crab',
  'Lobster',
  'Duck',
  'Turkey',
  'Goat',
  'Keema',
  'Liver',
  'Brain',
  'Paya',
];

// Base Ingredients (Auto-added by Chef)
export const BASE_INGREDIENTS = {
  SPICES: [
    'Salt',
    'Turmeric Powder',
    'Red Chilli Powder',
    'Coriander Powder',
    'Cumin Seeds',
    'Mustard Seeds',
    'Garam Masala',
  ],
  OILS: ['Cooking Oil', 'Ghee'],
  AROMATICS: ['Onion', 'Garlic', 'Ginger', 'Green Chillies'],
  HERBS: ['Fresh Coriander', 'Curry Leaves'],
};

// Validation Constants
export const MAX_VEG_INGREDIENTS = 5;
export const MAX_NON_VEG_INGREDIENTS = 1;
export const MIN_INGREDIENT_LENGTH = 2;
export const MAX_INGREDIENT_LENGTH = 30;

// Animation Durations
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800,
};

// Toast Duration
export const TOAST_DURATION = 3000;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_INGREDIENT: 'Please enter a valid ingredient name',
  MAX_VEG_REACHED: 'Maximum 5 vegetables allowed',
  MAX_NON_VEG_REACHED: 'Only 1 non-veg item allowed',
  MIXED_INGREDIENTS: 'Cannot mix veg and non-veg ingredients',
  EMPTY_INGREDIENTS: 'Please add at least one ingredient',
  API_ERROR: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Please check your internet connection',
  DUPLICATE_INGREDIENT: 'This ingredient is already added',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  INGREDIENT_ADDED: 'Ingredient added',
  RECIPE_GENERATED: 'Recipe generated successfully',
  COPIED_TO_CLIPBOARD: 'Recipe copied to clipboard',
  SHARED: 'Recipe shared successfully',
};

// WhatsApp Share
export const WHATSAPP_SHARE_URL = 'https://wa.me/?text=';
export const APP_SHARE_TEXT = 'Try Chef Al-Smart - Your Smart Recipe Generator!';
export const APP_LINK = 'https://chef-al-smart.app';

// Local Storage Keys
export const STORAGE_KEYS = {
  LANGUAGE: 'chef_al_smart_language',
  RECENT_RECIPES: 'chef_al_smart_recent',
  FAVORITE_RECIPES: 'chef_al_smart_favorites',
  USER_PREFERENCES: 'chef_al_smart_preferences',
};
