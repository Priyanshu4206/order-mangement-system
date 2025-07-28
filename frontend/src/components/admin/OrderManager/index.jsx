import { Grid3X3, List, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useOrders } from "../../../hooks/useOrders";
import Alert from "../../ui/Alert";
import Button from "../../ui/Button";
import EmptyState from "../../ui/EmptyState";
import LoadingSpinner from "../../ui/LoadingSpinner";
import OrderCard from "./OrderCard";
import OrderFilters from "./OrderFilters";
import OrderTable from "./OrderTable";

const OrderManager = () => {
  const { orders, loading, error, updateOrderPayment, removeOrder } =
    useOrders();
  const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'
  const [filters, setFilters] = useState({
    status: "",
    paymentStatus: "",
    search: "",
  });

  const filteredOrders = orders.filter((order) => {
    if (filters.status && order.status !== filters.status) return false;
    if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus)
      return false;
    if (filters.search && !order.id.toString().includes(filters.search))
      return false;
    return true;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Orders Management
          </h2>
          <p className="text-muted-foreground">
            {filteredOrders.length} of {orders.length} orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "cards" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="flex items-center gap-2"
          >
            <Grid3X3 className="h-4 w-4" />
            <span className="hidden sm:inline">Cards</span>
          </Button>
          <Button
            variant={viewMode === "table" ? "primary" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            <span className="hidden sm:inline">Table</span>
          </Button>
        </div>
      </div>

      <OrderFilters filters={filters} onFiltersChange={setFilters} />

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="No orders match your current filters"
          icon={<ShoppingCart className="h-12 w-12 text-muted-foreground" />}
        />
      ) : (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdatePayment={updateOrderPayment}
                  onDelete={removeOrder}
                />
              ))}
            </div>
          ) : (
            <div className="hidden md:block">
              <OrderTable
                orders={filteredOrders}
                onUpdatePayment={updateOrderPayment}
                onDelete={removeOrder}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderManager;
