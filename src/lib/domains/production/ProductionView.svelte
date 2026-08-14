<script lang="ts">
  import type { Ingredient, MenuItem } from '../../types';
  import TechnicalCards from './TechnicalCards.svelte';
  import ExpenseForm from './ExpenseForm.svelte';
  import WriteOffForm from './WriteOffForm.svelte';
  import RecipeModal from './RecipeModal.svelte';

  let { ingredients, menuItems, onSaveRecipe, onSaveExpense, onSaveWriteOff } = $props<{
    ingredients: Ingredient[];
    menuItems: MenuItem[];
    onSaveRecipe: (data: {
      name: string;
      category: string;
      price: number;
      recipeComponents: Array<{ ingredientId: number; grossWeight: number; netWeight: number }>;
    }) => Promise<void>;
    onSaveExpense: (data: { name: string; cost: number }) => Promise<void>;
    onSaveWriteOff: (data: { ingredientId: number; quantity: number; type: string; reason?: string }) => Promise<void>;
  }>();

  let showModal = $state(false);
</script>

<div class="grid-2">
  <TechnicalCards {menuItems} onCreateClick={() => showModal = true} />
  
  <div style="display: flex; flex-direction: column; gap: 1.5rem;">
    <ExpenseForm {onSaveExpense} />
    <WriteOffForm {ingredients} {onSaveWriteOff} />
  </div>
</div>

<RecipeModal 
  show={showModal} 
  {ingredients} 
  onSave={async (data) => {
    await onSaveRecipe(data);
    showModal = false;
  }}
  onClose={() => showModal = false}
/>
