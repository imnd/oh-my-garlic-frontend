<script lang="ts">
  import type { Ingredient } from '../../types';

  let { ingredients, onSaveWriteOff } = $props<{
    ingredients: Ingredient[];
    onSaveWriteOff: (data: { ingredientId: number; quantity: number; type: string; reason?: string }) => Promise<void>;
  }>();

  let ingredientId = $state('');
  let quantity = $state('');
  let type = $state('Spoilage');
  let reason = $state('');

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!ingredientId || !quantity) return;

    await onSaveWriteOff({
      ingredientId: parseInt(ingredientId),
      quantity: parseFloat(quantity),
      type,
      reason: reason || undefined
    });

    ingredientId = '';
    quantity = '';
    type = 'Spoilage';
    reason = '';
  }
</script>

<section class="glass-card">
  <h3>Log Manual Ingredient Write-off</h3>
  <form onsubmit={handleSubmit}>
    <div class="form-group">
      <label class="form-label" for="wo-ingredient">Select Ingredient *</label>
      <select id="wo-ingredient" class="form-select" bind:value={ingredientId} required>
        <option value="">-- Choose Ingredient --</option>
        {#each ingredients as ing}
          <option value={ing.id}>{ing.name} ({ing.unit}) [Stock: {ing.stock}]</option>
        {/each}
      </select>
    </div>
    <div class="grid-2" style="gap: 1rem; margin-bottom: 0;">
      <div class="form-group">
        <label class="form-label" for="wo-qty">Quantity *</label>
        <input id="wo-qty" type="number" step="0.0001" class="form-input" placeholder="e.g. 1.2" bind:value={quantity} required />
      </div>
      <div class="form-group">
        <label class="form-label" for="wo-type">Reason Category</label>
        <select id="wo-type" class="form-select" bind:value={type}>
          <option value="Spoilage">Spoilage/Damage</option>
          <option value="Tasting">Trial / tasting session</option>
          <option value="StaffMeals">Staff meals allocation</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label" for="wo-reason">Write-off Comments (Reason)</label>
      <input id="wo-reason" type="text" class="form-input" placeholder="e.g. Tomatoes spoiled, bad batch" bind:value={reason} />
    </div>
    <button type="submit" class="btn btn-danger" style="width: 100%;">Deduct Inventory</button>
  </form>
</section>
