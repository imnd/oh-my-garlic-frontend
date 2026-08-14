<script lang="ts">
  import type { Ingredient } from '../../types';

  let { ingredients, onSaveIngredient, onUpdateIngredient, onDeleteIngredient } = $props<{
    ingredients: Ingredient[];
    onSaveIngredient: (name: string, unit: string, category: string, stock: number, averagePrice: number) => Promise<void>;
    onUpdateIngredient: (id: number, data: Partial<Ingredient>) => Promise<void>;
    onDeleteIngredient: (id: number) => Promise<void>;
  }>();

  // New Ingredient state
  let name = $state('');
  let unit = $state('kg');
  let category = $state('Vegetables');
  let stock = $state(0);
  let averagePrice = $state(0);

  // Filter & search state
  let searchQuery = $state('');
  let filterCategory = $state('');

  // Editing state
  let editingId = $state<number | null>(null);
  let editName = $state('');
  let editUnit = $state('kg');
  let editCategory = $state('Vegetables');
  let editStock = $state(0);
  let editAveragePrice = $state(0);

  // Derived filtered list (Svelte 5 derived state style)
  let filteredIngredients = $derived(
    ingredients.filter(ing => {
      const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === '' || ing.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
  );

  async function handleAdd(e: SubmitEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await onSaveIngredient(name, unit, category, stock, averagePrice);
    // Reset Form
    name = '';
    unit = 'kg';
    category = 'Vegetables';
    stock = 0;
    averagePrice = 0;
  }

  function startEdit(ing: Ingredient) {
    editingId = ing.id;
    editName = ing.name;
    editUnit = ing.unit;
    editCategory = ing.category;
    editStock = ing.stock;
    editAveragePrice = ing.averagePrice;
  }

  function cancelEdit() {
    editingId = null;
  }

  async function handleUpdate() {
    if (editingId === null || !editName.trim()) return;
    await onUpdateIngredient(editingId, {
      name: editName,
      unit: editUnit,
      category: editCategory,
      stock: editStock,
      averagePrice: editAveragePrice
    });
    editingId = null;
  }

  async function handleDelete(id: number, ingName: string) {
    if (confirm(`Are you sure you want to delete "${ingName}"? Warning: deleting products may cause errors if they are referenced by purchases or recipe cards!`)) {
      await onDeleteIngredient(id);
    }
  }
</script>

<div class="grid-2">
  <!-- Create/Edit Form Panel -->
  <section class="glass-card">
    {#if editingId === null}
      <h3>Register New Product / Ingredient</h3>
      <form onsubmit={handleAdd}>
        <div class="form-group">
          <label class="form-label" for="new-name">Product Name *</label>
          <input
            id="new-name"
            type="text"
            placeholder="e.g. Pink Tomatoes"
            class="form-input"
            bind:value={name}
            required
          />
        </div>

        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="new-unit">Unit *</label>
            <select id="new-unit" class="form-select" bind:value={unit}>
              <option value="kg">kg (Kilogram)</option>
              <option value="L">L (Liter)</option>
              <option value="pcs">pcs (Pieces)</option>
              <option value="pack">pack (Package)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="new-category">Category *</label>
            <select id="new-category" class="form-select" bind:value={category}>
              <option value="Vegetables">Vegetables</option>
              <option value="Meat">Meat & Poultry</option>
              <option value="Dry Goods">Dry Goods & Spices</option>
              <option value="Dairy">Dairy</option>
              <option value="Consumables">Consumables</option>
            </select>
          </div>
        </div>

        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
          <div class="form-group">
            <label class="form-label" for="new-stock">Initial Stock</label>
            <input
              id="new-stock"
              type="number"
              step="0.0001"
              min="0"
              class="form-input"
              bind:value={stock}
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="new-price">Average Price ($)</label>
            <input
              id="new-price"
              type="number"
              step="0.01"
              min="0"
              class="form-input"
              bind:value={averagePrice}
            />
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;">
          ➕ Add Product
        </button>
      </form>
    {:else}
      <h3>Edit Product / Ingredient</h3>
      <div>
        <div class="form-group">
          <label class="form-label" for="edit-name">Product Name *</label>
          <input
            id="edit-name"
            type="text"
            class="form-input"
            bind:value={editName}
            required
          />
        </div>

        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="edit-unit">Unit *</label>
            <select id="edit-unit" class="form-select" bind:value={editUnit}>
              <option value="kg">kg (Kilogram)</option>
              <option value="L">L (Liter)</option>
              <option value="pcs">pcs (Pieces)</option>
              <option value="pack">pack (Package)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-category">Category *</label>
            <select id="edit-category" class="form-select" bind:value={editCategory}>
              <option value="Vegetables">Vegetables</option>
              <option value="Meat">Meat & Poultry</option>
              <option value="Dry Goods">Dry Goods & Spices</option>
              <option value="Dairy">Dairy</option>
              <option value="Consumables">Consumables</option>
            </select>
          </div>
        </div>

        <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
          <div class="form-group">
            <label class="form-label" for="edit-stock">Stock Level</label>
            <input
              id="edit-stock"
              type="number"
              step="0.0001"
              min="0"
              class="form-input"
              bind:value={editStock}
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="edit-price">Average Price ($)</label>
            <input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              class="form-input"
              bind:value={editAveragePrice}
            />
          </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
          <button class="btn btn-secondary" onclick={cancelEdit} style="flex: 1;">
            Cancel
          </button>
          <button class="btn btn-primary" onclick={handleUpdate} style="flex: 2;">
            💾 Save Changes
          </button>
        </div>
      </div>
    {/if}
  </section>

  <!-- Nomenclature & Stock Inventory Directory -->
  <section class="glass-card flex-col">
    <div class="flex-between" style="flex-wrap: wrap; gap: 1rem; margin-bottom: 0.5rem;">
      <h3 style="margin: 0;">Product Nomenclature</h3>
      <div style="display: flex; gap: 0.5rem; flex-grow: 1; justify-content: flex-end; max-width: 500px;">
        <input
          type="text"
          placeholder="Search products..."
          class="form-input"
          style="padding: 0.4rem 0.8rem; font-size: 0.875rem;"
          bind:value={searchQuery}
        />
        <select
          class="form-select"
          style="padding: 0.4rem 1.8rem 0.4rem 0.8rem; font-size: 0.875rem; width: auto;"
          bind:value={filterCategory}
        >
          <option value="">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Meat">Meat</option>
          <option value="Dry Goods">Dry Goods</option>
          <option value="Dairy">Dairy</option>
          <option value="Consumables">Consumables</option>
        </select>
      </div>
    </div>

    <div class="table-container" style="max-height: 520px;">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Stock Level</th>
            <th>Avg Price</th>
            <th style="width: 150px; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredIngredients as ing}
            <tr>
              <td><strong>{ing.name}</strong></td>
              <td>
                <span class="badge {ing.category === 'Vegetables' ? 'badge-emerald' : ing.category === 'Meat' ? 'badge-danger' : ing.category === 'Dairy' ? 'badge-blue' : 'badge-orange'}">
                  {ing.category}
                </span>
              </td>
              <td>
                <span class={ing.stock < 0 ? 'text-danger' : ing.stock === 0 ? 'text-warning' : 'text-success'}>
                  {ing.stock} {ing.unit}
                </span>
              </td>
              <td>${Number(ing.averagePrice).toFixed(2)}</td>
              <td style="text-align: right;">
                <div style="display: inline-flex; gap: 0.4rem;">
                  <button 
                    class="btn btn-secondary btn-sm" 
                    onclick={() => startEdit(ing)}
                    style="padding: 0.25rem 0.5rem; font-size: 0.75rem;"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    class="btn btn-danger btn-sm" 
                    onclick={() => handleDelete(ing.id, ing.name)}
                    style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: var(--accent-danger); color: #fff;"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </td>
            </tr>
          {/each}
          {#if filteredIngredients.length === 0}
            <tr>
              <td colspan="5" style="text-align: center; color: var(--text-muted)">
                No products found matching filters.
              </td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </section>
</div>
