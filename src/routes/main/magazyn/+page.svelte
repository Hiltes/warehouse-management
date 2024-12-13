<script lang="ts">
   import { onMount } from 'svelte';
   import { goto } from '$app/navigation';

   interface Item {
      _id: string;
      warehouse_id: string;
      item_name: string;
      quantity: number;
      arrival_date: string; 
      added_by: string;
   }

   let items: Item[] = []; 
   let error = '';

   onMount(async () => {
       try {
           const res = await fetch('/main/magazyn', {
               headers: { 'Content-Type': 'application/json' },
               credentials: 'include',
           });

           if (res.ok) {
               items = await res.json();
           } else if (res.status === 401) {
               error = 'Unauthorized. Redirecting to login page.';
               setTimeout(() => goto('/api/auth'), 3000);
           } else {
               error = 'Failed to fetch items.';
           }
       } catch (err) {
           console.error(err);
           error = 'Error fetching items.';
       }
   });


   async function fetchItems() {
        try {
            const res = await fetch('/main/magazyn', {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (res.ok) {
                items = await res.json(); 
            } else if (res.status === 401) {
                error = 'Unauthorized. Redirecting to login page.';
                setTimeout(() => goto('/api/auth'), 3000);
            } else {
                error = 'Failed to fetch items.';
            }
        } catch (err) {
            console.error(err);
            error = 'Error fetching items.';
        }
    }
</script>

{#if error}
   <p class="error">{error}</p>
   <button on:click={() => goto('/main/user_panel')}>Wróć do Panelu Użytkownika</button>
      {:else if items.length > 0}
         <div class="warehouse">
            <button on:click={() => goto('/main/user_panel')}>Wróć do Panelu Użytkownika</button>
            <h2>Magazyn - Dostępne przedmioty</h2>
            <div class="items">
               {#each items as item}
               <div class="item">
                  <h3>{item.item_name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  <p>Arrival Date: {item.arrival_date}</p>
                  <p>Added By: {item.added_by}</p>
                  <p>Warehouse ID: {item.warehouse_id}</p>
               </div>
               {/each}
            </div>
         </div>
      {:else}
   <p>No items available.</p>
{/if}
