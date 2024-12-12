<template>
  <div>
    <div class="col-4">
      <div class="mb-2">
        <input
          v-model="searchQuery"
          class="form-control mb-0"
          placeholder="Search..."
          type="text"
        />
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Unit of Measure</th>
          <th>Purchase Unit</th>
          <th>Current Quantity</th>
          <th>Unit Cost</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(list, index) in filteredMenuItems"
          v-if="!isLoading"
          :key="index"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ list.name }}</td>
          <td>{{ list.unit_of_measure_name }}</td>
          <td>{{ list.purchase_unit_of_measure_name }}</td>
          <td>{{ list.current_quantity.toLocaleString() }}</td>
          <td>{{ list.unit_cost.toLocaleString() }}</td>
          <td>
            <button v-if="can('edit_menu_item', 'general')" @click="showUpdateDialog(list)">
              <i class="bi bi-pencil-square" style="color:rgb(3, 85, 148)"></i>
            </button>
            &nbsp;
            <button v-if="can('remove_menu_item', 'general')" type="button" @click="deleteThisData(list.number, list.name)">
              <i class="bi bi-trash" style="color:rgb(201, 10, 10)"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="isLoading" class="text-center">
      Loading data...
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  setup() {
    // Reactive variables
    const searchQuery = ref("");
    const isLoading = ref(false);

    // Mock data for the table
    const menuItemData = ref([
      { name: "Item 1", unit_of_measure_name: "Kg", purchase_unit_of_measure_name: "Box", current_quantity: 50, unit_cost: 5000 },
      { name: "Item 2", unit_of_measure_name: "L", purchase_unit_of_measure_name: "Bottle", current_quantity: 20, unit_cost: 3000 },
      { name: "Item 3", unit_of_measure_name: "Pcs", purchase_unit_of_measure_name: "Packet", current_quantity: 100, unit_cost: 200 },
    ]);

    // Filtering logic
    const filteredMenuItems = computed(() => {
      if (!searchQuery.value.trim()) {
        return menuItemData.value;
      }
      return menuItemData.value.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    // Mock permissions and actions
    const can = (action, resource) => {
      // Replace with actual permission logic
      return true;
    };

    const showUpdateDialog = (item) => {
      alert(`Update item: ${item.name}`);
    };

    const deleteThisData = (number, name) => {
      alert(`Delete item: ${name}`);
    };

    return {
      searchQuery,
      isLoading,
      filteredMenuItems,
      can,
      showUpdateDialog,
      deleteThisData,
    };
  },
};
</script>

<style>
.table {
  width: 100%;
  margin: 1rem 0;
  border-collapse: collapse;
}

.table th, .table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.table th {
  background-color: #f4f4f4;
  text-align: left;
}
</style>
