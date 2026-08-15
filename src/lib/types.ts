export interface Ingredient {
  id: number;
  name: string;
  unit: string; // kg, L, pcs, pack
  category: string;
  stock: number;
  averagePrice: number;
}

export interface Purchase {
  id: number;
  ingredientId: number;
  ingredient?: Ingredient;
  dateTime: string;
  quantity: number;
  unitPrice: number; // integer (int4)
  totalCost: number; // integer (int4)
  paymentMethod: string;
  comments?: string;
}

export interface RecipeComponent {
  id?: number;
  menuItemId?: number;
  ingredientId: number;
  ingredient?: Ingredient;
  name?: string; // transient
  unit?: string; // transient
  grossWeight: number;
  netWeight: number;
  wastePercentage?: number;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string; // Kitchen, Bar, Desserts
  price: number;
  recipeComponents: RecipeComponent[];
}

export interface SaleItem {
  id: number;
  saleId: number;
  menuItemId: number;
  menuItem?: MenuItem;
  quantity: number;
  cogs: number;
}

export interface Sale {
  id: number;
  dateTime: string;
  paymentType: string; // Cash, Terminal, QR Code
  status: string;
  items: SaleItem[];
}

export interface WriteOff {
  id: number;
  ingredientId: number;
  ingredient?: Ingredient;
  quantity: number;
  type: string; // Sales, Spoilage, StaffMeals, Tasting
  reason?: string;
  dateTime: string;
  cost: number;
}

export interface ProductionExpense {
  id: number;
  name: string;
  cost: number;
  dateTime: string;
}

export interface ProfitLossReport {
  grossSalesRevenue: number;
  cogs: number;
  grossProfit: number;
  operationalLoss: number;
  directExpenses: number;
  netProfit: number;
  itemMargins: Array<{
    id: number;
    name: string;
    category: string;
    price: number;
    cost: number;
    margin: number;
    marginPercent: number;
  }>;
}

export interface LedgerRow {
  ingredientId: number;
  name: string;
  unit: string;
  category: string;
  startingBalance: number;
  intake: number;
  outflow: number;
  endingBalance: number;
  averagePrice: number;
}

export interface ProcurementAnalyticsRow {
  ingredientId: number;
  name: string;
  unit: string;
  history: Array<{
    dateTime: string;
    unitPrice: number;
    quantity: number;
  }>;
}

export interface SystemAlert {
  message: string;
  timestamp: string;
}
