import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {children}
    </div>
  );
};

export default AdminLayout;
