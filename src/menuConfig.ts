import { accountingMenu } from './modules/accounting/menu';
import { administrationMenu } from './modules/administration/menu';
import { interventionsMenu } from './modules/interventions/menu';
import { dashboardMenu } from './modules/dashboard/menu';
import { projetsMenu } from './modules/projects/menu';
import { stocksMenu } from './modules/stocks/Pages/menu';

export const menuConfig = [
  ...dashboardMenu,
    ...stocksMenu,
  ...accountingMenu,
  ...administrationMenu,
  ...interventionsMenu,
  ...projetsMenu,
]; 