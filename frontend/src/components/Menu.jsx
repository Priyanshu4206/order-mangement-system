import { Frown, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useStore from "../store";
import MenuCard from "./MenuCard";

function Menu({ readOnly = false }) {
  const { menu, fetchMenu, addToCart, loading, error } = useStore();
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleQuantityChange = (id, value) => {
    setQuantities((q) => ({ ...q, [id]: value }));
  };

  const handleAddToCart = (item) => {
    const quantity = quantities[item.id] || 1;
    addToCart({ ...item, quantity });
    setQuantities((q) => ({ ...q, [item.id]: 1 }));
  };

  if (loading) {
    return <LoadingSpinner message="Loading menu..." />;
  }

  if (error) {
    return (
      <EmptyState
        icon={Frown}
        title="Failed to load menu"
        description="We're having trouble loading the menu. Please try again later."
      />
    );
  }

  if (menu.length === 0) {
    return (
      <EmptyState
        icon={Utensils}
        title="No menu items available"
        description="Our chef is working on creating delicious dishes. Check back soon!"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
      {menu.map((item) => (
        <MenuCard
          key={item.id}
          item={item}
          readOnly={readOnly}
          onAddToCart={handleAddToCart}
          showRating={true}
          showCookTime={true}
        />
      ))}
    </div>
  );
}

export default Menu;
