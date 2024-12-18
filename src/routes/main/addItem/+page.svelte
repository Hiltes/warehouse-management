<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import type { IWarehouse } from '$db/models/warehouse';


    let itemName = '';
    let quantity = 0;
    let arrivalDate = '';
    let warehouseId = '';
    let warehouse: IWarehouse[] = [];


    async function addItem() {
            const response = await fetch('/main/addItem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    item_name: itemName,
                    quantity,
                    arrival_date: arrivalDate,
                    warehouse_id: warehouseId
                })
            });

            if (response.ok) {
                alert('Item added successfully!');
            } else {
                alert('Error adding item');
            }
        }

    onMount(() => {
        async function fetchWarehouse() {
            try{
                const res = await fetch('/main/addItem');
            if (res.ok) {
                warehouse = await res.json() as IWarehouse[];
                console.log('Warehouse fetched:', warehouse); 
            } else {
                console.error('Error fetching warehouse' , res.statusText);

            }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchWarehouse();
    });
</script>

<form on:submit|preventDefault={addItem}>
   <h1>Dodaj Produkt do Magazynu</h1>
   <label for="name">Nazwa Przedmiotu:</label>
   <input id="name" bind:value={itemName} type="text" required />

   <label for="quantity">Ilość:</label>
   <input id="quantity" bind:value={quantity} type="number" required />

   <label for="date">Data Przyjęcia:</label>
   <input id="date" bind:value={arrivalDate} type="date" required />

   <label for="warehouse">Magazyn:</label>
   <select id="warehouse" bind:value={warehouseId} required>
       <option value=""  selected>Wybierz magazyn</option>
       {#each warehouse as w}
           <option value={w._id}>{w.warehouse_type}</option>
       {/each}
   </select>

   <button type="submit" class="btn-submit" style="margin-top: 30px;">Dodaj Przedmiot</button>
   <button on:click={() => goto('/main/user_panel')}>Wróć do Panelu Użytkownika</button>

</form>


