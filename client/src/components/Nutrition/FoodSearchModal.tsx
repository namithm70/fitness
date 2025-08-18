import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Search, Plus, Clock } from 'lucide-react';
import { Food } from '../../types/nutrition';
import { getAllIndianFoods, indianFoodCategories } from '../../data/indianFood';

interface FoodSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFoodSelected: (food: Food) => void;
}

const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  isOpen,
  onClose,
  onFoodSelected
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [recentFoods, setRecentFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to get foods by Indian category

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'grains', label: 'Grains' },
    { value: 'protein', label: 'Protein' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'fats', label: 'Fats & Oils' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'condiments', label: 'Condiments' },
    { value: 'other', label: 'Other' },
    // Indian food categories
    { value: 'indian-breakfast', label: 'Indian Breakfast' },
    { value: 'indian-main', label: 'Indian Main Dishes' },
    { value: 'indian-breads', label: 'Indian Breads' },
    { value: 'indian-snacks', label: 'Indian Snacks' },
    { value: 'indian-desserts', label: 'Indian Desserts' },
    { value: 'indian-beverages', label: 'Indian Beverages' }
  ];

  // Sample foods for demonstration including Indian foods
  const sampleFoods: Food[] = useMemo(() => [
    // Regular foods
    ...getAllIndianFoods(), // Add all Indian foods
    
    // Fruits
    {
      _id: '1',
      name: 'Banana',
      category: 'fruits',
      servingSize: { amount: 118, unit: 'g' },
      nutrition: {
        calories: 105,
        protein: 1.3,
        carbohydrates: 27,
        fat: 0.4,
        fiber: 3.1,
        sugar: 14,
        sodium: 1,
        cholesterol: 0,
        saturatedFat: 0.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 100,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Apple',
      category: 'fruits',
      servingSize: { amount: 182, unit: 'g' },
      nutrition: {
        calories: 95,
        protein: 0.5,
        carbohydrates: 25,
        fat: 0.3,
        fiber: 4.4,
        sugar: 19,
        sodium: 2,
        cholesterol: 0,
        saturatedFat: 0.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 90,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '3',
      name: 'Orange',
      category: 'fruits',
      servingSize: { amount: 131, unit: 'g' },
      nutrition: {
        calories: 62,
        protein: 1.2,
        carbohydrates: 15,
        fat: 0.2,
        fiber: 3.1,
        sugar: 12,
        sodium: 0,
        cholesterol: 0,
        saturatedFat: 0,
        transFat: 0
      },
      isPublic: true,
      usageCount: 85,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '4',
      name: 'Mango',
      category: 'fruits',
      servingSize: { amount: 165, unit: 'g' },
      nutrition: {
        calories: 99,
        protein: 1.4,
        carbohydrates: 25,
        fat: 0.6,
        fiber: 2.6,
        sugar: 23,
        sodium: 2,
        cholesterol: 0,
        saturatedFat: 0.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 70,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '5',
      name: 'Pineapple',
      category: 'fruits',
      servingSize: { amount: 165, unit: 'g' },
      nutrition: {
        calories: 83,
        protein: 0.9,
        carbohydrates: 22,
        fat: 0.2,
        fiber: 2.3,
        sugar: 16,
        sodium: 2,
        cholesterol: 0,
        saturatedFat: 0,
        transFat: 0
      },
      isPublic: true,
      usageCount: 65,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '6',
      name: 'Strawberry',
      category: 'fruits',
      servingSize: { amount: 152, unit: 'g' },
      nutrition: {
        calories: 49,
        protein: 1.0,
        carbohydrates: 12,
        fat: 0.5,
        fiber: 3.0,
        sugar: 7.4,
        sodium: 1,
        cholesterol: 0,
        saturatedFat: 0,
        transFat: 0
      },
      isPublic: true,
      usageCount: 60,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '7',
      name: 'Grapes',
      category: 'fruits',
      servingSize: { amount: 151, unit: 'g' },
      nutrition: {
        calories: 104,
        protein: 1.1,
        carbohydrates: 27,
        fat: 0.2,
        fiber: 1.4,
        sugar: 23,
        sodium: 3,
        cholesterol: 0,
        saturatedFat: 0.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 55,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '8',
      name: 'Watermelon',
      category: 'fruits',
      servingSize: { amount: 154, unit: 'g' },
      nutrition: {
        calories: 46,
        protein: 0.9,
        carbohydrates: 12,
        fat: 0.2,
        fiber: 0.6,
        sugar: 9.4,
        sodium: 2,
        cholesterol: 0,
        saturatedFat: 0,
        transFat: 0
      },
      isPublic: true,
      usageCount: 50,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // Proteins
    {
      _id: '9',
      name: 'Chicken Breast',
      category: 'protein',
      servingSize: { amount: 100, unit: 'g' },
      nutrition: {
        calories: 165,
        protein: 31,
        carbohydrates: 0,
        fat: 3.6,
        fiber: 0,
        sugar: 0,
        sodium: 74,
        cholesterol: 85,
        saturatedFat: 1.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 95,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '10',
      name: 'Salmon',
      category: 'protein',
      servingSize: { amount: 100, unit: 'g' },
      nutrition: {
        calories: 208,
        protein: 25,
        carbohydrates: 0,
        fat: 12,
        fiber: 0,
        sugar: 0,
        sodium: 59,
        cholesterol: 55,
        saturatedFat: 2.3,
        transFat: 0
      },
      isPublic: true,
      usageCount: 80,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '11',
      name: 'Eggs',
      category: 'protein',
      servingSize: { amount: 50, unit: 'g' },
      nutrition: {
        calories: 74,
        protein: 6.3,
        carbohydrates: 0.4,
        fat: 5.0,
        fiber: 0,
        sugar: 0.4,
        sodium: 71,
        cholesterol: 186,
        saturatedFat: 1.6,
        transFat: 0
      },
      isPublic: true,
      usageCount: 85,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // Grains
    {
      _id: '12',
      name: 'Brown Rice',
      category: 'grains',
      servingSize: { amount: 100, unit: 'g' },
      nutrition: {
        calories: 111,
        protein: 2.6,
        carbohydrates: 23,
        fat: 0.9,
        fiber: 1.8,
        sugar: 0.4,
        sodium: 5,
        cholesterol: 0,
        saturatedFat: 0.2,
        transFat: 0
      },
      isPublic: true,
      usageCount: 80,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '13',
      name: 'Quinoa',
      category: 'grains',
      servingSize: { amount: 100, unit: 'g' },
      nutrition: {
        calories: 120,
        protein: 4.4,
        carbohydrates: 22,
        fat: 1.9,
        fiber: 2.8,
        sugar: 0.9,
        sodium: 7,
        cholesterol: 0,
        saturatedFat: 0.2,
        transFat: 0
      },
      isPublic: true,
      usageCount: 70,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // Dairy
    {
      _id: '14',
      name: 'Greek Yogurt',
      category: 'dairy',
      servingSize: { amount: 100, unit: 'g' },
      nutrition: {
        calories: 59,
        protein: 10,
        carbohydrates: 3.6,
        fat: 0.4,
        fiber: 0,
        sugar: 3.2,
        sodium: 36,
        cholesterol: 5,
        saturatedFat: 0.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 75,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '15',
      name: 'Milk',
      category: 'dairy',
      servingSize: { amount: 244, unit: 'ml' },
      nutrition: {
        calories: 103,
        protein: 8.2,
        carbohydrates: 12,
        fat: 2.4,
        fiber: 0,
        sugar: 12,
        sodium: 107,
        cholesterol: 24,
        saturatedFat: 1.5,
        transFat: 0
      },
      isPublic: true,
      usageCount: 90,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    
    // Vegetables
    {
      _id: '16',
      name: 'Spinach',
      category: 'vegetables',
      servingSize: { amount: 100, unit: 'g' },
      nutrition: {
        calories: 23,
        protein: 2.9,
        carbohydrates: 3.6,
        fat: 0.4,
        fiber: 2.2,
        sugar: 0.4,
        sodium: 79,
        cholesterol: 0,
        saturatedFat: 0.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 60,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '17',
      name: 'Broccoli',
      category: 'vegetables',
      servingSize: { amount: 91, unit: 'g' },
      nutrition: {
        calories: 31,
        protein: 2.6,
        carbohydrates: 6.0,
        fat: 0.3,
        fiber: 2.4,
        sugar: 1.5,
        sodium: 30,
        cholesterol: 0,
        saturatedFat: 0.1,
        transFat: 0
      },
      isPublic: true,
      usageCount: 55,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      _id: '18',
      name: 'Carrots',
      category: 'vegetables',
      servingSize: { amount: 128, unit: 'g' },
      nutrition: {
        calories: 52,
        protein: 1.2,
        carbohydrates: 12,
        fat: 0.3,
        fiber: 3.6,
        sugar: 6.1,
        sodium: 88,
        cholesterol: 0,
        saturatedFat: 0,
        transFat: 0
      },
      isPublic: true,
      usageCount: 65,
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ], []);

  useEffect(() => {
    if (isOpen) {
      setFoods(sampleFoods);
      setRecentFoods(sampleFoods.slice(0, 5));
    }
  }, [isOpen, sampleFoods]);

  const searchFoods = useCallback(async () => {
    try {
      setLoading(true);
      let filtered = sampleFoods;

      if (selectedCategory && selectedCategory.startsWith('indian-')) {
        const getFoodsByIndianCategory = (categoryValue: string): Food[] => {
          switch (categoryValue) {
            case 'indian-breakfast':
              return indianFoodCategories.find(cat => cat.id === 'breakfast')?.foods || [];
            case 'indian-main':
              return indianFoodCategories.find(cat => cat.id === 'main-dishes')?.foods || [];
            case 'indian-breads':
              return indianFoodCategories.find(cat => cat.id === 'breads')?.foods || [];
            case 'indian-snacks':
              return indianFoodCategories.find(cat => cat.id === 'snacks')?.foods || [];
            case 'indian-desserts':
              return indianFoodCategories.find(cat => cat.id === 'desserts')?.foods || [];
            case 'indian-beverages':
              return indianFoodCategories.find(cat => cat.id === 'beverages')?.foods || [];
            default:
              return [];
          }
        };
        const indianFoods = getFoodsByIndianCategory(selectedCategory);
        filtered = indianFoods.filter(food => {
          return !searchQuery ||
            food.name.toLowerCase().includes(searchQuery.toLowerCase());
        });
      } else {
        filtered = sampleFoods.filter(food => {
          const matchesQuery = !searchQuery ||
            food.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesCategory = !selectedCategory ||
            food.category === selectedCategory;
          return matchesQuery && matchesCategory;
        });
      }
      setFoods(filtered);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setLoading(false);
    }
  }, [sampleFoods, searchQuery, selectedCategory]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery || selectedCategory) {
        searchFoods();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, searchFoods]);

  const handleFoodSelect = (food: Food) => {
    onFoodSelected(food);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/5">
          <h2 className="text-xl font-semibold text-white">Search Foods</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-white/20 bg-white/5">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for foods..."
                  className="w-full pl-10 pr-4 py-2 border border-white/20 bg-white/10 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-white/20 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {categories.map(category => (
                  <option 
                    key={category.value} 
                    value={category.value}
                    className="bg-white/10 text-white border-white/20"
                  >
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <div className="p-6">
              {/* Show recent foods when no search is active */}
              {!searchQuery && !selectedCategory && recentFoods.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-white/60" />
                    <h3 className="text-lg font-semibold text-white">Recent Foods</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentFoods.map((food) => (
                      <div
                        key={food._id}
                        onClick={() => handleFoodSelect(food)}
                        className="border border-white/20 rounded-lg p-4 hover:border-purple-400 hover:bg-white/10 transition-all cursor-pointer bg-white/5 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-white">{food.name}</h3>
                            <p className="text-sm text-white/80 capitalize">
                              {food.category}
                            </p>
                            <p className="text-xs text-white/60 mt-1">
                              {food.nutrition.calories} cal per {food.servingSize.amount}{food.servingSize.unit}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-white/60" />
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-white/70">Protein:</span>
                            <span className="font-medium ml-1 text-white">{food.nutrition.protein}g</span>
                          </div>
                          <div>
                            <span className="text-white/70">Carbs:</span>
                            <span className="font-medium ml-1 text-white">{food.nutrition.carbohydrates}g</span>
                          </div>
                          <div>
                            <span className="text-white/70">Fat:</span>
                            <span className="font-medium ml-1 text-white">{food.nutrition.fat}g</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show search results */}
              {foods.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-white/40 mx-auto mb-3" />
                  <p className="text-white/80">No foods found</p>
                  <p className="text-sm text-white/60 mt-1">
                    Try adjusting your search terms or category filter
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foods.map((food) => (
                    <div
                      key={food._id}
                      onClick={() => handleFoodSelect(food)}
                      className="border border-white/20 rounded-lg p-4 hover:border-purple-400 hover:bg-white/10 transition-all cursor-pointer bg-white/5 backdrop-blur-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-white">{food.name}</h3>
                          <p className="text-sm text-white/80 capitalize">
                            {food.category}
                          </p>
                          <p className="text-xs text-white/60 mt-1">
                            {food.nutrition.calories} cal per {food.servingSize.amount}{food.servingSize.unit}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-white/60" />
                      </div>
                      
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-white/70">Protein:</span>
                          <span className="font-medium ml-1 text-white">{food.nutrition.protein}g</span>
                        </div>
                        <div>
                          <span className="text-white/70">Carbs:</span>
                          <span className="font-medium ml-1 text-white">{food.nutrition.carbohydrates}g</span>
                        </div>
                        <div>
                          <span className="text-white/70">Fat:</span>
                          <span className="font-medium ml-1 text-white">{food.nutrition.fat}g</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 bg-white/5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/70">
              {foods.length} foods found
            </p>
            <button
              onClick={onClose}
              className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSearchModal;
