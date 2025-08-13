import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Search, Plus, Clock } from 'lucide-react';
import { Food } from '../../types/nutrition';

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
    { value: 'other', label: 'Other' }
  ];

  // Sample foods for demonstration
  const sampleFoods: Food[] = useMemo(() => [
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
      _id: '3',
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
      _id: '4',
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
      _id: '5',
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
      // In a real app, this would call the API
      // const response = await api.get('/nutrition/foods', {
      //   params: { q: searchQuery, category: selectedCategory }
      // });
      // setFoods(response.data);

      // For now, filter sample foods
      const filtered = sampleFoods.filter(food => {
        const matchesQuery = !searchQuery || 
          food.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !selectedCategory || 
          food.category === selectedCategory;
        return matchesQuery && matchesCategory;
      });
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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Search Foods</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for foods..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="p-6">
              {/* Show recent foods when no search is active */}
              {!searchQuery && !selectedCategory && recentFoods.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Recent Foods</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentFoods.map((food) => (
                      <div
                        key={food._id}
                        onClick={() => handleFoodSelect(food)}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{food.name}</h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {food.category}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {food.nutrition.calories} cal per {food.servingSize.amount}{food.servingSize.unit}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Protein:</span>
                            <span className="font-medium ml-1">{food.nutrition.protein}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Carbs:</span>
                            <span className="font-medium ml-1">{food.nutrition.carbohydrates}g</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Fat:</span>
                            <span className="font-medium ml-1">{food.nutrition.fat}g</span>
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
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No foods found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search terms or category filter
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {foods.map((food) => (
                    <div
                      key={food._id}
                      onClick={() => handleFoodSelect(food)}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{food.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {food.category}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {food.nutrition.calories} cal per {food.servingSize.amount}{food.servingSize.unit}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-gray-400" />
                      </div>
                      
                      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Protein:</span>
                          <span className="font-medium ml-1">{food.nutrition.protein}g</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Carbs:</span>
                          <span className="font-medium ml-1">{food.nutrition.carbohydrates}g</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Fat:</span>
                          <span className="font-medium ml-1">{food.nutrition.fat}g</span>
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
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {foods.length} foods found
            </p>
            <button
              onClick={onClose}
              className="btn-secondary"
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
