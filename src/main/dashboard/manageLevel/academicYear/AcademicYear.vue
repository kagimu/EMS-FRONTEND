<template>
  <div>

    <AppModal :title="editMode ? 'Edit Academic Year' : 'Add Academic Year'" v-model="newAcademicYearDialog" lg>
      <new-academic-year ref="academicYearRef"></new-academic-year>
    </AppModal>



    <div class="flex justify-content-between mt-10 mb-4 mr-3">
      &nbsp;
      <button
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addAcademicYear">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Academic Year
      </button>
    </div>


    <table class="table table-hover caption-top" style="font-size: 13px;">
      <thead>
      <tr>
        <th scope="col">Code</th>
        <th scope="col">Level</th>
        <th scope="col">Academic Year</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(academicYre, index) in academicYearList" :key="index">
        <td> {{academicYre.code}}</td>
        <td class="capitalize"> {{academicYre.name}}</td>
        <td>
          <table class="table table-hover caption-top text-sm">
            <tbody>
            <tr v-for="(list,idx) in academicYre.academicYear" :key="idx">
              <td>{{list.code}}</td>
              <td class="capitalize">
                <div>{{list.academic_year_name}}</div>
                <span class="bg-[#0d6efd] px-2 py-[2px] rounded-sm text-white text-xs">{{list.no_of_study_period}} Periods</span>
              </td>
              <td class="text-sm">
                <b>Start Date:</b>   {{list.academic_year_start_date}}  <br />
                <b>End Date:</b>  {{list.academic_year_end_date}}
              </td>
              <td>
                <div>
                  <i
                      data-bs-toggle="modal"
                      data-bs-target="#newAcademicYearModal"
                      class="bi-pencil mr-2 cursor-pointer text-[13px]" @click="editAcademicYear(list)"></i>
                  <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteAcademicYear(list, idx)"></i>
                  <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === idx">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>

        </td>

      </tr>
      </tbody>
    </table>





  </div>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import NewAcademicYear from "@/main/dashboard/manageLevel/academicYear/NewAcademicYear.vue";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useRouter} from "vue-router";
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import NewCampusClass from "@/main/dashboard/manageLevel/class/NewCampusClass.vue";
const routerData = useRouter()
const academicYearStore = useAcademicYearStore()
const newAcademicYearDialog = ref( false)
const deletionLoader = ref( undefined)
const campusCurriculumNumber = routerData.currentRoute.value.query.crr
const academicYearList = ref( [])
const academicYearRef = ref( null)
const editMode = ref( null)
const  notificationStore  = useNotificationStore()

const addAcademicYear = (item) => {
  // classNumber.value = item.number
  newAcademicYearDialog.value = true
  editMode.value = false
  academicYearRef.value.clearAcademicYear()
}


const editAcademicYear = (academicYre)  => {
  if(academicYre) {
    editMode.value = true
    newAcademicYearDialog.value = true
    academicYearStore.fetchAcademicYearData(academicYre.number)
  }
}

const deleteAcademicYear = (academicYre, idx) => {

  if(!confirm("Are you sure, you want to delete: "+academicYre.academic_year_name)){
    return
  }

  deletionLoader.value = idx

  let data = {
    number:academicYre.number
  }

  academicYearStore.deleteAcademicYear(data)

}

onMounted(
    () => {
      academicYearStore.fetchAcademicYear(campusCurriculumNumber)
    }
)


watch(
    () => academicYearStore.newAcademicYearResponse,
    async (data) => {
      if(data){
        await academicYearStore.fetchAcademicYear(campusCurriculumNumber)
        notificationStore.successToast("Success",data.message)
      }
    }
)

watch(
    () => academicYearStore.academicYearResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)

watch(
    () => academicYearStore.deleteAcademicYearResponse,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
        await academicYearStore.fetchAcademicYear(campusCurriculumNumber)
      }
    }
)


watch(
    () => academicYearStore.editAcademicYearResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success",data.message)
        await academicYearStore.fetchAcademicYear(campusCurriculumNumber)
      }
    }
)


watch(
    () => academicYearStore.errorMessage,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
      }
    }
)



</script>

<style scoped>

</style>