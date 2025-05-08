
import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function InterventionsLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default InterventionsLayout;
