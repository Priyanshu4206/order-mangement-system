import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";
import Card from "../../ui/Card";

const StatusBreakdown = ({ statusCounts, totalOrders }) => {
  const statuses = [
    {
      key: "completed",
      label: "Completed",
      color: "bg-success",
      icon: CheckCircle,
      iconColor: "text-success",
    },
    {
      key: "ready",
      label: "Ready",
      color: "bg-primary",
      icon: Circle,
      iconColor: "text-primary",
    },
    {
      key: "in_progress",
      label: "In Progress",
      color: "bg-warning",
      icon: Clock,
      iconColor: "text-warning",
    },
    {
      key: "pending",
      label: "Pending",
      color: "bg-error",
      icon: AlertCircle,
      iconColor: "text-error",
    },
  ];

  const getPercentage = (count) => {
    return totalOrders > 0 ? (count / totalOrders) * 100 : 0;
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">
          Order Status Breakdown
        </h3>
      </div>
      <div className="space-y-4">
        {statuses.map((status) => {
          const count = statusCounts[status.key] || 0;
          const percentage = getPercentage(count);
          const IconComponent = status.icon;

          return (
            <div key={status.key}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-4 w-4 ${status.iconColor}`} />
                  <span className="text-sm font-medium text-foreground">
                    {status.label}: {count}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${status.color}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StatusBreakdown;
