<template>
  <div>
  
  <ul>
    <li v-for="(item, indx) in items" :key="indx"
        class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
      <div class="d-flex align-items-center" style="font-size: 12px;">
        <input v-model="selectedItems" 
               class="form-check-input me-2" 
               type="checkbox" 
               :value="item.item_number" 
               @change="toggleSelection(item)"
               aria-label="..." />
        {{ item.item_name }} {{ item.cost }}
        <input type="text" 
               class="form-control ml-1" 
               style="width: 50px;" 
               v-model.number="item.quantity"
               @input="updateQuantity(item, $event)">
      </div>
    </li>
  </ul>
  <button @click="submit">Submit</button>


  </div>

</template>

<script setup>
import { reactive, ref } from 'vue';

const items = reactive([
  { item_number: "432523523423", item_name: "Item 1", cost: 10, quantity: 1 },
  { item_number: "098765432109", item_name: "Item 2", cost: 20, quantity: 1 }
]);

const selectedItems = ref([]);

const toggleSelection = (item) => {
  const index = selectedItems.value.findIndex(selected => selected.item_number === item.item_number);
  if (index === -1) {
    selectedItems.value.push({ ...item, brought: true });
  } else {
    selectedItems.value.splice(index, 1);
  }
};

const updateQuantity = (item, event) => {
  const selectedItem = selectedItems.value.find(selected => selected.item_number === item.item_number);
  if (selectedItem) {
    selectedItem.quantity = event.target.value;
  }
};

const submit = () => {
  // Prepare the data to exclude item_name and cost and remove empty objects
  const dataToSubmit = {
    items: selectedItems.value
      .map(({ item_number, quantity, brought }) => ({
        item_number,
        quantity,
        brought
      }))
      .filter(item => item.item_number && item.quantity !== undefined && item.brought !== undefined)
  };
  alert(JSON.stringify(dataToSubmit));
};
</script>


<style>
</style>