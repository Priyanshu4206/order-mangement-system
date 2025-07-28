import { BarChart3, ShoppingCart, UtensilsCrossed } from "lucide-react";

const AdminTabs = ({ tabs, activeTab, onTabChange }) => {
  const getTabIcon = (tabId) => {
    switch (tabId) {
      case "orders":
        return <ShoppingCart className="h-5 w-5" />;
      case "menu":
        return <UtensilsCrossed className="h-5 w-5" />;
      case "analytics":
        return <BarChart3 className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="border-b border-border">
      <nav className="flex space-x-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg
              transition-all duration-200 whitespace-nowrap touch-target
              ${
                activeTab === tab.id
                  ? "bg-background text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }
            `}
          >
            {getTabIcon(tab.id)}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminTabs;
