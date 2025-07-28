import { useState } from 'react';
import { Star, Clock, ChefHat, Heart } from 'lucide-react';
import { cn } from '../utils/cn';
import Button from './ui/Button';
import QuantityInput from './ui/QuantityInput';

const MenuCard = ({ 
  item, 
  readOnly = false,
  onAddToCart,
  className,
  showRating = false,
  showCookTime = false,
  ...props 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    onAddToCart({ ...item, quantity });
    setQuantity(1);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group",
        className
      )}
      {...props}
    >
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
        <ChefHat className="w-12 h-12 text-primary-400" />
        
        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            )} 
          />
        </button>
      </div>
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {item.name}
          </h3>
          <span className="text-lg font-bold text-warning-600 bg-warning-50 px-3 py-1 rounded-full whitespace-nowrap ml-2">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        {/* Meta information */}
        {(showRating || showCookTime) && (
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
            {showRating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-warning-400 text-warning-400" />
                <span>{item.rating || '4.5'}</span>
              </div>
            )}
            {showCookTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{item.cookTime || '15-20 min'}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3 mb-4">
          {item.description}
        </p>
        
        {/* Tags */}
        {item.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Add to Cart Section */}
        {!readOnly && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <QuantityInput
              value={quantity}
              onChange={setQuantity}
              size="sm"
            />
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="sm"
            >
              Add to Cart
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;