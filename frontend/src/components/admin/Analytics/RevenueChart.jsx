import { Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import { formatCurrency, formatDate } from "../../../utils/formatters";
import Button from "../../ui/Button";
import Card from "../../ui/Card";

const RevenueChart = ({ dailyRevenue, weeklyRevenue }) => {
  const [viewMode, setViewMode] = useState("daily");

  const data = viewMode === "daily" ? dailyRevenue : weeklyRevenue;
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Revenue Overview
          </h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "daily" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("daily")}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Daily
          </Button>
          <Button
            variant={viewMode === "weekly" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("weekly")}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Weekly
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No revenue data available
          </p>
        ) : (
          data.map((item) => {
            const percentage = (item.revenue / maxRevenue) * 100;
            const dateLabel =
              viewMode === "daily"
                ? formatDate(item.date)
                : `Week ${item.week}`;

            return (
              <div key={item.date || item.week} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">
                    {dateLabel}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">
                      {formatCurrency(item.revenue)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.count} orders
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="h-3 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default RevenueChart;
