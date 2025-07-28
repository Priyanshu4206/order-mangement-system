import React from "react";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import { Search } from "lucide-react";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../../utils/constants";

const OrderFilters = ({ filters, onFiltersChange }) => {
  const updateFilter = (key, value) => {
    onFiltersChange((prev) => ({ ...prev, [key]: value }));
  };

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: ORDER_STATUS.PENDING, label: "Pending" },
    { value: ORDER_STATUS.IN_PROGRESS, label: "In Progress" },
    { value: ORDER_STATUS.READY, label: "Ready" },
    { value: ORDER_STATUS.COMPLETED, label: "Completed" },
  ];

  const paymentStatusOptions = [
    { value: "", label: "All Payments" },
    { value: PAYMENT_STATUS.PENDING, label: "Pending" },
    { value: PAYMENT_STATUS.PAID, label: "Paid" },
  ];

  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Search Order ID
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter order ID..."
              value={filters.search}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Order Status
          </label>
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(value) => updateFilter("status", value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Payment Status
          </label>
          <Select
            options={paymentStatusOptions}
            value={filters.paymentStatus}
            onChange={(value) => updateFilter("paymentStatus", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
