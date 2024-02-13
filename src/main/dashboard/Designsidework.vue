<template>
  <div>
    <div class="invoice-details">
      <div class="invoice-items">
        <h3>Invoice Items:</h3>
        <div class="row">
          <div v-for="(column, columnIndex) in columns" :key="columnIndex" class="col-md-4">
            <ul class="list-group text-sm mb-4" style="border-radius: 0;">
              <li class="list-group-item">
                <input class="form-check-input me-1" type="checkbox" :id="'selectAllCheckbox' + columnIndex" v-model="selectAllAll" @change="selectAllItems">
                <label class="form-check-label cursor-pointer textColor" :for="'selectAllCheckbox' + columnIndex">Select All</label>
              </li>
              <li class="list-group-item" v-for="(item, index) in column" :key="index">
                <input class="form-check-input me-1" type="checkbox" :id="'itemCheckbox' + index" v-model="selectedItems" :value="(columnIndex * 7) + index">
                <label class="form-check-label cursor-pointer textColor" :for="'itemCheckbox' + index">{{ item.description }} - [ ugshs {{ item.price }} ]</label>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="invoice-total">
        <h3>Total:</h3>
        <p>{{ total }}</p>
      </div>
      <button @click="submitInvoice">Submit</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const studentNumber = '1203039490402st';
const invoice = ref({
  items: [
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
    { description: 'Item 1', price: 10 },
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },

  ]
});

const selectAllAll = ref(false); // Select all items across all columns
const selectedItems = ref([]);

const total = computed(() => selectedItems.value.reduce((acc, index) => acc + invoice.value.items[index].price, 0));

const columns = computed(() => {
  const items = invoice.value.items;
  const numColumns = Math.ceil(items.length / 7);
  const columns = Array.from({ length: numColumns }, (_, columnIndex) => {
    const startIndex = columnIndex * 7;
    return items.slice(startIndex, startIndex + 7);
  });
  return columns;
});

const selectAllItems = () => {
  if (selectAllAll.value) {
    const allItems = invoice.value.items.map((_, index) => index);
    selectedItems.value = [...new Set([...selectedItems.value, ...allItems])]; // Add all items
  } else {
    selectedItems.value = []; // Clear selected items
  }
};

const submitInvoice = () => {
  const selectedItemsData = selectedItems.value.map(index => {
    const item = invoice.value.items[index];
    return { description: item.description, price: item.price };
  });
  const data = {
    student_number: studentNumber,
    items: selectedItemsData
  };
  alert(JSON.stringify(data));
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
