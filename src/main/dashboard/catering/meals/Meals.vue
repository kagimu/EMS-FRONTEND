<script setup>

import AppModal from "@/components/AppModal.vue";
import {onMounted, ref, watch} from "vue";
import NewMeal from "@/main/dashboard/catering/meals/components/NewMeal.vue";
import {useMealStore} from "@/main/dashboard/catering/meals/store/mealStore.js";
const  mealStore  = useMealStore()

const mealList = ref([])
const mealEditMode = ref(false)
const mealDialog = ref(false)

const addMeal = () => {
  mealDialog.value = true
}


onMounted(
    async () => {
      await mealStore.fetchMealData()
    }
)

watch(
    () => mealStore.mealDataResponse,
    async (data) => {
      if(data){
        mealList.value = data.data
      }
    }
)





</script>

<template>
  <div>


    <AppModal :title="mealEditMode ? 'Edit Meal' : 'Add Meal'" v-model="mealDialog" lg>
      <new-meal></new-meal>
    </AppModal>






    <div class="row">

      <div class="col-12">



        <div class="flex justify-content-between mt-3">
          <div class="ml-4">Meals</div>
          <button
              type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addMeal">
            <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
            Add a Meal
          </button>
        </div>



        <table class="table table-hover caption-top mt-5 table-sm" style="font-size: 14px;">
          <thead>
          <tr>
            <th scope="col" style="width: 30%;">Code</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(levelInfo, index) in mealList" :key="index">
            <td> {{levelInfo.code}}</td>
            <td> {{levelInfo.name}}</td>
            <td>
              <div>
                <i
                    style="font-size: 13px;"
                    data-bs-toggle="modal" data-bs-target="#levelModal"
                    class="bi-pencil mr-2 cursor-pointer" @click="editLevel(levelInfo)"></i>
                <i
                    style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteLevel(levelInfo, index)"></i>
                <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
    </div>



  </div>
</template>

<style scoped>

</style>