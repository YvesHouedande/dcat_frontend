
import Layout from "@/components/Layout";
import { Outlet } from "react-router-dom";

function EspacePersonnelLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default EspacePersonnelLayout;
