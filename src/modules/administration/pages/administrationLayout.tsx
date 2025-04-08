import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function AdministrationLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default AdministrationLayout;
