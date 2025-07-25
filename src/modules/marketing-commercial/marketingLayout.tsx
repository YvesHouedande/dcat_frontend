import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

export default function MarketingLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
