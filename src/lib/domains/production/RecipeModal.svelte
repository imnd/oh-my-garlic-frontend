<script lang="ts">
  import type { Ingredient, RecipeComponent } from '../../types';

  let { show, ingredients, onSave, onClose } = $props<{
    show: boolean;
    ingredients: Ingredient[];
    onSave: (data: {
      name: string;
      category: string;
      price: number;
      recipeComponents: Array<{ ingredientId: number; grossWeight: number; netWeight: number }>;
    }) => Promise<void>;
    onClose: () => void;
  }>();

  let name = $state('');
  let category = $state('Kitchen');
  let price = $state('');
  let recipeComponents = $state<RecipeComponent[]>([]);

  let currentIngredientId = $state('');
  let currentGrossWeight = $state('');
  let currentNetWeight = $state('');

  // Live Costing Calculator (derived)
  let calculatedRecipeCost = $derived(
    recipeComponents.reduce((sum: number, rc) => {
      const ing = ingredients.find((i: Ingredient) => i.id === rc.ingredientId);
      const avgPrice = ing ? parseFloat(ing.averagePrice as any) : 0;
      return sum + rc.grossWeight * avgPrice;
    }, 0)
  );

  function addComponent() {
    if (!currentIngredientId || !currentGrossWeight || !currentNetWeight) return;

    const ing = ingredients.find((i: Ingredient) => i.id === parseInt(currentIngredientId));
    if (!ing) return;

    const gross = parseFloat(currentGrossWeight);
    const net = parseFloat(currentNetWeight);
    const waste = gross > 0 ? ((gross - net) / gross) * 100 : 0;

    recipeComponents = [
      ...recipeComponents,
      {
        ingredientId: ing.id,
        name: ing.name,
        unit: ing.unit,
        grossWeight: gross,
        netWeight: net,
        wastePercentage: parseFloat(waste.toFixed(2)),
      },
    ];

    currentIngredientId = '';
    currentGrossWeight = '';
    currentNetWeight = '';
  }

  function removeComponent(index: number) {
    recipeComponents = recipeComponents.filter((_, i) => i !== index);
  }

  async function handleSave() {
    if (!name.trim() || !price || recipeComponents.length === 0) return;

    await onSave({
      name,
      category,
      price: parseFloat(price),
      recipeComponents: recipeComponents.map((rc) => ({
        ingredientId: rc.ingredientId,
        grossWeight: rc.grossWeight,
        netWeight: rc.netWeight,
      })),
    });

    name = '';
    category = 'Kitchen';
    price = '';
    recipeComponents = [];
  }
</script>

{#if show}
  <div class="modal-backdrop">
    <div class="modal-content glass-card large-modal">
      <h3>Build Recipe & Technical Card</h3>

      <div class="grid-2">
        <!-- Details Column -->
        <div>
          <div class="form-group">
            <label class="form-label" for="menu-name">Dish / Menu Item Name *</label>
            <input id="menu-name" type="text" class="form-input" placeholder="e.g. Tom Yum Soup" bind:value={name} required />
          </div>

          <div class="form-group">
            <label class="form-label" for="menu-cat">Category</label>
            <select id="menu-cat" class="form-select" bind:value={category}>
              <option value="Kitchen">Kitchen</option>
              <option value="Bar">Bar</option>
              <option value="Desserts">Desserts</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="menu-price">Retail Selling Price ($) *</label>
            <input id="menu-price" type="number" step="0.01" class="form-input" placeholder="e.g. 15.00" bind:value={price} required />
          </div>

          <!-- Component Inline Adder -->
          <div class="glass-card" style="margin-top: 1rem; padding: 1rem;">
            <h5>Add Recipe Component</h5>
            <div class="form-group">
              <label class="form-label" for="comp-ing">Select Ingredient</label>
              <select id="comp-ing" class="form-select" bind:value={currentIngredientId}>
                <option value="">-- Choose Ingredient --</option>
                {#each ingredients as ing}
                  <option value={ing.id}>{ing.name} ({ing.unit})</option>
                {/each}
              </select>
            </div>

            <div class="grid-2" style="gap: 0.75rem; margin-bottom: 0.75rem;">
              <div class="form-group">
                <label class="form-label" for="comp-gross">Gross Wt (Pre-processed)</label>
                <input id="comp-gross" type="number" step="0.0001" class="form-input" placeholder="e.g. 0.250" bind:value={currentGrossWeight} />
              </div>
              <div class="form-group">
                <label class="form-label" for="comp-net">Net Wt (Yield)</label>
                <input id="comp-net" type="number" step="0.0001" class="form-input" placeholder="e.g. 0.200" bind:value={currentNetWeight} />
              </div>
            </div>

            <button type="button" class="btn btn-secondary btn-sm" style="width: 100%;" onclick={addComponent}>
              ➕ Add Component to List
            </button>
          </div>
        </div>

        <!-- Recipe Components List / Preview Column -->
        <div style="display: flex; flex-direction: column;">
          <h5>Recipe Components Summary</h5>
          <div class="recipe-builder-components flex-grow" style="overflow-y: auto; max-height: 250px; border: 1px solid var(--border-color); border-radius: 8px; padding: 0.5rem; margin-bottom: 1rem;">
            {#each recipeComponents as rc, idx}
              <div class="component-pill flex-between">
                <div>
                  <strong>{rc.name}</strong> - Gross: {rc.grossWeight}{rc.unit} (Net: {rc.netWeight}{rc.unit}) - Waste: {rc.wastePercentage}%
                </div>
                <button class="btn-qty" onclick={() => removeComponent(idx)}>×</button>
              </div>
            {/each}
            {#if recipeComponents.length === 0}
              <p style="color: var(--text-muted); text-align: center; margin-top: 2rem;">No recipe components added yet.</p>
            {/if}
          </div>

          <!-- Pricing Calculations Summary -->
          <div class="live-costing-box">
            <div class="flex-between">
              <span>Weighted Avg Cost:</span>
              <strong>${calculatedRecipeCost.toFixed(2)}</strong>
            </div>
            {#if price}
              {@const marginVal = parseFloat(price) - calculatedRecipeCost}
              {@const marginPct = (marginVal / parseFloat(price)) * 100}
              <div class="flex-between" style="margin-top: 0.25rem;">
                <span>Estimated Gross Margin:</span>
                <strong class={marginVal < 0 ? 'text-danger' : 'text-success'}>
                  ${marginVal.toFixed(2)} ({marginPct.toFixed(1)}%)
                </strong>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div class="modal-actions" style="margin-top: 1.5rem;">
        <button class="btn btn-secondary" onclick={onClose}>Cancel</button>
        <button class="btn btn-primary" onclick={handleSave} disabled={recipeComponents.length === 0}>
          💾 Save Recipe & Menu Item
        </button>
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
  .large-modal {
    max-width: 800px;
  }
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
  }
  .recipe-builder-components {
    min-height: 150px;
  }
  .component-pill {
    background: rgba(255, 255, 255, 0.03);
    padding: 0.4rem 0.75rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    font-size: 0.8125rem;
    border: 1px solid var(--border-color);
  }
  .btn-qty {
    background: var(--bg-tertiary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    width: 24px;
    height: 24px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .live-costing-box {
    background: rgba(124, 58, 237, 0.08);
    border: 1px dashed rgba(124, 58, 237, 0.3);
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.875rem;
  }
</style>
