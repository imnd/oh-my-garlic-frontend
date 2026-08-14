<script lang="ts">
  import type { MenuItem } from '../../types';

  let { menuItems, onCreateClick } = $props<{
    menuItems: MenuItem[];
    onCreateClick: () => void;
  }>();
</script>

<section class="glass-card">
  <div class="flex-between" style="margin-bottom: 1rem;">
    <h3>Technical Cards (Recipes)</h3>
    <button class="btn btn-primary btn-sm" onclick={onCreateClick}>➕ Create Recipe Card</button>
  </div>

  <div class="recipes-list">
    {#each menuItems as item}
      <div class="recipe-card-sub glass-card">
        <div class="flex-between">
          <h4>{item.name}</h4>
          <div>
            <span class="badge badge-violet">{item.category}</span>
            <span class="badge badge-emerald" style="margin-left: 0.5rem; font-size: 0.875rem;">Retail Price: ₹{Number(item.price).toFixed(2)}</span>
          </div>
        </div>

        <div class="recipe-details" style="margin-top: 0.75rem;">
          <table class="compact-table">
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Gross Wt</th>
                <th>Net Yield</th>
                <th>Waste %</th>
              </tr>
            </thead>
            <tbody>
              {#each item.recipeComponents as rc}
                <tr>
                  <td>{rc.ingredient?.name}</td>
                  <td>{rc.grossWeight} {rc.ingredient?.unit}</td>
                  <td>{rc.netWeight} {rc.ingredient?.unit}</td>
                  <td style="color: var(--text-secondary);">{rc.wastePercentage}%</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/each}
    {#if menuItems.length === 0}
      <p style="text-align: center; color: var(--text-muted);">No technical card recipes constructed yet.</p>
    {/if}
  </div>
</section>

<style>
  .recipe-card-sub {
    margin-bottom: 1rem;
    padding: 1rem;
  }
  .recipes-list {
    max-height: 550px;
    overflow-y: auto;
    padding-right: 0.25rem;
  }
  .compact-table {
    font-size: 0.75rem;
  }
  .compact-table th, .compact-table td {
    padding: 0.4rem 0.6rem;
  }
</style>
