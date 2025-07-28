import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useState, useEffect } from "react";
import { fetchOrders } from "../api";

dayjs.extend(isoWeek);

const groupBy = (arr, fn) => {
  return arr.reduce((acc, x) => {
    const k = fn(x);
    acc[k] = acc[k] || [];
    acc[k].push(x);
    return acc;
  }, {});
};

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      completedOrders: 0,
      pendingOrders: 0,
    },
    statusCounts: {},
    revenueByDay: [],
    revenueByWeek: [],
    popularItems: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processAnalytics = (orders) => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");

    const totalRevenue = paidOrders.reduce((sum, order) => {
      return (
        sum +
        (order.items || []).reduce((itemSum, item) => {
          return itemSum + (item.price || 0) * item.quantity;
        }, 0)
      );
    }, 0);

    // Status counts
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Revenue by day (last 7 days)
    const revenueByDay = Object.entries(
      groupBy(
        paidOrders.filter((o) => o.paymentTimestamp),
        (o) => dayjs(o.paymentTimestamp).format("YYYY-MM-DD")
      )
    )
      .map(([date, orderList]) => ({
        date,
        revenue: orderList.reduce((sum, order) => {
          return (
            sum +
            (order.items || []).reduce((itemSum, item) => {
              return itemSum + (item.price || 0) * item.quantity;
            }, 0)
          );
        }, 0),
        count: orderList.length,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 7);

    // Revenue by week (last 4 weeks)
    const revenueByWeek = Object.entries(
      groupBy(
        paidOrders.filter((o) => o.paymentTimestamp),
        (o) => dayjs(o.paymentTimestamp).startOf("isoWeek").format("YYYY-[W]WW")
      )
    )
      .map(([week, orderList]) => ({
        week,
        revenue: orderList.reduce((sum, order) => {
          return (
            sum +
            (order.items || []).reduce((itemSum, item) => {
              return itemSum + (item.price || 0) * item.quantity;
            }, 0)
          );
        }, 0),
        count: orderList.length,
      }))
      .sort((a, b) => b.week.localeCompare(a.week))
      .slice(0, 4);

    // Most popular items
    const itemCounts = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const key = item.menuItemId;
        itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .map(([menuItemId, count]) => ({ menuItemId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      stats: {
        totalOrders,
        totalRevenue,
        completedOrders: statusCounts.completed || 0,
        pendingOrders: statusCounts.pending || 0,
      },
      statusCounts,
      revenueByDay,
      revenueByWeek,
      popularItems,
    };
  };

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchOrders();
      const orders = Array.isArray(response.data) ? response.data : [];
      const processedAnalytics = processAnalytics(orders);
      setAnalytics(processedAnalytics);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    analytics,
    loading,
    error,
    loadAnalytics,
  };
};
