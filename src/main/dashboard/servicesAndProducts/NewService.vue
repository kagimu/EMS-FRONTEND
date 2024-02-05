<template>
        <form @submit.prevent="createNewService">
          <div class="mb-2">
            <label class="textColor"><small>Campus</small></label><br>

                <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">
          <li class="list-group-item" >
            <input style="outline: none 0 !important; box-shadow: none;" class="form-check-input me-1" type="checkbox">
            <label class="form-check-label cursor-pointer textColor"><small>Main</small></label></li><li class="list-group-item">
            <input style="outline: none 0 !important; box-shadow: none;" class="form-check-input me-1" type="checkbox">
            <label class="form-check-label cursor-pointer textColor"><small>Kampala Campus</small></label></li><li class="list-group-item">
            <input style="outline: none 0 !important; box-shadow: none;" class="form-check-input me-1" type="checkbox">
            <label class="form-check-label cursor-pointer textColor"><small>Buwatta</small></label>
          </li>

        </ul>
          </div>


            <div class="mb-2">
                <label class="textColor"><small>School</small> <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm" required
                        v-model="school_number"
                        @change="fetchCampuses(school_number)"
                >
                    <option disabled value="">Select School</option>
                    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Campus</small>  <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.preferred_campus_number" required
                        @change="fetchClasses(form.preferred_campus_number)"
                >
                    <option disabled value="">Select campus</option>
                    <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


          <div class="mb-2">
            <label class="textColor"><small>Service Name</small></label>
            <input  type="text" style="outline: none 0 !important;box-shadow: none;"
                required class="form-control form-select-sm" v-model="formData.name">
          </div>
            <div class="mb-2">
                <label class="textColor"><small>Cost</small></label>
                <input v-model="formData.cost" style="outline: none 0 !important; box-shadow: none;" type="number"  required  class="form-control form-select-sm">
            </div>
            <div class="mb-2">
                <label class="textColor"><small>Addition Info</small></label>
                <textarea v-model="formData.description" class="form-control "></textarea>
            </div>
            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button type="submit" class="btn btn-primary border-0"> <i class="bi bi-save"></i> SaveData
                    <!-- <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status"><span class="visually-hidden">Loading...</span> 
                        </span> -->
                </button>
            </div>
        </form>
   
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const buttonLoader = ref(false)
let errorMessage = ref(null)
const campusList = ref([])
const schoolList = ref([])

const formData = reactive({
    description: null,
    cost: null,
    name:null,
})

const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}

const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
}

onMounted(() => {
        schoolStore.fetchSchools()
    }
)


const createNewService = () =>{
// alert(JSON.stringify(formData))
serviceStore.createNewService(formData)
}
watch (
    () => serviceStore.newServiceResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
)

watch (
    () => serviceStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
        if (data) {
            campusList.value = data.data
        }
    },
    {deep: true}
)

</script>

<style scoped>
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>