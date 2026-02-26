import React, { useState, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Paper,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  InputAdornment,
  Autocomplete,
  Fade,
  Alert,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as ForwardIcon,
  Add as AddIcon,
  Grass as VegIcon,
  SetMeal as NonVegIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  DIET_TYPES,
  VEGETABLES,
  NON_VEG_ITEMS,
  MAX_VEG_INGREDIENTS,
  MAX_NON_VEG_INGREDIENTS,
} from '../utils/constants';
import {
  validateIngredientAddition,
  formatIngredientName,
  getIngredientSuggestions,
} from '../utils/validators';

/**
 * Ingredient Input Screen Component
 * Allows users to select diet type and add ingredients
 */
const IngredientInputScreen = ({ onNext, onBack, initialData = {} }) => {
  const [dietType, setDietType] = useState(initialData.dietType || DIET_TYPES.VEG);
  const [ingredients, setIngredients] = useState(initialData.ingredients || []);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isAnimated, setIsAnimated] = useState(false);
  const inputRef = useRef(null);

  React.useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const maxIngredients = dietType === DIET_TYPES.VEG 
    ? MAX_VEG_INGREDIENTS 
    : MAX_NON_VEG_INGREDIENTS;

  const suggestionList = dietType === DIET_TYPES.VEG ? VEGETABLES : NON_VEG_ITEMS;

  const handleDietTypeChange = (event, newType) => {
    if (newType !== null) {
      setDietType(newType);
      setIngredients([]);
      setError('');
      setInputValue('');
    }
  };

  const handleAddIngredient = useCallback(
    (ingredient) => {
      if (!ingredient || ingredient.trim() === '') return;

      const formatted = formatIngredientName(ingredient.trim());
      const validation = validateIngredientAddition(formatted, ingredients, dietType);

      if (!validation.canAdd) {
        setError(validation.error);
        return;
      }

      setIngredients((prev) => [...prev, formatted]);
      setInputValue('');
      setError('');

      setTimeout(() => inputRef.current?.focus(), 100);
    },
    [ingredients, dietType]
  );

  const handleRemoveIngredient = (indexToRemove) => {
    setIngredients((prev) => prev.filter((_, index) => index !== indexToRemove));
    setError('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      event.preventDefault();
      handleAddIngredient(inputValue);
    }
  };

  const handleNext = () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }
    onNext({ dietType, ingredients });
  };

  const canAddMore = ingredients.length < maxIngredients;

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #F1F8E9 0%, #E8F5E9 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
          color: 'white',
          px: 2,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton onClick={onBack} sx={{ color: 'white' }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          Select Ingredients
        </Typography>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Diet Type Selection */}
        <Fade in={isAnimated} timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} color="primary.dark" mb={2}>
              Choose Diet Type
            </Typography>

            <ToggleButtonGroup
              value={dietType}
              exclusive
              onChange={handleDietTypeChange}
              fullWidth
              sx={{
                '& .MuiToggleButton-root': {
                  py: 2,
                  borderRadius: '16px !important',
                  mx: 0.5,
                  border: '2px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    borderColor: dietType === DIET_TYPES.VEG ? 'success.main' : 'error.main',
                    backgroundColor:
                      dietType === DIET_TYPES.VEG
                        ? 'rgba(46, 125, 50, 0.1)'
                        : 'rgba(211, 47, 47, 0.1)',
                  },
                },
              }}
            >
              <ToggleButton value={DIET_TYPES.VEG}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <VegIcon
                    sx={{
                      fontSize: 32,
                      color: dietType === DIET_TYPES.VEG ? 'success.main' : 'text.secondary',
                      mb: 0.5,
                    }}
                  />
                  <Typography fontWeight={600}>Vegetarian</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Max {MAX_VEG_INGREDIENTS} veggies
                  </Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value={DIET_TYPES.NON_VEG}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <NonVegIcon
                    sx={{
                      fontSize: 32,
                      color: dietType === DIET_TYPES.NON_VEG ? 'error.main' : 'text.secondary',
                      mb: 0.5,
                    }}
                  />
                  <Typography fontWeight={600}>Non-Veg</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Only {MAX_NON_VEG_INGREDIENTS} item
                  </Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </Fade>

        {/* Ingredient Input */}
        <Fade in={isAnimated} timeout={700}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} color="primary.dark" mb={2}>
              Add {dietType === DIET_TYPES.VEG ? 'Vegetables' : 'Non-Veg Item'}
              <Typography component="span" color="text.secondary" fontWeight={400} ml={1}>
                ({ingredients.length}/{maxIngredients})
              </Typography>
            </Typography>

            {/* Autocomplete Input */}
            <Autocomplete
              freeSolo
              options={getIngredientSuggestions(inputValue, dietType, ingredients)}
              inputValue={inputValue}
              onInputChange={(event, newValue) => {
                setInputValue(newValue);
                setError('');
              }}
              onChange={(event, newValue) => {
                if (newValue) {
                  handleAddIngredient(newValue);
                }
              }}
              disabled={!canAddMore}
              renderInput={(params) => (
                <TextField
                  {...params}
                  inputRef={inputRef}
                  placeholder={
                    canAddMore
                      ? `Type ${dietType === DIET_TYPES.VEG ? 'vegetable' : 'meat/fish'} name...`
                      : 'Maximum ingredients reached'
                  }
                  variant="outlined"
                  fullWidth
                  onKeyPress={handleKeyPress}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        {inputValue && (
                          <IconButton
                            size="small"
                            onClick={() => setInputValue('')}
                            sx={{ mr: 0.5 }}
                          >
                            <ClearIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton
                          color="primary"
                          onClick={() => handleAddIngredient(inputValue)}
                          disabled={!inputValue.trim() || !canAddMore}
                          sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            '&:hover': {
                              backgroundColor: 'primary.dark',
                            },
                            '&.Mui-disabled': {
                              backgroundColor: 'action.disabledBackground',
                              color: 'action.disabled',
                            },
                          }}
                        >
                          <AddIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  pr: 1,
                },
              }}
            />

            {/* Error Message */}
            {error && (
              <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Added Ingredients */}
            {ingredients.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  Added Ingredients:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ingredients.map((ing, index) => (
                    <Chip
                      key={`${ing}-${index}`}
                      label={ing}
                      onDelete={() => handleRemoveIngredient(index)}
                      color={dietType === DIET_TYPES.VEG ? 'success' : 'error'}
                      variant="filled"
                      sx={{
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Info Note */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(46, 125, 50, 0.08)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
              }}
            >
              <InfoIcon fontSize="small" color="primary" sx={{ mt: 0.25 }} />
              <Typography variant="body2" color="text.secondary">
                Base ingredients like oil, spices, onion, and garlic will be automatically added by
                Chef Al-Smart.
              </Typography>
            </Box>
          </Paper>
        </Fade>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Continue Button */}
        <Fade in={isAnimated} timeout={900}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleNext}
            disabled={ingredients.length === 0}
            endIcon={<ForwardIcon />}
            sx={{
              py: 2,
              borderRadius: 4,
              fontSize: '1.1rem',
              mb: 2,
            }}
          >
            Continue
          </Button>
        </Fade>
      </Container>
    </Box>
  );
};

export default IngredientInputScreen;
