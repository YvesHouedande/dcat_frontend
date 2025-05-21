
import { administrationFinanceMenu } from "./modules/administration-Finnance/menu";
import { dashboardMenu } from "./modules/dashboard/menu";
import { TechniqueMenu } from "./modules/techniques/menu";
import { stocksMenu } from "./modules/stocks/menu";
import { MoyensGenerauxMenu } from "./modules/MoyensGeneraux/menu";
import { EspacePersonnelMenu } from "./modules/epace-personnel/menu";
import { MarketingCommercialMenu } from "./modules/marketing-commercial/menu";

export const menuConfig = [
  ...dashboardMenu,
  ...administrationFinanceMenu,
  ...stocksMenu,
  ...MoyensGenerauxMenu,
  ...TechniqueMenu,
  ...MarketingCommercialMenu,
  ...EspacePersonnelMenu,

];
