import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, message, Table } from 'antd';
import dayjs from 'dayjs';
import { fetchOrders } from '../../api';

function groupBy(arr, fn) {
  return arr.reduce((acc, x) => {
    const k = fn(x);
    acc[k] = acc[k] || [];
    acc[k].push(x);
    return acc;
  }, {});
}

function AnalyticsDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchOrders()
      .then(resp => setOrders(resp.data))
      .catch(() => message.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0), 0);
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Revenue by day (last 7 days)
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid' && o.paymentTimestamp);
  const revenueByDay = groupBy(paidOrders, o => dayjs(o.paymentTimestamp).format('YYYY-MM-DD'));
  const revenueByDayRows = Object.entries(revenueByDay).map(([date, os]) => ({
    date,
    revenue: os.reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0), 0),
    count: os.length,
  })).sort((a, b) => b.date.localeCompare(a.date));

  // Revenue by week (last 4 weeks)
  const revenueByWeek = groupBy(paidOrders, o => dayjs(o.paymentTimestamp).startOf('week').format('YYYY-[W]WW'));
  const revenueByWeekRows = Object.entries(revenueByWeek).map(([week, os]) => ({
    week,
    revenue: os.reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.price || 0) * i.quantity, 0), 0),
    count: os.length,
  })).sort((a, b) => b.week.localeCompare(a.week));

  // Most popular items
  const itemCounts = {};
  orders.forEach(o => {
    o.items.forEach(i => {
      const key = i.menuItemId;
      itemCounts[key] = (itemCounts[key] || 0) + i.quantity;
    });
  });
  const popularItems = Object.entries(itemCounts)
    .map(([menuItemId, count]) => ({ menuItemId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div>
      <Typography.Title level={4}>Analytics & Reports</Typography.Title>
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Total Orders" value={totalOrders} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Total Revenue (Paid Orders)" value={totalRevenue} prefix="$" precision={2} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title="Completed Orders" value={statusCounts.completed || 0} />
          </Card>
        </Col>
      </Row>
      <Card loading={loading} title="Order Status Breakdown" style={{ marginBottom: 24 }}>
        <Progress
          percent={totalOrders ? ((statusCounts.completed || 0) / totalOrders) * 100 : 0}
          format={p => `Completed: ${statusCounts.completed || 0}`}
          status="success"
        />
        <Progress
          percent={totalOrders ? ((statusCounts.ready || 0) / totalOrders) * 100 : 0}
          format={p => `Ready: ${statusCounts.ready || 0}`}
          status="active"
        />
        <Progress
          percent={totalOrders ? ((statusCounts.in_progress || 0) / totalOrders) * 100 : 0}
          format={p => `In Progress: ${statusCounts.in_progress || 0}`}
          status="normal"
        />
        <Progress
          percent={totalOrders ? ((statusCounts.pending || 0) / totalOrders) * 100 : 0}
          format={p => `Pending: ${statusCounts.pending || 0}`}
          status="exception"
        />
      </Card>
      <Row gutter={24}>
        <Col span={12}>
          <Card loading={loading} title="Revenue by Day (Last 7 Days)">
            <Table
              size="small"
              columns={[
                { title: 'Date', dataIndex: 'date', key: 'date' },
                { title: 'Orders', dataIndex: 'count', key: 'count' },
                { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: v => `$${v.toFixed(2)}` },
              ]}
              dataSource={revenueByDayRows.slice(0, 7)}
              rowKey="date"
              pagination={false}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card loading={loading} title="Revenue by Week (Last 4 Weeks)">
            <Table
              size="small"
              columns={[
                { title: 'Week', dataIndex: 'week', key: 'week' },
                { title: 'Orders', dataIndex: 'count', key: 'count' },
                { title: 'Revenue', dataIndex: 'revenue', key: 'revenue', render: v => `$${v.toFixed(2)}` },
              ]}
              dataSource={revenueByWeekRows.slice(0, 4)}
              rowKey="week"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
      <Card loading={loading} title="Most Popular Items" style={{ marginTop: 24 }}>
        <Table
          size="small"
          columns={[
            { title: 'Menu Item ID', dataIndex: 'menuItemId', key: 'menuItemId' },
            { title: 'Total Ordered', dataIndex: 'count', key: 'count' },
          ]}
          dataSource={popularItems}
          rowKey="menuItemId"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default AnalyticsDashboard; 