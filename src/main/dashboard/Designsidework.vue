<template>
    <div>
      <div class="invoice-details">     
        <div class="invoice-items">
          <h3>Invoice Items:</h3>
          <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
            <li class="list-group-item" >
                <div class="item-selector">
          <input type="checkbox" id="selectAll" v-model="selectAll" @change="selectAllItems">
          <label for="selectAll">Select All</label>
        </div>
          </li>
            <li class="list-group-item"  v-for="(item, index) in invoice.items" :key="index">
              <input  style="outline: none 0 !important; box-shadow: none;" class="form-check-input me-1" type="checkbox" :id="'itemCheckbox' + index" v-model="selectedItems" :value="index">
              <label class="form-check-label cursor-pointer textColor" :for="'itemCheckbox' + index">{{ item.description }} - [ ugshs {{ item.price }} ]</label>
            </li>
          </ul>
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
  import { ref,reactive, computed } from 'vue';
  let  student_number = '1203039490402st'
  
  const invoice = ref({
    items: [
      { description: 'Item 1', price: 10 },
      { description: 'Item 2', price: 20 },
      { description: 'Item 3', price: 15 },
    ]
  });
  
  const selectAll = ref(false);
  const selectedItems = ref([]);
  
  const total = computed(() => selectedItems.value.reduce((acc, index) => acc + invoice.value.items[index].price, 0));
  
  const selectAllItems = () => {
    if (selectAll.value) {
      selectedItems.value = invoice.value.items.map((item, index) => index);
    } else {
      selectedItems.value = [];
    }
  };
  
  const submitInvoice = () => {
    const selectedItemsData = selectedItems.value.map(index => {
      const item = invoice.value.items[index];
      return { description: item.description, price: item.price };
    });
    const data = {
        student_number,
      items: selectedItemsData
    };
    alert(JSON.stringify(data));
  };
  </script>
  
  <style scoped>

  </style>
  