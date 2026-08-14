<script lang="ts">
  let { show, onSave, onClose } = $props<{
    show: boolean;
    onSave: (name: string, unit: string, category: string) => Promise<void>;
    onClose: () => void;
  }>();

  let name = $state('');
  let unit = $state('kg');
  let category = $state('Vegetables');

  async function handleSave() {
    if (!name.trim()) return;
    await onSave(name, unit, category);
    name = '';
    unit = 'kg';
    category = 'Vegetables';
  }
</script>

{#if show}
  <div class="modal-backdrop">
    <div class="modal-content glass-card">
      <h3>Quick Add Ingredient</h3>
      <div class="form-group">
        <label class="form-label" for="ing-name">Ingredient Name</label>
        <input id="ing-name" type="text" class="form-input" placeholder="e.g. Pink Tomatoes" bind:value={name} />
      </div>
      <div class="form-group">
        <label class="form-label" for="ing-unit">Unit of Measurement</label>
        <select id="ing-unit" class="form-select" bind:value={unit}>
          <option value="kg">kg (Kilogram)</option>
          <option value="L">L (Liter)</option>
          <option value="pcs">pcs (Pieces)</option>
          <option value="pack">pack (Package)</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="ing-cat">Category</label>
        <select id="ing-cat" class="form-select" bind:value={category}>
          <option value="Vegetables">Vegetables</option>
          <option value="Meat">Meat & Poultry</option>
          <option value="Dry Goods">Dry Goods & Spices</option>
          <option value="Dairy">Dairy</option>
          <option value="Consumables">Consumables</option>
        </select>
      </div>
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick={onClose}>Cancel</button>
        <button class="btn btn-primary" onclick={handleSave}>Save Ingredient</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .modal-content {
    width: 90%;
    max-width: 500px;
    border-radius: 16px;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
</style>
