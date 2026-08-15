<script lang="ts">
  import type { ProfitLossReport, LedgerRow, ProcurementAnalyticsRow } from '../../types';
  import ProfitLossCards from './ProfitLossCards.svelte';
  import LedgerTable from './LedgerTable.svelte';
  import ProcurementCharts from './ProcurementCharts.svelte';

  let { profitLoss, ledger, analyticsData } = $props<{
    profitLoss: ProfitLossReport | null;
    ledger: LedgerRow[];
    analyticsData: ProcurementAnalyticsRow[];
  }>();
</script>

<ProfitLossCards {profitLoss} />

<div class="grid-2">
  <LedgerTable {ledger} />

  <!-- Menu Items Profitability / Margin Analysis -->
  <section class="glass-card">
    <h3>Dish Margin & Pricing Profitability</h3>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Dish Name</th>
            <th>Category</th>
            <th>Retail Price (₹)</th>
            <th>Ingredient Cost (₹)</th>
            <th>Margin (₹)</th>
            <th>Margin (%)</th>
          </tr>
        </thead>
        <tbody>
          {#if profitLoss && profitLoss.itemMargins}
            {#each profitLoss.itemMargins as item}
              <tr>
                <td><strong>{item.name}</strong></td>
                <td><span class="badge badge-violet">{item.category}</span></td>
                <td>{Number(item.price).toFixed(2)}</td>
                <td>{Number(item.cost).toFixed(2)}</td>
                <td class="text-success">{Number(item.margin).toFixed(2)}</td>
                <td>
                  <span class="badge {item.marginPercent > 60 ? 'badge-emerald' : item.marginPercent > 40 ? 'badge-violet' : 'badge-danger'}">
                    {item.marginPercent}%
                  </span>
                </td>
              </tr>
            {/each}
          {:else}
            <tr>
              <td colspan="6" style="text-align: center; color: var(--text-muted)">No menu analysis data loaded.</td>
            </tr>
          {/if}
        </tbody>
      </table>
    </div>
  </section>
</div>

<ProcurementCharts {analyticsData} />
