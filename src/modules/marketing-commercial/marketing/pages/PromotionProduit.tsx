import CataloguePage from "@/modules/stocks/reference/pages/cataloguePage";
import Layout from "@/components/Layout";
function PromotionProduit() {
  return (
    <>
      <Layout>
        <CataloguePage showSocialSharing={true} />;
      </Layout>
    </>
  );
}

export default PromotionProduit;
