<script lang="ts">
  let { toast } = $props<{
    toast: { msg: string; type: string } | null;
  }>();
</script>

{#if toast}
  <div class="toast-notification {toast.type}">
    {toast.msg}
  </div>
{/if}

<style>
  .toast-notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    z-index: 2000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  }

  .toast-notification.success { background: var(--accent-success); }
  .toast-notification.danger { background: var(--accent-danger); }
  .toast-notification.warning { background: var(--accent-warning); }
</style>
