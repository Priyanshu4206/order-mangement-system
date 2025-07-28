import React from "react";
import { useAnalytics } from "../../../hooks/useAnalytics";
import StatsCards from "./StatsCards";
import StatusBreakdown from "./StatusBreakdown";
import RevenueChart from "./RevenueChart";
import PopularItems from "./PopularItems";
import LoadingSpinner from "../../ui/LoadingSpinner";
import Alert from "../../ui/Alert";

const Analytics = () => {
  const { analytics, loading, error } = useAnalytics();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mb-6">
        {error}
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Analytics Dashboard
        </h2>
        <p className="text-muted-foreground">
          Overview of your restaurant performance
        </p>
      </div>

      <StatsCards stats={analytics.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusBreakdown
          statusCounts={analytics.statusCounts}
          totalOrders={analytics.stats.totalOrders}
        />
        <PopularItems items={analytics.popularItems} />
      </div>

      <RevenueChart
        dailyRevenue={analytics.revenueByDay}
        weeklyRevenue={analytics.revenueByWeek}
      />
    </div>
  );
};

export default Analytics;
