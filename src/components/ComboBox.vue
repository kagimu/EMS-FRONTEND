<script setup lang="ts">
import {ref, computed, onMounted, type Ref, watch} from 'vue';
import { onClickOutside } from '@vueuse/core'
const target = ref(null)


const props = defineProps({
  optionList: []
})



// Reactive references
const query = ref('');
const search = ref('');
const dropdownOpen = ref(false);
const selectedItems:Ref<string[]> = ref([]);
const dropdownWrapper = ref<HTMLElement | null>(null);

const emits = defineEmits(["update:currencyList"]);



onClickOutside(target, (event) => {
  if(event) {
    dropdownOpen.value = false;
  }
});



onMounted(() => {
  items.value = currency?.currencyList
  checkDraft()
});

/*watch(
    () => props.currencyDraft,
    async (data) => {
      if (data) {
        checkDraft()
      }
    },
);*/


const checkDraft = () => {
  let draft = props.currencyDraft
  if(draft){
    selectedItems.value = [...draft]
  }
}

watch(selectedItems, (newVal) => {
  emits("update:currencyList", newVal);
});



// Filter items based on query
const filteredItems = computed(() => {
  const searchTerm = search.value.toLowerCase();
  return items.value.filter((item: ListOptions) =>
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
      <div v-if="selectedItems.length < 1" class="text-xs">
        &nbsp;
      </div>
      <div
          v-else
          class="text-xs border w-[10%] mx-1 my-1 rounded-md text-[#03408f] border-[#03408f] hover:bg-[#03408f] hover:text-white cursor-pointer"
          v-for="(item,idx) in selectedItems" :key="idx">
        <div class="flex flex-grow justify-between px-1">{{item}}
          <div><i class="fa-regular fa-times-circle hover:text-[yellow]"  @click="removeItem(idx)"/></div></div>
      </div>
    </div>



    <div
        ref="target"
        v-if="dropdownOpen"
        class="absolute mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg z-10"
    >
      <div class="px-2 pt-2">
        <input
            v-model="search"
            @input="filterItems"
            type="text"
            placeholder="Search Currency"
            class="form-element"
        />
      </div>





      <div class="max-h-[200px] overflow-y-scroll scrollbar-thin my-2">
          <div
              class="cursor-pointer p-2 hover:bg-gray-100 flex items-center"
              v-for="(item,idx) in filteredItems" :key="idx">
            <div class="px-3">
            <input
                v-model="selectedItems"
                style="outline: none 0 !important; box-shadow: none;"
                class="form-check-input me-1"
                type="checkbox"
                :value="item?.value"
                :id="item?.value">
            <label class="form-check-label cursor-pointer capitalize ml-3" :for="item?.value">{{item?.text}}</label>
            </div>
          </div>
      </div>

    </div>




  </div>
</div>
</template>

<style scoped>

</style>