<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from './lib/api';
  import type {
    Ingredient,
    Purchase,
    MenuItem,
    WriteOff,
    ProductionExpense,
    LedgerRow,
    ProfitLossReport,
    ProcurementAnalyticsRow,
    SystemAlert
  } from './lib/types';

  // Core Components
  import Header from './lib/components/Header.svelte';
  import Toast from './lib/components/Toast.svelte';

  // Domain Views
  import PurchasesView from './lib/domains/purchases/PurchasesView.svelte';
  import ProductionView from './lib/domains/production/ProductionView.svelte';
  import PosView from './lib/domains/pos/PosView.svelte';
  import ReportsView from './lib/domains/reports/ReportsView.svelte';
  import IngredientsView from './lib/domains/ingredients/IngredientsView.svelte';

  // Svelte 5 Runes State Management
  let activeTab = $state('purchases');
  
  let ingredients = $state<Ingredient[]>([]);
  let purchases = $state<Purchase[]>([]);
  let menuItems = $state<MenuItem[]>([]);
  let expenses = $state<ProductionExpense[]>([]);
  
  let ledger = $state<LedgerRow[]>([]);
  let profitLoss = $state<ProfitLossReport | null>(null);
  let analyticsData = $state<ProcurementAnalyticsRow[]>([]);
  let alerts = $state<SystemAlert[]>([]);

  // Toast Notification state
  let toast = $state<{ msg: string; type: string } | null>(null);
  let toastTimeout: any;

  function showToast(msg: string, type = 'success') {
    if (toastTimeout) clearTimeout(toastTimeout);
    toast = { msg, type };
    toastTimeout = setTimeout(() => {
      toast = null;
    }, 4000);
  }

  // Load basic nomenclature and active states
  async function loadCoreData() {
    try {
      const [ings, purchs, menus, exps, alrts] = await Promise.all([
        api.getIngredients(),
        api.getPurchases(),
        api.getMenuItems(),
        api.getExpenses(),
        api.getAlerts()
      ]);
      ingredients = ings || [];
      purchases = purchs || [];
      menuItems = menus || [];
      expenses = exps || [];
      alerts = alrts || [];
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  // Load analytical report sheets
  async function loadReports() {
    try {
      const [ledg, pl, an] = await Promise.all([
        api.getLedger(),
        api.getProfitLoss(),
        api.getProcurementAnalytics()
      ]);
      ledger = ledg || [];
      profitLoss = pl || null;
      analyticsData = an || [];
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  // Reactively fetch reports when switching to reports tab
  $effect(() => {
    if (activeTab === 'reports') {
      loadReports();
    }
  });

  onMount(async () => {
    await loadCoreData();
  });

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------

  async function handleSaveIngredient(name: string, unit: string, category: string, stock = 0, averagePrice = 0) {
    try {
      const res = await api.createIngredient({ name, unit, category, stock, averagePrice });
      if (res) {
        showToast(`Ingredient "${res.name}" added successfully`);
        await loadCoreData();
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleUpdateIngredient(id: number, data: Partial<Ingredient>) {
    try {
      const res = await api.updateIngredient(id, data);
      if (res) {
        showToast(`Ingredient "${res.name}" updated successfully`);
        await loadCoreData();
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleDeleteIngredient(id: number) {
    try {
      await api.deleteIngredient(id);
      showToast('Ingredient deleted successfully');
      await loadCoreData();
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleSavePurchase(data: {
    ingredientId: number;
    quantity: number;
    unitPrice: number;
    paymentMethod: string;
    comments?: string;
  }) {
    try {
      const res = await api.createPurchase(data);
      if (res) {
        showToast('Purchase registered successfully');
        await loadCoreData();
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleSaveRecipe(data: {
    name: string;
    category: string;
    price: number;
    recipeComponents: Array<{ ingredientId: number; grossWeight: number; netWeight: number }>;
  }) {
    try {
      const res = await api.createMenuItem(data);
      if (res) {
        showToast(`Dish "${res.name}" added to menu`);
        await loadCoreData();
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleSaveExpense(data: { name: string; cost: number }) {
    try {
      const res = await api.createExpense(data);
      if (res) {
        showToast('Consumable expense registered');
        await loadCoreData();
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleSaveWriteOff(data: { ingredientId: number; quantity: number; type: string; reason?: string }) {
    try {
      const res = await api.createWriteOff(data);
      if (res) {
        showToast('Ingredient write-off logged successfully');
        await loadCoreData();
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleCheckout(paymentType: string, items: Array<{ menuItemId: number; quantity: number }>) {
    try {
      const res = await api.createSale({ paymentType, items });
      if (res) {
        showToast('Sale checkout complete');
        await loadCoreData();
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }

  async function handleClearAlerts() {
    try {
      const res = await api.clearAlerts();
      if (res?.success) {
        alerts = [];
        showToast('System alerts cleared');
      }
    } catch (err: any) {
      showToast(err.message, 'danger');
    }
  }
</script>

<Header {activeTab} onTabChange={(tab) => activeTab = tab} />

<!-- Alert Banner -->
{#if alerts.length > 0}
  <div class="alerts-banner flex-between">
    <div class="alerts-list">
      <strong>⚠️ System Stock Alerts:</strong>
      <ul>
        {#each alerts as alert}
          <li>{alert.message}</li>
        {/each}
      </ul>
    </div>
    <button class="btn btn-secondary btn-sm" onclick={handleClearAlerts}>Clear Alerts</button>
  </div>
{/if}

<!-- Toast Notifications -->
<Toast {toast} />

<main class="content-wrapper">
  {#if activeTab === 'ingredients'}
    <IngredientsView 
      {ingredients} 
      onSaveIngredient={handleSaveIngredient} 
      onUpdateIngredient={handleUpdateIngredient} 
      onDeleteIngredient={handleDeleteIngredient} 
    />
  {:else if activeTab === 'purchases'}
    <PurchasesView 
      {ingredients} 
      {purchases} 
      onSavePurchase={handleSavePurchase} 
      onQuickAddIngredient={handleSaveIngredient} 
    />
  {:else}
    <!-- Make sure lists/caches load in background when tab switches -->
    {#if activeTab === 'production'}
      <ProductionView 
        {ingredients} 
        {menuItems} 
        onSaveRecipe={handleSaveRecipe} 
        onSaveExpense={handleSaveExpense} 
        onSaveWriteOff={handleSaveWriteOff} 
      />
    {:else if activeTab === 'pos'}
      <PosView 
        {menuItems} 
        onCheckout={handleCheckout} 
      />
    {:else if activeTab === 'reports'}
      <ReportsView 
        {profitLoss} 
        {ledger} 
        {analyticsData} 
      />
    {/if}
  {/if}
</main>

<style>
  .content-wrapper {
    max-width: 1400px;
    margin: 2rem auto;
    padding: 0 1.5rem 6rem 1.5rem;
  }
  .alerts-banner {
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    margin: 1.5rem auto 0 auto;
    max-width: 1350px;
  }
  .alerts-list ul {
    margin: 0.25rem 0 0 0;
    padding-left: 1.25rem;
    font-size: 0.8125rem;
    color: var(--text-primary);
  }
</style>
