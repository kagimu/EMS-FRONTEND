<template>
  <div>
    <!-- Controls -->
    <div>
      <div class="row">
          <div class="col-9">
              <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="search-input"
      />
          </div>

          <div class="col-3 mb-2">
              <button @click="exportToCSV" class="link link-primary mr-4"> <i class="bi bi-filetype-csv"></i> CSV
              </button>
      <button @click="exportToPDF" class="link link-success mr-4"><i class="bi bi-file-earmark-pdf"></i> PDF</button>
      <button @click="copyToClipboard" class="link link-default">  <i class="bi bi-clipboard"></i> Copy </button>
          </div>

      </div>

    </div>

    <!-- Table -->
    <div class="table-container">
      <table class="table table-bordered table-striped table-hover">
        <thead>
          <tr>
            <th
              v-for="(column, index) in columns"
              :key="column.key"
              @click="sortBy(column.key)"
              :style="{ width: columnWidths[index] + 'px' }"
            >
              <div class="column-header">
                {{ column.label }}
                <span>{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
                <div
                  class="resize-handle"
                  @mousedown="startResize(index, $event)"
                ></div>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td v-for="(column, index) in columns" :key="column.key">
              {{ row[column.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import jsPDF from 'jspdf'; // Install: npm install jspdf
import 'jspdf-autotable';

// Sample data
const rows = ref([
  { adn: 'AND10203412',gender:'Male', name: 'Alice', grade: 30, comment: 'Excellent' },
  { adn: 'AND10203413',gender:'Male', name: 'Bob', grade: 25, comment: 'Very Good' },
  { adn: 'AND10203414', gender:'Male',name: 'Charlie', grade: 35, comment: '' },
  { adn: 'AND10203415', gender:'Male',name: 'David', grade: 28, comment: 'Good' },
  { adn: 'AND10203416',gender:'Male', name: 'Eve', grade: 29, comment: 'Tried' },
  { adn: 'AND10203417',gender:'Male', name: 'Frank', grade: 32, comment: 'Good' },
  { adn: 'AND10203419', gender:'Male',name: 'Grace', grade: 27, comment: 'Excellent' },
  { adn: 'AND10203410', gender:'Male',name: 'Hank', grade: 31, comment: 'Good' },
]);

const columns = ref([
{ label: 'ADN', key: 'adn' },
  { label: 'Name', key: 'name' },
  { label: 'Gender', key: 'gender' },
  { label: 'Grade', key: 'grade' },
  { label: 'Comment', key: 'comment' },
]);

const columnWidths = ref(columns.value.map(() => 150));
let resizingColumn = null;
let startX = 0;
let startWidth = 0;

const startResize = (index, event) => {
  resizingColumn = index;
  startX = event.clientX;
  startWidth = columnWidths.value[index];
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (event) => {
  if (resizingColumn !== null) {
    const delta = event.clientX - startX;
    columnWidths.value[resizingColumn] = Math.max(50, startWidth + delta);
  }
};

const stopResize = () => {
  resizingColumn = null;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};

onMounted(() => {
  document.addEventListener('mouseup', stopResize);
});

onBeforeUnmount(() => {
  document.removeEventListener('mouseup', stopResize);
});

const sortKey = ref('');
const sortDirection = ref('asc');
const searchQuery = ref('');
const currentPage = ref(1);
const rowsPerPage = ref(10);

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortDirection.value = 'asc';
  }
};

const filteredData = computed(() => {
  let filtered = [...rows.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter((row) =>
      columns.value.some((column) =>
        String(row[column.key]).toLowerCase().includes(query)
      )
    );
  }

  if (sortKey.value) {
    filtered.sort((a, b) => {
      const aValue = a[sortKey.value];
      const bValue = b[sortKey.value];
      return sortDirection.value === 'asc'
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  }

  return filtered;
});
const totalPages = computed(() => Math.ceil(filteredData.value.length / rowsPerPage.value));
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredData.value.slice(start, end);
});

const exportToCSV = () => {
  const csvContent = [
    columns.value.map((col) => col.label).join(','),
    ...filteredData.value.map((row) =>
      columns.value.map((col) => `"${row[col.key]}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'data.csv';
  link.click();
  URL.revokeObjectURL(url);
};


const exportToPDF = () => {
  const doc = new jsPDF();
  const headers = columns.value.map((col) => col.label);
  const rows = filteredData.value.map((row) =>
    columns.value.map((col) => String(row[col.key]))
  );

  doc.setFontSize(16);
  doc.text('Exported Data', 14, 10);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 20,
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  doc.save('data.pdf');
};

const copyToClipboard = () => {
  const content = [
    columns.value.map((col) => col.label).join('\t'),
    ...filteredData.value.map((row) =>
      columns.value.map((col) => row[col.key]).join('\t')
    ),
  ].join('\n');

  navigator.clipboard.writeText(content).then(() => {
    alert('Data copied to clipboard!');
  });
};
</script>

<style>
.controls {
  display: flex;
  gap: 1px;
  margin-bottom: 1px;
}

.search-input {
  padding: 5px;
  font-size: 14px;
  width: 400px;
}

.action-button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #0056b3;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  position: relative;
  cursor: pointer;
  background-color: #f9f9f9;
  padding: 8px;
  text-align: left;
}

th span {
  font-size: 12px;
  margin-left: 5px;
}

.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
}

td {
  padding: 8px;
  border-top: 1px solid #ccc;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
