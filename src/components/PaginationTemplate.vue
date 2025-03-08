<script setup>
import {onMounted, ref, watch} from "vue";

const emits = defineEmits(["update:perPage"]);

const props = defineProps({
  per_page:Number,
  total_items:Number,
  total_rows:Number
})

const perPage = ref(0)

onMounted(() => {
  if(props.per_page) {
    perPage.value = props.per_page
  }
})

watch(perPage, (newVal) => {
  emits("update:perPage", newVal);
  emits("perPageChanged", newVal);
});

</script>

<template>
  <div class="flex justify-end pt-5 pb-2">
    <div class="flex pl-2">
      <select
          class="shadow-none w-[55px] cursor-pointer mr-3  !text-[13px] text-gray-600 border rounded-md px-2"
          v-model="perPage">
<!--        <option value="10">10</option>-->
        <option value="20">20</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
      <div class="text-xs text-gray-600 mr-10">Items: {{total_items}} of {{total_rows}}</div>
    </div>
  </div>
</template>

<style scoped>

</style>