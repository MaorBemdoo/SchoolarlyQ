import { redirect } from "next/navigation";
import React from "react";

const AdminDashboard = () => {
  redirect("/admin/exams/create");
  return <div>Admin Dashboard</div>;
};

export default AdminDashboard;
