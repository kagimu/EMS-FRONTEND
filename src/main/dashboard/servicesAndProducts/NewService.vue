<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import useCommonsStore from "@/composables/useCommons.js";

const serviceStore= useServiceStore()
const  notificationStore  = useNotificationStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const commons = useCommonsStore()

const buttonLoader = ref(false)
let errorMessage = ref(null)
const campusList = ref([])
const schoolList = ref([])
const school_number = ref("")
const showDialog = ref(false)
const item_number = ref("")

const props = defineProps({
  serviceDetails:{},
  productType:String
})

const formData = reactive({
  school_number: null,
  description: null,
  cost: null,
  name:null,
  mandatory:false,
  prefix:false,
  campus_numbers:[],
  payment_mode:null

})

onMounted(() => {
      schoolStore.fetchSchools()
      checkDraftData()
    }
)

watch (
    () => props.serviceDetails,
    async (data) => {
      if(data){
        checkDraftData()
      }
    }
)

const checkDraftData = () => {
  let draft = props.serviceDetails
  if(draft){

    formData.description = draft?.Item?.description
    formData.cost = draft?.Item?.cost
    formData.name = draft?.Item?.name
    formData.mandatory = draft?.Item.mandatory
    formData.prefix = draft?.Item?.prefix
    formData.campus_numbers = draft?.Item?.campus_numbers ?? []
    formData.payment_mode = draft?.Item?.payment_mode
    formData.school_number = draft?.Item?.school_number
    item_number.value = draft?.Item?.number

  }
}


const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
}




const createNewService = () =>{
  buttonLoader.value = true

  if(props.productType === 'service') {
    if (item_number.value) {
      serviceStore.updateService(formData, item_number.value)
    } else {
      serviceStore.createNewService(formData)
    }
  }

  if(props.productType === 'product') {
    if (item_number.value) {
      serviceStore.updateProduct(formData, item_number.value)
    } else {
      serviceStore.createNewProduct(formData)
    }
  }


}
watch (
    () => serviceStore.newServiceResponse,
    async (data) => {
      if(data){
        showDialog.value = false
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
<template>

        <form @submit.prevent="createNewService">

          <div class="grid grid-cols-2 gap-4">

            <div>
              <div class="mb-2">
                <label class="textColor">School <span class="star">*</span></label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="formData.school_number"
                    @change="fetchCampuses(school_number)"
                >
                  <option disabled value="">--Select School--</option>
                  <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                  </option>
                </select>
              </div>


              <div class="mb-2">
                <label class="textColor mt-3 mb-2">Campus</label>

                <div v-if="(campusList && (campusList.length > 0))" class="max-h-[250px] overflow-y-scroll scrollbar-thin my-2 border rounded-md">
                  <ul class="list-group list-group-flush text-sm">
                    <li class="list-group-item" v-for="(camp,idx) in campusList">
                      <input
                          v-model="formData.campus_numbers"
                          class="form-check-input me-1 shadow-none cursor-pointer"
                          type="checkbox"
                          :value="camp.number"
                          :id="idx">
                      <label class="form-check-label cursor-pointer ml-2" :for="idx">{{camp.name}}</label>
                    </li>
                  </ul>
                </div>

              </div>
            </div>

            <div>

              <div class="mb-2">
                <label class="textColor">Service Name</label>
                <input  type="text" style="outline: none 0 !important;box-shadow: none;"
                        required class="form-control form-select-sm" v-model="formData.name">
              </div>

              <div class="mb-2">
                <label class="textColor">Serial Code</label>
                <input  type="text" style="outline: none 0 !important;box-shadow: none;"
                        required class="form-control form-select-sm" v-model="formData.prefix">
              </div>

              <div class="mb-2">
                <label class="textColor">Cost</label>
                <input
                    v-model="formData.cost"
                    @keypress="commons.onlyNumberValidator($event)"
                    maxlength="19"
                    style="outline: none 0 !important; box-shadow: none;"
                    type="text"
                    required
                    class="form-control form-select-sm">
              </div>


              <div class="mb-2">
                <label class="textColor">Service is ?</label>

                 <div class="flex">
                   <div class="mr-4">
                     <input v-model="formData.mandatory" class="cursor-pointer" type="radio" :value="true" name="flexRadioDefault" id="box1">
                     <label class="form-check-label ml-2 cursor-pointer" for="box1">
                       Mandatory
                     </label>
                   </div>
                   <div class="">
                     <input v-model="formData.mandatory" class="cursor-pointer" type="radio" :value="false" name="flexRadioDefault" id="box2">
                     <label class="form-check-label ml-2 cursor-pointer" for="box2">
                       Optional
                     </label>
                   </div>
                 </div>

              </div>

              <div class="mb-2">
                <label class="textColor">Addition Info</label>
                <textarea v-model="formData.description" class="form-control "></textarea>
              </div>
            </div>
          </div>



            <div class="flex justify-content-end mt-2">
                <button type="submit" class="btn btn-primary border-0 btn-sm">
                     <i class="bi bi-save"></i>
                     {{item_number ? "Edit":"Submit"}}
                    <span
                        style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                        v-if="buttonLoader"
                          role="status">
                          <span class="visually-hidden">Loading...</span>
                        </span>
                </button>
            </div>
        </form>
   
</template>



<style scoped>
.textColor{
    font-size: 11px !important;
}
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>