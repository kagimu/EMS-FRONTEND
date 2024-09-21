<script setup lang="ts">
import { computed, onMounted, ref, type Ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';

const target = ref(null);

const props = defineProps({
  optionList: [],
  optionDraft:String,
  index:Number
});

const query = ref('');
const search = ref("");
const dropdownOpen = ref(false);
const selectedItem = ref(null);  // Store the full item (number & name)
const selectedItemInfo = ref(null);  // Store the full item (number & name)
const dropdownWrapper = ref<HTMLElement | null>(null);
const items = ref([]);  // Initialize items as an empty array
const hasProcessed = ref(false);


const emit = defineEmits(['update:optionResponse', 'change']);

onClickOutside(target, (event) => {
  if (event) {
    dropdownOpen.value = false;
  }
});

onMounted(() => {
 
    checkDraft();

  checkOptionsListDraft();
});


watch(
    () => props.optionList,
    async (data) => {
      if (data) {

        checkOptionsListDraft();

      }
    }
);

const checkOptionsListDraft = () => {
  let draft = props.optionList;
  if (draft) {
    items.value = draft;  // Ensure items are assigned properly
    selectedItemInfo.value = props.optionList?.find(item => item?.number === props.optionDraft)?.text
  }
};


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











watch(selectedItem, (newVal) => {
  if (newVal) {
    emit("update:optionResponse", newVal);  // Emit the new value for v-model
  } else {
    emit("update:optionResponse", null);    // Emit null if no value is selected
  }
  // Optionally, emit a custom change event as well
  emit("change", {number:newVal, index:props.index});
});

// Filter items based on query
const filteredItems = computed(() => {
  const searchTerm = search.value.toLowerCase();
  return items.value?.filter(item =>
    item?.text?.toLowerCase().includes(searchTerm)
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
  selectedItem.value = item.number;  // Store the full item (name and number)
  selectedItemInfo.value = item.text;  // Store the full item (name and number)
  dropdownOpen.value = false;
};

/*const removeItem = () => {
  selectedItem.value = null;  
};*/
</script>


<template>

<!-- {{optionDraft}} -->
  <div class="relative" ref="dropdownWrapper">
    <div
      @click="openDropdown"
      @focus="openDropdown"
      class=" rounded-md py-0 flex flex-wrap cursor-text"
    >
      <div v-if="!selectedItemInfo" class="text-xs text-gray-600 form-select border-0">
        <div class="ml-1 pt-1 text-xs">--Select Item--</div>
      </div>
      <div
        v-else
        class="text-xs text-gray-600 form-select border-0"
      >
        <div class="flex flex-grow px-0 r text-xs" >
          {{ selectedItemInfo }}  <!-- Display name instead of number -->
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
      <div v-if="filteredItems.length < 1" class="text-xs text-gray-600 text-center py-4">Item Not Found </div>
      <div v-else class="max-h-[300px] overflow-y-scroll scrollbar-thin my-2" >
       
        <div
          class="cursor-pointer p-1 hover:bg-gray-100 flex items-center"
          v-for="(item, idx) in filteredItems"
          :key="idx"
          @click="selectItem(item)"
        >
          <div class="px-1 flex">
            <label class="form-check-label cursor-pointer capitalize ml-1 text-sm  whitespace-nowrap overflow-hidden text-ellipsis" style="font-size: 12px;">
              {{ item.text }}
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

</style>

