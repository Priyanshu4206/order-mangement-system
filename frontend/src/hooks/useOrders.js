import { useEffect, useState } from "react";
import { deleteOrder, fetchOrders, updatePayment } from "../api";
import useStore from "../store";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useStore((state) => state.token);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchOrders();
      setOrders(response.data);
    } catch (err) {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderPayment = async (orderId, paymentStatus, paymentMethod) => {
    try {
      await updatePayment(orderId, paymentStatus, paymentMethod, token);
      await loadOrders();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to update payment" };
    }
  };

  const removeOrder = async (orderId) => {
    try {
      await deleteOrder(orderId, token);
      await loadOrders();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Failed to delete order" };
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    loadOrders,
    updateOrderPayment,
    removeOrder,
  };
};
