import Layout from "@/components/Layout";

import { Outlet } from "react-router-dom";
function InterventionLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default InterventionLayout;
