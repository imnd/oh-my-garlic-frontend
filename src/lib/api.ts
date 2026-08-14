import type {
  Ingredient,
  Purchase,
  MenuItem,
  WriteOff,
  ProductionExpense,
  Sale,
  ProfitLossReport,
  LedgerRow,
  ProcurementAnalyticsRow,
  SystemAlert
} from './types';

const API_URL = 'http://localhost:3000/api';

async function apiCall<T>(endpoint: string, method = 'GET', body: any = null): Promise<T | null> {
  try {
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const res = await fetch(`${API_URL}/${endpoint}`, options);
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return await res.json() as T;
  } catch (err: any) {
    console.error(err);
    throw new Error(err.message || 'API Communication Error');
  }
}

export const api = {
  // Ingredients
  getIngredients: () => apiCall<Ingredient[]>('ingredients'),
  createIngredient: (data: Partial<Ingredient>) => apiCall<Ingredient>('ingredients', 'POST', data),
  updateIngredient: (id: number, data: Partial<Ingredient>) => apiCall<Ingredient>(`ingredients/${id}`, 'PUT', data),
  deleteIngredient: (id: number) => apiCall<void>(`ingredients/${id}`, 'DELETE'),

  // Purchases
  getPurchases: () => apiCall<Purchase[]>('purchases'),
  createPurchase: (data: {
    ingredientId: number;
    quantity: number;
    unitPrice: number;
    paymentMethod: string;
    comments?: string;
  }) => apiCall<Purchase>('purchases', 'POST', data),

  // Menu / Recipes
  getMenuItems: () => apiCall<MenuItem[]>('menu-items'),
  createMenuItem: (data: {
    name: string;
    category: string;
    price: number;
    recipeComponents: Array<{
      ingredientId: number;
      grossWeight: number;
      netWeight: number;
    }>;
  }) => apiCall<MenuItem>('menu-items', 'POST', data),

  // Sales (POS)
  getSales: () => apiCall<Sale[]>('sales'),
  createSale: (data: {
    paymentType: string;
    items: Array<{ menuItemId: number; quantity: number }>;
  }) => apiCall<Sale>('sales', 'POST', data),

  // Write Offs
  getWriteOffs: () => apiCall<WriteOff[]>('write-offs'),
  createWriteOff: (data: {
    ingredientId: number;
    quantity: number;
    type: string;
    reason?: string;
  }) => apiCall<WriteOff>('write-offs', 'POST', data),

  // Production Expenses
  getExpenses: () => apiCall<ProductionExpense[]>('production-expenses'),
  createExpense: (data: { name: string; cost: number }) => apiCall<ProductionExpense>('production-expenses', 'POST', data),

  // Reports & Analytics
  getLedger: (start?: string, end?: string) => {
    const query = new URLSearchParams();
    if (start) query.append('startDate', start);
    if (end) query.append('endDate', end);
    return apiCall<LedgerRow[]>(`reports/ledger?${query.toString()}`);
  },
  getProfitLoss: (start?: string, end?: string) => {
    const query = new URLSearchParams();
    if (start) query.append('startDate', start);
    if (end) query.append('endDate', end);
    return apiCall<ProfitLossReport>(`reports/pl?${query.toString()}`);
  },
  getProcurementAnalytics: () => apiCall<ProcurementAnalyticsRow[]>('reports/procurement-analytics'),

  // System Alerts
  getAlerts: () => apiCall<SystemAlert[]>('alerts'),
  clearAlerts: () => apiCall<{ success: boolean }>('alerts/clear', 'POST')
};
