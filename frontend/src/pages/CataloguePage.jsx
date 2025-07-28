import { Utensils } from "lucide-react";
import { useEffect } from "react";
import MenuCard from "../components/MenuCard";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import useStore from "../store";

function CataloguePage() {
  const { menu, fetchMenu, loading, error } = useStore();

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="flex items-center justify-center text-4xl font-bold text-gray-900 mb-6 tracking-wide">
        <Utensils className="mr-3" size={32} />
        Explore Our Exquisite Menu
      </h1>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading menu..." />
      ) : error ? (
        <EmptyState
          icon={Frown}
          title="Failed to load menu"
          description="We're having trouble loading the menu. Please try again later."
        />
      ) : menu.length === 0 ? (
        <EmptyState
          icon={Utensils}
          title="No menu items available yet"
          description="Our chef is working on creating delicious dishes. Check back soon!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {menu.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              readOnly={true}
              showRating={true}
              showCookTime={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CataloguePage;
