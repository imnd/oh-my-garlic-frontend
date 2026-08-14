<script lang="ts">
  import type { Ingredient, Purchase } from '../../types';
  import PurchaseForm from './PurchaseForm.svelte';
  import IngredientModal from './IngredientModal.svelte';

  let { ingredients, purchases, onSavePurchase, onQuickAddIngredient } = $props<{
    ingredients: Ingredient[];
    purchases: Purchase[];
    onSavePurchase: (data: {
      ingredientId: number;
      quantity: number;
      unitPrice: number;
      paymentMethod: string;
      comments?: string;
    }) => Promise<void>;
    onQuickAddIngredient: (name: string, unit: string, category: string) => Promise<void>;
  }>();

  let showModal = $state(false);
</script>

<div class="grid-2">
  <PurchaseForm 
    {ingredients} 
    {onSavePurchase} 
    onQuickAdd={() => showModal = true} 
  />
</div>

<!-- Purchases History Table -->
<section class="glass-card" style="margin-top: 1.5rem;">
  <h3>Recent Purchases Ledger</h3>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Ingredient</th>
          <th>Quantity</th>
          <th>Unit Cost</th>
          <th>Total Cost</th>
          <th>Payment Type</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {#each purchases as purch}
          <tr>
            <td>{new Date(purch.dateTime).toLocaleString()}</td>
            <td><strong>{purch.ingredient?.name || 'Unknown'}</strong></td>
            <td>{purch.quantity} {purch.ingredient?.unit}</td>
            <td>${Number(purch.unitPrice).toFixed(2)}</td>
            <td><strong>${Number(purch.totalCost).toFixed(2)}</strong></td>
            <td><span class="badge badge-blue">{purch.paymentMethod}</span></td>
            <td style="color: var(--text-secondary);">{purch.comments || '—'}</td>
          </tr>
        {/each}
        {#if purchases.length === 0}
          <tr>
            <td colspan="7" style="text-align: center; color: var(--text-muted)">No purchase history recorded.</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</section>

<IngredientModal 
  show={showModal} 
  onSave={async (n, u, c) => {
    await onQuickAddIngredient(n, u, c);
    showModal = false;
  }}
  onClose={() => showModal = false}
/>
