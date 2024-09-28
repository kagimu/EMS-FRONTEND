<script setup lang="ts">
import {computed, onMounted, ref, type Ref, watch} from 'vue';
import {onClickOutside} from '@vueuse/core'
import { useAccountStore } from "../store/account.js";


let entityNumber = localStorage.getItem("entity_number")
const accountStore = useAccountStore()
const target = ref(null)
const page = ref(1)
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)
const userData = ref([])
let typingTimer = null;
const tableLoader = ref(true)



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
  doFetchAccount()

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


const debounceSearch = () => {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    doFetchAccount()
  }, 1000); // 500ms delay
};

// Watch the search input and debounce the search function
watch(search, () => {
  debounceSearch();
});





const doFetchAccount = () =>{
  let data = {
    page: 1,
    per_page: per_page.value,
    entity_number:entityNumber,
    search: search.value,
  }
  //  loading.value = true;
  userData.value = []
  accountStore.fetchUsersToAssign(data)

}


function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {

    tableLoader.value = true
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      entity_number:entityNumber,
      search: search.value,
    }
    //  loading.value = true;
    userData.value = []
    accountStore.fetchUsersToAssign(data)

  }
}

const fetchUsers = (data) => {
  if(data) {
    let current_page = data.page
    page.value = current_page
    tableLoader.value = false

    let per_page_item = data.per_page;
    per_page.value = per_page_item;

    let objArray = data.content

    let count_items = (current_page * per_page_item)
    let totalItems = data?.total_rows


    if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
      objArray.forEach((list, i) => {

        list.key =  (current_page - 1) * per_page_item + i + 1
        list.name = list?.first_name + " "  + list?.second_name+ " " + list?.last_name
        const index = userData.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          userData.value.push(list);
        }

      })
    }


  }
}

watch(
    () => accountStore.userResponse,
    async (data) => {
      if(data){
        fetchUsers(data)
      }
    }
)



</script>

<template>
<div>
  <div class="relative" ref="dropdownWrapper">



    <div
        @click="openDropdown"
        @focus="openDropdown"
        class="border rounded-md py-2 flex flex-wrap cursor-text">
      <div v-if="selectedItems.length < 1" class="text-xs text-gray-600">
       <div class="ml-3">--Select Teacher--</div>
      </div>
      <div
          v-else
          class="text-xs border mx-1 my-[2px] rounded-md text-[#03408f] border-[#03408f] hover:bg-[#03408f] hover:text-white cursor-pointer"
          v-for="(item,idx) in selectedItems" :key="idx">
        <div class="flex flex-grow px-2">
          {{userData.find(data => data.number === item)?.name}}
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





      <div @scroll="onScroll" class="max-h-[300px] overflow-y-scroll scrollbar-thin my-2 border-b">
        <div class="text-center text-[#65676b] mt-4 text-sm" v-if="generalTableData?.length === 0">
          No results found.
        </div>
          <div
              class="cursor-pointer p-2 hover:bg-gray-100 flex items-center"
              v-for="(item,idx) in userData" :key="idx">
            <div class="px-3 flex">
            <input
                v-model="selectedItems"
                class="form-check-input shadow-none"
                type="checkbox"
                :value="item?.number"
                :id="'item-'+(idx+1)">
            <label
                class="form-check-label cursor-pointer capitalize ml-3 text-sm text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis"
                 :for="'item-'+(idx+1)">{{item?.name}}</label>
            </div>
          </div>
      </div>

    </div>




  </div>
</div>
</template>

<style scoped>

</style>