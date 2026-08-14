<script lang="ts">
  let { activeTab, onTabChange } = $props<{
    activeTab: string;
    onTabChange: (tab: string) => void;
  }>();
</script>

<header class="main-header">
  <div class="header-content flex-between">
    <div class="logo">
      <span class="logo-emoji">🧄</span>
      <div class="logo-text">
        <h1>Oh My Garlic!</h1>
        <p>Simple Restaurant ERP & Costing</p>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="nav-tabs">
      <button
        class="nav-btn {activeTab === 'purchases' ? 'active' : ''}"
        onclick={() => onTabChange("purchases")}
      >
        📦 Purchases
      </button>
      <button
        class="nav-btn {activeTab === 'ingredients' ? 'active' : ''}"
        onclick={() => onTabChange("ingredients")}
      >
        🍎 Products
      </button>
      <button
        class="nav-btn {activeTab === 'production' ? 'active' : ''}"
        onclick={() => onTabChange("production")}
      >
        🍳 Technical Cards & Expenses
      </button>
      <button
        class="nav-btn {activeTab === 'pos' ? 'active' : ''}"
        onclick={() => onTabChange("pos")}
      >
        📟 POS Terminal
      </button>
      <button
        class="nav-btn {activeTab === 'reports' ? 'active' : ''}"
        onclick={() => onTabChange("reports")}
      >
        📊 Reports & P&L
      </button>
    </nav>
  </div>
</header>

<style>
  .main-header {
    background: var(--bg-tertiary);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem 2rem;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .logo-emoji {
    font-size: 2.25rem;
  }

  .logo-text h1 {
    font-size: 1.25rem;
    margin: 0;
    background: linear-gradient(135deg, #4100ff 0%, #ec4899 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo-text p {
    font-size: 0.75rem;
    margin: 0;
    color: var(--text-secondary);
  }

  .nav-tabs {
    display: flex;
    gap: 0.5rem;
  }

  .nav-btn {
    background: var(--bg-primary);
    border: 1px solid transparent;
    color: var(--text-secondary);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-btn:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.2);
  }

  .nav-btn.active {
    color: #000;
    background: var(--bg-secondary);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
  }

  @media (max-width: 768px) {
    .main-header {
      padding: 0.75rem 1rem;
      position: relative;
      top: auto;
    }

    .header-content {
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }

    .logo {
      justify-content: center;
    }

    .logo-text p {
      display: none;
    }

    .nav-tabs {
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none; /* Hide scrollbar for Firefox */
      -webkit-overflow-scrolling: touch;
      justify-content: flex-start;
    }

    .nav-tabs::-webkit-scrollbar {
      display: none; /* Hide scrollbar for Chrome/Safari */
    }

    .nav-btn {
      flex-shrink: 0;
    }
  }
</style>
