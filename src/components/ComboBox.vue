<script setup lang="ts">
import {computed, onMounted, ref, type Ref, watch} from 'vue';
import {onClickOutside} from '@vueuse/core'

const target = ref(null)


const props = defineProps({
  optionList: [],
  optionDraft: []
})



// Reactive references
const query = ref('');
const search = ref('');
const dropdownOpen = ref(false);
const selectedItems:Ref<string[]> = ref([]);
const dropdownWrapper = ref<HTMLElement | null>(null);
const items = ref([]);
const hasProcessed = ref(false);

const emits = defineEmits(["update:optionResponse"]);



onClickOutside(target, (event) => {
  if(event) {
    dropdownOpen.value = false;
  }
});



onMounted(() => {

  checkDraft()
  checkOptionsDraft()

});

watch(
    () => props.optionDraft,
    async (data) => {
      if (data) {
        checkDraft()
      }
    },
);


const checkDraft = () => {
  let draft =  props.optionDraft
  if(draft && (draft.length > 0) && !hasProcessed.value){
    selectedItems.value = draft
    hasProcessed.value = true
  }
}

watch(
    () => props.optionList,
    async (data) => {
      if (data) {
        checkOptionsDraft()
      }
    },
);




const checkOptionsDraft = () => {
  let draft = props.optionList
  if(draft) {
    // selectedItems.value = []
    items.value = draft
  }
}

watch(selectedItems, (newVal) => {
  emits("update:optionResponse", newVal);
});



// Filter items based on query
const filteredItems = computed(() => {
  const searchTerm = search.value.toLowerCase();
  return items.value?.filter(item =>
      item.value.toLowerCase().includes(searchTerm) ||
      item.text.toLowerCase().includes(searchTerm)
  );
});

// Methods
const filterItems = () => {
  if (query.value.length > 0) {
    openDropdown();
  }
}

const openDropdown = () => {
  dropdownOpen.value = true;
}

const removeItem = (idx:number) => {
  selectedItems.value.splice(idx, 1)
}


</script>

<template>
<div>
  <div class="relative" ref="dropdownWrapper">


    <div
        @click="openDropdown"
        @focus="openDropdown"
        class="border rounded-md py-2 flex flex-wrap cursor-text">
      <div v-if="selectedItems.length < 1" class="text-xs text-gray-600">
       <div class="ml-3">--Select Item--</div>
      </div>
      <div
          v-else
          class="text-xs border mx-1 my-[2px] rounded-md text-[#03408f] border-[#03408f] hover:bg-[#03408f] hover:text-white cursor-pointer"
          v-for="(item,idx) in selectedItems" :key="idx">
        <div class="flex flex-grow px-2">
          {{items.find(data => data.value === item)?.text}}
          <div><i class="fa-regular fa-times-circle hover:text-[yellow] ml-2"  @click="removeItem(idx)"/></div></div>
      </div>
    </div>



    <div
        ref="target"
        v-if="dropdownOpen"
        class="absolute mt-1  border border-gray-300 rounded-lg bg-white shadow-lg z-10 w-full"
    >
      <div class="px-2 pt-2">
        <input
            v-model="search"
            @input="filterItems"
            type="text"
            placeholder="Search"
            class="form-control form-select-sm shadow-none">
      </div>





      <div class="max-h-[200px] overflow-y-scroll scrollbar-thin my-2">
          <div
              class="cursor-pointer p-2 hover:bg-gray-100 flex items-center"
              v-for="(item,idx) in filteredItems" :key="idx">
            <div class="px-3 flex">
            <input
                v-model="selectedItems"
                class="form-check-input shadow-none"
                type="checkbox"
                :value="item?.value"
                :id="'item-'+(idx+1)">
            <label
                class="form-check-label cursor-pointer capitalize ml-3 text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                 :for="'item-'+(idx+1)">{{item?.text}}</label>
            </div>
          </div>
      </div>

    </div>




  </div>
</div>
</template>

<style scoped>

</style>