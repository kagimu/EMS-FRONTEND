<script setup>

import router from "@/config/router.js";
import {onMounted, ref, watch} from "vue";
import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";

const curriculumStore = useCurriculumStore()
const curriculumList = ref([])
 const curriculumNumber = ref("")
 const curriculum_number = ref(null)


onMounted(
    async () => {
      await  curriculumStore.fetchCurriculum()
    }
)

watch(
    () => curriculumStore.curriculumDataResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

const setCurriculum = (curriculumN) => {
    //set in storage
    localStorage.setItem("CurriculumNum", curriculumN)
}
</script>

<template>
  <div class="row mx-auto">
            <div class="col-10 mt-1">
            <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="curriculumNumber"
                >
              <option disabled value="">-select Curriculum-</option>
              <option v-for="(list, index) in curriculumList" :key="index" :value="list.number">{{list.name}}</option>
            </select>
          </div>
          <div class="col-2 mt-1">
            <button @click="setCurriculum(curriculumNumber)" class="btn btn-primary btn-sm mb-2">GO</button>
          </div>
</div>
             
</template>

<style scoped>

</style>