<template>
        <form @submit.prevent="updateService">
          <div class="mb-2">
                <label class="text-sm"><small>School</small> <span class="star">*</span></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm" required
                        v-model="school_number"
                        @change="fetchCampuses(school_number)" >
                    <option disabled value="">Select School</option>
                    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="text-sm"><small>Campus</small>  <span class="star">*</span></label>

                <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

                    <li class="list-group-item" v-for="(lvl,idx) in campusList" :key="idx">
                        <input
                                v-model="formData.campus_numbers"

                                style="outline: none 0 !important; box-shadow: none;"
                                class="form-check-input me-1" type="checkbox" :value="lvl.number" :id="lvl.number">
                        <label class="form-check-label cursor-pointer ml-2" :for="lvl.number">{{lvl.name}}</label>
                    </li>

                </ul>
            </div>


          <div class="mb-2">
            <label class="text-sm"><small>Service Name</small></label>
            <input type="text" style="outline: none 0 !important;box-shadow: none;"
                required class="form-control form-select-sm" v-model="formData.name">
          </div>
            <div class="mb-2">
                <label class="text-sm"><small>Cost</small></label>
                <input v-model="formData.cost" style="outline: none 0 !important; box-shadow: none;" type="number"  required  class="form-control form-select-sm">
            </div>
            
            <div class="mb-2">
                <label class="text-sm"><small>Service is ?</small></label>
                <br/>
                <input type="radio" v-model="formData.mandatory" :value="true" >&nbsp; Mandatory  &nbsp;&nbsp;&nbsp;
                <input type="radio" v-model="formData.mandatory" :value="false">&nbsp; Optional
            </div>
            
            <div class="mb-2">
                <label class="text-sm"><small>Addition Info</small></label>
                <textarea v-model="formData.description" class="form-control "></textarea>
            </div>
            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button type="submit" class="btn btn-primary border-0"> <i class="bi bi-save"></i> Update
                    <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                        </span>
                </button>
            </div>
        </form>
   
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";

const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
let errorMessage = ref(null)
const schoolStore = useSchoolStore()

const campusStore = useCampusStore()
const campusList = ref([])
const schoolList = ref([])
const school_number = ref(null)

const props = defineProps({
    service:{}
})


const formData = reactive({
    description: null,
    cost: null,
    name:null
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


watch (
    () => props.service,
    async (data) => {
      if(data){
        formData.description = props.service.description
        formData.cost = props.service.cost
        formData.name = props.service.name
      }
    },
    {deep:true}
)

const updateService = () =>{
// alert(JSON.stringify(formData))
serviceStore.updateService(props.service.number,formData)
}

onMounted(
    () => {
      // serviceStore.fetchServicesList()
      buttonLoader.value = false
    }
)

watch(
    () => serviceStore.updateServiceResponse,
    async (data) => {
      if(data){
         notificationStore.successToast("Success", data.message)
       buttonLoader.value=false
       // await serviceStore.fetchServicesList()
      }
    },
    {deep:true}
)
watch (
    () => serviceStore.errorMessage,
    async (data) => {
      if(data){
   //error message
   //  notificationStore.errorToast("Error",data.message)
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