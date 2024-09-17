<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';

const target = ref(null);

const props = defineProps({
  optionList: {
    type: Array,
    default: () => []
  },
  optionDraft: {
    type: [Array, String, Number],
    default: () => ''
  }
});

// Reactive references
const query = ref('');
const search = ref('');
const dropdownOpen = ref(false);
const selectedItem: Ref<number | null> = ref(null);  // Changed to number select
const dropdownWrapper = ref<HTMLElement | null>(null);
const items = ref([]);  // Initialize items as an empty array
const hasProcessed = ref(false);

const emits = defineEmits(["update:optionResponse"]);

onClickOutside(target, (event) => {
  if (event) {
    dropdownOpen.value = false;
  }
});

onMounted(() => {
  checkDraft();
  checkOptionsDraft();
});

watch(
  () => props.optionDraft,
  async (data) => {
    if (data) {
      checkDraft();
    }
  }
);

const checkDraft = () => {
  let draft = props.optionDraft;
  if (draft && !hasProcessed.value) {
    selectedItem.value = draft as number;  // Ensure the draft is a number
    hasProcessed.value = true;
  }
};

watch(
  () => props.optionList,
  async (data) => {
    if (data) {
      checkOptionsDraft();
    }
  }
);

const checkOptionsDraft = () => {
  let draft = props.optionList;
  if (draft) {
    items.value = draft;  // Ensure items are assigned properly
  }
};

watch(selectedItem, (newVal) => {
  emits("update:optionResponse", newVal);  // Emit the number value
});

// Filter items based on query
const filteredItems = computed(() => {
  const searchTerm = search.value.toLowerCase();
  return items.value?.filter(item =>
    item.name.toLowerCase().includes(searchTerm)  // Assuming the name is still used for search
  );
});

// Methods
const filterItems = () => {
  if (query.value.length > 0) {
    openDropdown();
  }
};

const openDropdown = () => {
  dropdownOpen.value = true;
};

const selectItem = (item: any) => {
  selectedItem.value = item.number;  // Select by number
  dropdownOpen.value = false;
};

const removeItem = () => {
  selectedItem.value = null;  
};
</script>

<template>
  <div class="relative" ref="dropdownWrapper">
    <div
      @click="openDropdown"
      @focus="openDropdown"
      class="border rounded-md py-2 flex flex-wrap cursor-text"
    >
      <div v-if="!selectedItem" class="text-xs text-gray-600">
        <div class="ml-3">--Select Menu Item--</div>
      </div>
      <div
        v-else
        class="text-xs  mx-1 my-[2px]  text-[#03408f]  hover:bg-[#fafafa] hover:text-[#198754] cursor-pointer"
       
      >
        <div class="flex flex-grow px-2">
          {{ selectedItem }}
        </div>
      </div>
    </div>

    <div
      ref="target"
      v-if="dropdownOpen"
      class="absolute mt-1 border border-gray-300 rounded-lg bg-white shadow-lg z-10 w-full"
    >
      <div class="px-2 pt-2">
        <input
          v-model="search"
          @input="filterItems"
          type="text"
          placeholder="Search"
          class="form-control shadow-none"
        
        />
      </div>

      <div class="max-h-[200px] overflow-y-scroll scrollbar-thin my-2">
        <div
          class="cursor-pointer p-2 hover:bg-gray-100 flex items-center"
          v-for="(item, idx) in filteredItems"
          :key="idx"
          @click="selectItem(item)"
        >
          <div class="px-1 flex">
            <label class="form-check-label cursor-pointer capitalize ml-3 text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis">
              {{ item.name }} 
              <!-- ({{ item.number }})   -->
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles (if any) */
</style>
