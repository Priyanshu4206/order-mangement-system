import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminTabs from "../../components/admin/AdminTabs";
import Analytics from "../../components/admin/Analytics";
import MenuManager from "../../components/admin/MenuManager";
import OrderManager from "../../components/admin/OrderManager";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("orders");

  const tabs = [
    {
      id: "orders",
      label: "Orders",
      component: <OrderManager />,
    },
    {
      id: "menu",
      label: "Menu",
      component: <MenuManager />,
    },
    {
      id: "analytics",
      label: "Analytics",
      component: <Analytics />,
    },
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-muted/30">
        <div className="container-mobile py-6 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your restaurant operations
            </p>
          </div>

          <AdminTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <div className="mt-6">
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPanel;
