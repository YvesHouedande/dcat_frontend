import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function StockLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default StockLayout;
