<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';

const target = ref(null);

const props = defineProps({
  optionList: [],
  optionDraft:String
});

const query = ref('');
const search = ref('');
const dropdownOpen = ref(false);
const selectedItem = ref();  // Store the full item (number & name)
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
  const draft = props.optionDraft;
  if(draft){
    selectedItem.value = draft
  }

}





watch(
  () => props.optionList,
  async (data) => {
    if (data) {
     // Populate items with optionList data
      checkOptionsDraft();  
      checkDraft();
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
  if (newVal) {
    emits("update:optionResponse", newVal);  // Emit the number value
  } else {
    emits("update:optionResponse", null);
  }
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
  selectedItem.value = item;  // Store the full item (name and number)
  dropdownOpen.value = false;
};

const removeItem = () => {
  selectedItem.value = null;  
};
</script>


<template>
  <!-- {{ selectedItem }} -->
  <div class="relative" ref="dropdownWrapper">
    <div
      @click="openDropdown"
      @focus="openDropdown"
      class=" rounded-md py-0 flex flex-wrap cursor-text"
    >
      <div v-if="!selectedItem" class="text-xs text-gray-600">
        <div class="ml-1 pt-1">--Select Menu Item--</div>
      </div>
      <div
        v-else
        class="text-xs mx-1 my-[2px]  hover:bg-[#fafafa] hover:text-[#198754] cursor-pointer form-select form-select-sm form-control select-no-border text-xs"
      >
        <div class="flex flex-grow px-0 r text-xs" >
          {{ selectedItem }}  <!-- Display name instead of number -->
        </div>
      </div>
    </div>

    <div
      ref="target"
      v-if="dropdownOpen"
      class="absolute mt-0  bg-white shadow-lg z-10 w-full "
      style="background-color: #f8f9fa !important;"
    >
      <div class="px-1 pt-1">
        <input
          v-model="search"
          @input="filterItems"
          type="text"
          placeholder="Search here ...."
          class="form-control shadow-none"
        />
      </div>

      <div class="max-h-[300px] overflow-y-scroll scrollbar-thin my-2" >
        <div
          class="cursor-pointer p-1 hover:bg-gray-100 flex items-center"
          v-for="(item, idx) in filteredItems"
          :key="idx"
          @click="selectItem(item)"
        >
          <div class="px-1 flex">
            <label class="form-check-label cursor-pointer capitalize ml-1 text-sm  whitespace-nowrap overflow-hidden text-ellipsis" style="font-size: 12px;">
              {{ item.name }} 
              <!-- ({{ item.number }})  if you want to show the number as well -->
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.bg-whitey {
  --bs-bg-opacity: 1;
  background-color: rgb(248, 248, 248) !important;
}

/* For WebKit-based browsers (Chrome, Safari, Edge) */
.max-h-[300px]::-webkit-scrollbar {
  width: 6px; /* Adjust the width as needed */
}

.max-h-[300px]::-webkit-scrollbar-thumb {
  background-color: #ccc; /* Color of the scrollbar thumb */
  border-radius: 10px;     /* Rounded corners */
}

.max-h-[300px]::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* Color of the scrollbar track */
}

/* For Firefox */
.max-h-[300px] {
  scrollbar-width: thin; /* Set scrollbar to thin */
  scrollbar-color: #ccc #f1f1f1; /* Thumb and track colors */
}
</style>

