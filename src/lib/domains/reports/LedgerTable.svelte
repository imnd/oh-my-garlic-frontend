<script lang="ts">
  import type { LedgerRow } from '../../types';

  let { ledger } = $props<{
    ledger: LedgerRow[];
  }>();
</script>

<section class="glass-card">
  <h3>Inventory Movement Ledger</h3>
  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Ingredient</th>
          <th>Starting Bal</th>
          <th>Intake (+)</th>
          <th>Outflow (-)</th>
          <th>Ending Bal</th>
          <th>Current Val</th>
        </tr>
      </thead>
      <tbody>
        {#each ledger as row}
          <tr>
            <td><strong>{row.name}</strong> <span style="font-size: 0.75rem; color: var(--text-muted)">({row.unit})</span></td>
            <td>{row.startingBalance}</td>
            <td class="text-success">+{row.intake}</td>
            <td class="text-danger">-{row.outflow}</td>
            <td><strong>{row.endingBalance}</strong></td>
            <td>₹{(row.endingBalance * row.averagePrice).toFixed(2)}</td>
          </tr>
        {/each}
        {#if ledger.length === 0}
          <tr>
            <td colspan="6" style="text-align: center; color: var(--text-muted)">No ledger data available.</td>
          </tr>
        {/if}
      </tbody>
    </table>
  </div>
</section>
