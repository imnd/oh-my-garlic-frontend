<script lang="ts">
  import type { MenuItem } from '../../types';
  import PosCart from './PosCart.svelte';

  let { menuItems, onCheckout } = $props<{
    menuItems: MenuItem[];
    onCheckout: (paymentType: string, items: Array<{ menuItemId: number; quantity: number }>) => Promise<void>;
  }>();

  let cart = $state<Record<number, number>>({});

  function addToCart(item: MenuItem) {
    if (cart[item.id]) {
      cart[item.id] += 1;
    } else {
      cart[item.id] = 1;
    }
  }

  function handleQuantityChange(itemId: number, amount: number) {
    if (!cart[itemId]) return;
    cart[itemId] += amount;
    if (cart[itemId] <= 0) {
      delete cart[itemId];
    }
  }

  async function handleCheckout(paymentType: string) {
    const items = (Object.entries(cart) as Array<[string, number]>).map(([id, qty]) => ({
      menuItemId: parseInt(id),
      quantity: qty
    }));
    await onCheckout(paymentType, items);
    cart = {};
  }
</script>

<div class="pos-container">
  <!-- Menu Grid -->
  <div class="pos-menu">
    <div class="flex-between" style="margin-bottom: 1.5rem;">
      <h3>Kitchen Menu Selection</h3>
    </div>

    <div class="pos-menu-grid">
      {#each menuItems as item}
        <button class="pos-item-button glass-card" onclick={() => addToCart(item)}>
          <div class="pos-item-cat">{item.category}</div>
          <div class="pos-item-name">{item.name}</div>
          <div class="pos-item-price">${Number(item.price).toFixed(2)}</div>
        </button>
      {/each}
      {#if menuItems.length === 0}
        <p style="color: var(--text-muted);">Please create recipes/menu items in the Production tab first.</p>
      {/if}
    </div>
  </div>

  <!-- Billing Panel -->
  <PosCart 
    {cart} 
    {menuItems} 
    onQuantityChange={handleQuantityChange} 
    onCheckout={handleCheckout} 
  />
</div>

<style>
  .pos-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
  }
  .pos-menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
  .pos-item-button {
    text-align: left;
    cursor: pointer;
    border: 1px solid var(--border-color);
    padding: 1.25rem 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .pos-item-button:hover {
    border-color: var(--accent-secondary);
  }
  .pos-item-cat {
    font-size: 0.6875rem;
    text-transform: uppercase;
    color: var(--text-muted);
    font-weight: 700;
  }
  .pos-item-name {
    font-size: 1rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }
  .pos-item-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--accent-secondary);
  }

  @media (max-width: 768px) {
    .pos-container {
      grid-template-columns: 1fr;
    }
  }
</style>
