<script lang="ts">
  import type { ProcurementAnalyticsRow } from '../../types';

  let { analyticsData } = $props<{
    analyticsData: ProcurementAnalyticsRow[];
  }>();
</script>

<section class="glass-card" style="margin-top: 1.5rem;">
  <h3>Procurement Analytics: Ingredient Cost Fluctuations Over Time</h3>
  {#if analyticsData.length > 0}
    <div class="analytics-charts-grid">
      {#each analyticsData as ing}
        {#if ing.history.length > 1}
          {@const prices = ing.history.map((h: { unitPrice: number }) => h.unitPrice)}
          {@const maxPrice = Math.max(...prices) * 1.15}
          {@const minPrice = Math.min(...prices) * 0.85}
          {@const width = 400}
          {@const height = 150}
          {@const points = ing.history.map((h: { unitPrice: number; dateTime: string }, i: number) => {
            const x = 40 + (i / (ing.history.length - 1)) * (width - 50);
            const y = height - 25 - ((h.unitPrice - minPrice) / (maxPrice - minPrice)) * (height - 35);
            return { x, y, price: h.unitPrice, date: new Date(h.dateTime).toLocaleDateString() };
          })}
          {@const pathD = points.map((p: { x: number; y: number }, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
          <div class="chart-wrapper glass-card">
            <h4>{ing.name} ({ing.unit})</h4>
            
            <svg viewBox="0 0 {width} {height}" class="analytics-svg">
              <!-- Grid Lines -->
              <line x1="40" y1="10" x2={width - 10} y2="10" stroke="rgba(255,255,255,0.05)" />
              <line x1="40" y1={height / 2} x2={width - 10} y2={height / 2} stroke="rgba(255,255,255,0.05)" />
              <line x1="40" y1={height - 25} x2={width - 10} y2={height - 25} stroke="rgba(255,255,255,0.1)" />
              
              <!-- Y Axis Labels -->
              <text x="5" y="15" fill="var(--text-muted)" font-size="9">₹{maxPrice.toFixed(1)}</text>
              <text x="5" y={height / 2 + 3} fill="var(--text-muted)" font-size="9">₹{((maxPrice + minPrice) / 2).toFixed(1)}</text>
              <text x="5" y={height - 21} fill="var(--text-muted)" font-size="9">₹{minPrice.toFixed(1)}</text>

              <!-- Plot path -->
              <path d={pathD} fill="none" stroke="var(--accent-secondary)" stroke-width="2" />
              
              <!-- Dots & tooltips -->
              {#each points as pt}
                <circle cx={pt.x} cy={pt.y} r="4" fill="var(--accent-primary)">
                  <title>{pt.date}: ₹{pt.price.toFixed(2)}</title>
                </circle>
              {/each}
            </svg>
          </div>
        {/if}
      {/each}
    </div>
  {:else}
    <p style="text-align: center; color: var(--text-muted);">Not enough purchase data points to construct cost charts.</p>
  {/if}
</section>

<style>
  .analytics-charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
  }
  .chart-wrapper {
    padding: 1rem;
  }
  .analytics-svg {
    width: 100%;
    height: auto;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 10px;
  }
</style>
