<template>
  <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
    <li class="mb-2" v-if="classList.length > 0">
      <input
          type="checkbox"
          v-model="allSelected"
          @change="toggleSelectAll"
      />
      <label class="ms-1">Select All</label>
    </li>

    <li
        class="list-group-item"
        v-for="(cls, idx) in classList"
        :key="idx"
    >
      <input
          class="form-check-input me-1"
          type="checkbox"
          :value="cls.number"
          :id="cls.number"
          v-model="classId"
          style="outline: none 0 !important; box-shadow: none;"
          @click="addClass(cls)"
      />
      <label class="form-check-label cursor-pointer ml-2" :for="cls.number">
        {{ cls.code + ". " + cls.name + "    [" + cls.abbreviation + "]" }}
      </label>
    </li>
  </ul>
</template>

<script setup>
import { ref, watch } from 'vue'

const classList = ref([
  { number: '1', code: 101, name: 'Nursery', abbreviation: 'NRS' },
  { number: '2', code: 102, name: 'Primary One', abbreviation: 'P1' },
  { number: '3', code: 103, name: 'Primary Two', abbreviation: 'P2' }
  // Add more classes as needed
])

const classId = ref([]) // Selected class numbers
const allSelected = ref(false)

const toggleSelectAll = () => {
  if (allSelected.value) {
    classId.value = classList.value.map(cls => cls.number)
  } else {
    classId.value = []
  }
}

const addClass = (cls) => {
  // Optional logic when a class is toggled individually
}

// Sync `allSelected` with individual checkbox selection
watch(classId, (newVal) => {
  allSelected.value = newVal.length === classList.value.length
})
</script>
