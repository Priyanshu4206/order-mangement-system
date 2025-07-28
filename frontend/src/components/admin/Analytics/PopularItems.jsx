import { Award, Medal, Trophy } from "lucide-react";
import Badge from "../../ui/Badge";
import Card from "../../ui/Card";

const PopularItems = ({ items }) => {
  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 2:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Most Popular Items
      </h3>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No data available
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.menuItemId}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" size="sm">
                    #{index + 1}
                  </Badge>
                </div>
                <span className="font-medium text-foreground">
                  Item #{item.menuItemId}
                </span>
                {getRankIcon(index)}
              </div>
              <Badge variant="primary" size="sm">
                {item.count} orders
              </Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default PopularItems;
