<script lang="ts">
  let { onSaveExpense } = $props<{
    onSaveExpense: (data: { name: string; cost: number }) => Promise<void>;
  }>();

  let name = $state('');
  let cost = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!name.trim() || !cost) return;

    await onSaveExpense({
      name,
      cost: parseFloat(cost)
    });

    name = '';
    cost = '';
  }
</script>

<section class="glass-card">
  <h3>Log Direct Consumable Expense</h3>
  <form onsubmit={handleSubmit}>
    <div class="form-group">
      <label class="form-label" for="exp-name">Consumable Batch / Expense Name *</label>
      <input id="exp-name" type="text" class="form-input" placeholder="e.g. Cooking Gas, Foil containers" bind:value={name} required />
    </div>
    <div class="form-group">
      <label class="form-label" for="exp-cost">Total Cost *</label>
      <input id="exp-cost" type="number" step="0.01" class="form-input" placeholder="e.g. 45.00" bind:value={cost} required />
    </div>
    <button type="submit" class="btn btn-secondary" style="width: 100%;">Record Expense</button>
  </form>
</section>
