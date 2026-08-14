<script lang="ts">
  import type { ProfitLossReport } from '../../types';

  let { profitLoss } = $props<{
    profitLoss: ProfitLossReport | null;
  }>();
</script>

{#if profitLoss}
  <div class="grid-3" style="margin-bottom: 2rem;">
    <div class="glass-card pl-card shadow-emerald">
      <div class="pl-label">Gross Revenue</div>
      <div class="pl-value text-success">${profitLoss.grossSalesRevenue}</div>
    </div>
    <div class="glass-card pl-card shadow-violet">
      <div class="pl-label">Cost of Goods Sold (COGS)</div>
      <div class="pl-value">${profitLoss.cogs}</div>
    </div>
    <div class="glass-card pl-card shadow-violet">
      <div class="pl-label">Gross Profit</div>
      <div class="pl-value text-emerald">${profitLoss.grossProfit}</div>
    </div>
    <div class="glass-card pl-card shadow-danger">
      <div class="pl-label">Operational Losses (Waste / Trials)</div>
      <div class="pl-value text-danger">${profitLoss.operationalLoss}</div>
    </div>
    <div class="glass-card pl-card shadow-violet">
      <div class="pl-label">Consumable Direct Expenses</div>
      <div class="pl-value">${profitLoss.directExpenses}</div>
    </div>
    <div class="glass-card pl-card shadow-success">
      <div class="pl-label">Net Profit / Loss</div>
      <div class="pl-value {profitLoss.netProfit < 0 ? 'text-danger' : 'text-success'}">${profitLoss.netProfit}</div>
    </div>
  </div>
{/if}

<style>
  .pl-card {
    padding: 1.25rem;
  }
  .pl-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-secondary);
    margin-bottom: 0.25rem;
  }
  .pl-value {
    font-size: 1.75rem;
    font-weight: 800;
  }
</style>
