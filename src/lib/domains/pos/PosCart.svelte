<script lang="ts">
  import type { MenuItem } from '../../types';

  let { cart, menuItems, onQuantityChange, onCheckout } = $props<{
    cart: Record<number, number>;
    menuItems: MenuItem[];
    onQuantityChange: (itemId: number, amount: number) => void;
    onCheckout: (paymentType: string) => Promise<void>;
  }>();

  let paymentType = $state('Cash');

  let orderTotal = $derived(
    (Object.entries(cart) as Array<[string, number]>).reduce((sum: number, [id, qty]) => {
      const mItem = menuItems.find((mi: MenuItem) => mi.id === parseInt(id));
      return sum + (mItem ? Number(mItem.price) * qty : 0);
    }, 0)
  );

  async function handleCheckout() {
    await onCheckout(paymentType);
  }
</script>

<div class="pos-cart-panel glass-card">
  <h3>Active Bill</h3>
  <div class="cart-items">
    {#each (Object.entries(cart) as Array<[string, number]>) as [itemId, qty]}
      {@const mItem = menuItems.find((mi: MenuItem) => mi.id === parseInt(itemId))}
      {#if mItem}
        <div class="cart-item flex-between">
          <div>
            <div class="cart-item-name">{mItem.name}</div>
            <div class="cart-item-price">${Number(mItem.price).toFixed(2)} each</div>
          </div>
          <div class="cart-qty-ctrl">
            <button class="btn-qty" onclick={() => onQuantityChange(mItem.id, -1)}>-</button>
            <span class="cart-qty-num">{qty}</span>
            <button class="btn-qty" onclick={() => onQuantityChange(mItem.id, 1)}>+</button>
          </div>
        </div>
      {/if}
    {/each}
    {#if Object.keys(cart).length === 0}
      <div class="empty-cart-msg">Ticket is empty. Add menu items to process sale.</div>
    {/if}
  </div>

  <div class="cart-summary">
    <div class="flex-between">
      <span>Total Bill:</span>
      <strong class="total-text">${orderTotal.toFixed(2)}</strong>
    </div>

    <div class="form-group" style="margin-top: 1rem;">
      <label class="form-label" for="pos-pay">Payment Method</label>
      <select id="pos-pay" class="form-select" bind:value={paymentType}>
        <option value="Cash">Cash payment</option>
        <option value="Terminal">POS Card terminal</option>
        <option value="QR Code">QR Code transfer</option>
      </select>
    </div>

    <button class="btn btn-success" style="width: 100%; font-size: 1rem; padding: 0.75rem;" onclick={handleCheckout} disabled={orderTotal === 0}>
      💸 Checkout & Paid
    </button>
  </div>
</div>

<style>
  .pos-cart-panel {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 200px);
    position: sticky;
    top: 90px;
  }

  @media (max-width: 768px) {
    .pos-cart-panel {
      height: auto;
      position: relative;
      top: auto;
    }
  }
  .cart-items {
    flex-grow: 1;
    overflow-y: auto;
    margin: 1rem 0;
    padding-right: 0.25rem;
  }
  .cart-item {
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem 0;
  }
  .cart-item-name {
    font-weight: 600;
    font-size: 0.875rem;
  }
  .cart-item-price {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }
  .cart-qty-ctrl {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
  .cart-qty-num {
    font-size: 0.875rem;
    font-weight: 600;
  }
  .empty-cart-msg {
    color: var(--text-muted);
    text-align: center;
    margin-top: 3rem;
  }
  .cart-summary {
    border-top: 1px solid var(--border-color);
    padding-top: 1rem;
  }
  .total-text {
    font-size: 1.5rem;
    color: var(--accent-success);
  }
</style>
