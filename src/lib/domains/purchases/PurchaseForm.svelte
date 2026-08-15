<script lang="ts">
  import type { Ingredient } from '../../types';

  let { ingredients, onSavePurchase, onQuickAdd } = $props<{
    ingredients: Ingredient[];
    onSavePurchase: (data: {
      ingredientId: number;
      quantity: number;
      unitPrice: number;
      paymentMethod: string;
      comments?: string;
    }) => Promise<void>;
    onQuickAdd: () => void;
  }>();

  let ingredientId = $state('');
  let quantity = $state('');
  let totalCost = $state('');
  let unitPrice = $state('');
  let paymentMethod = $state('Cash from register');
  let comments = $state('');
  let autoCalcUnitPrice = $state(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!ingredientId || !quantity) return;

    const qty = parseFloat(quantity);
    let finalUnitPrice = 0;

    if (autoCalcUnitPrice) {
      finalUnitPrice = Math.round(parseFloat(totalCost) / qty);
    } else {
      finalUnitPrice = Math.round(parseFloat(unitPrice));
    }

    await onSavePurchase({
      ingredientId: parseInt(ingredientId),
      quantity: qty,
      unitPrice: finalUnitPrice,
      paymentMethod,
      comments: comments || undefined
    });

    ingredientId = '';
    quantity = '';
    totalCost = '';
    unitPrice = '';
    comments = '';
  }
</script>

<section class="glass-card">
  <h3>Log New Market Purchase</h3>
  <form onsubmit={handleSubmit} class="glass-form">
    <div class="column">
      <div class="form-group flex-between" style="gap: 1rem; align-items: flex-end;">
        <div style="flex: 1;">
          <label class="form-label" for="purch-ingredient">Select Ingredient *</label>
          <select id="purch-ingredient" class="form-select" bind:value={ingredientId} required>
            <option value="">-- Choose Ingredient --</option>
            {#each ingredients as ing}
              <option value={ing.id}>{ing.name} ({ing.unit}) [Stock: {Number(ing.stock).toFixed(2)}]</option>
            {/each}
          </select>
        </div>
        <button type="button" class="btn btn-primary" style="height: 38px;" onclick={onQuickAdd}>
          Quick-Add
        </button>
      </div>
      <div class="form-group">
        <label class="form-label" for="purch-qty">Quantity *</label>
        <input id="purch-qty" type="number" step="0.01" class="form-input" placeholder="e.g. 5.5" bind:value={quantity} required />
      </div>
      <div class="form-group">
        <label class="form-label" style="display: flex; justify-content: space-between; align-items: center;">
          <span>Pricing Method</span>
          <label style="font-size: 0.75rem; font-weight: normal; cursor: pointer; text-transform: none;">
            <input type="checkbox" bind:checked={autoCalcUnitPrice} /> Auto-calculate unit price
          </label>
        </label>

        {#if autoCalcUnitPrice}
          <input type="number" step="1" class="form-input" placeholder="Enter total cost of item batch" bind:value={totalCost} required />
        {:else}
          <input type="number" step="1" class="form-input" placeholder="Enter unit price" bind:value={unitPrice} required />
        {/if}
      </div>
    </div>
    <div class="column">
      <div class="form-group">
        <label class="form-label" for="purch-payment">Payment Method</label>
        <select id="purch-payment" class="form-select" bind:value={paymentMethod}>
          <option value="Cash from register">Cash from register</option>
          <option value="Card transfer">Card transfer</option>
          <option value="Out-of-pocket advance">Out-of-pocket advance</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="purch-comments">Comments / Location</label>
        <input id="purch-comments" type="text" class="form-input" placeholder="e.g. Stall #14, Green Market" bind:value={comments} />
      </div>

      <button type="submit" class="btn btn-primary" style="width: 100%;">Save Intake Purchase</button>
    </div>
  </form>
</section>

<style>
  form {
    display: flex;
    gap: 2rem;
    flex-direction: row;

    @media (max-width: 600px) {
      flex-direction: column;
    }
  }
  .column {
    width: 100%;
  }
</style>
