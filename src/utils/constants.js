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
  'Paneer',
  'Palak',
  'Methi',
  'Bhindi',
  'Aloo',
  'Gobi',
  'Matar',
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
  'Keema',
];

// Validation Constants
export const MAX_VEG_INGREDIENTS = 5;
export const MAX_NON_VEG_INGREDIENTS = 1;
export const MIN_INGREDIENT_LENGTH = 2;
export const MAX_INGREDIENT_LENGTH = 30;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_INGREDIENT: 'Please enter a valid ingredient name',
  MAX_VEG_REACHED: 'Maximum 5 vegetables allowed',
  MAX_NON_VEG_REACHED: 'Only 1 non-veg item allowed',
  EMPTY_INGREDIENTS: 'Please add at least one ingredient',
  DUPLICATE_INGREDIENT: 'This ingredient is already added',
};

// WhatsApp Share
export const WHATSAPP_SHARE_URL = 'https://wa.me/?text=';
export const APP_LINK = 'https://chef-al-smart.app';
