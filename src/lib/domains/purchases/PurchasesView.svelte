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
  let selectedIds = $state<Set<number>>(new Set());

  function toggleSelect(id: number) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    selectedIds = next;
  }

  function toggleSelectAll() {
    if (selectedIds.size === purchases.length) {
      selectedIds = new Set();
    } else {
      selectedIds = new Set(purchases.map((p) => p.id));
    }
  }

  const selectedTotal = $derived(
    purchases
      .filter((p) => selectedIds.has(p.id))
      .reduce((sum, p) => sum + Number(p.totalCost), 0)
  );

  const selectedCount = $derived(selectedIds.size);
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
  <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem;">
    <h3 style="margin: 0;">Recent Purchases Ledger</h3>
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      {#if selectedCount > 0}
        <span class="badge badge-blue">Selected: {selectedCount}</span>
        <span class="badge badge-green">Sum: ₹{selectedTotal.toFixed(2)}</span>
      {/if}
    </div>
  </div>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th style="width: 40px;">
            <input 
              type="checkbox" 
              checked={selectedIds.size === purchases.length && purchases.length > 0}
              onchange={toggleSelectAll}
              aria-label="Select all purchases"
            />
          </th>
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
          <tr class:row-selected={selectedIds.has(purch.id)}>
            <td>
              <input 
                type="checkbox" 
                checked={selectedIds.has(purch.id)}
                onchange={() => toggleSelect(purch.id)}
                aria-label={`Select purchase ${purch.id}`}
              />
            </td>
            <td>{new Date(purch.dateTime).toLocaleDateString()}</td>
            <td><strong>{purch.ingredient?.name || 'Unknown'}</strong></td>
            <td>{purch.quantity} {purch.ingredient?.unit}</td>
            <td>₹{Number(purch.unitPrice).toFixed(2)}</td>
            <td><strong>₹{Number(purch.totalCost).toFixed(2)}</strong></td>
            <td><span class="badge badge-blue">{purch.paymentMethod}</span></td>
            <td style="color: var(--text-secondary);">{purch.comments || '—'}</td>
          </tr>
        {/each}
        {#if purchases.length === 0}
          <tr>
            <td colspan="8" style="text-align: center; color: var(--text-muted)">No purchase history recorded.</td>
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

<style>
  .row-selected {
    background-color: rgba(76, 175, 80, 0.08);
  }
  .badge-green {
    background: rgba(76, 175, 80, 0.15);
    color: #4caf50;
  }
</style>