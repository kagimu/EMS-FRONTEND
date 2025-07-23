<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import useCommonsStore from "@/composables/useCommons.js";
import ComboBox from "@/components/ComboBox.vue";

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
const formattedCost = ref('');

const props = defineProps({
  serviceDetails:{},
  productType:String
})

const formData = reactive({
  code: null,
  school_number: "",
  description: null,
  cost: null,
  name:null,
  mandatory:false,
  serial_code:null,
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
  //  alert(JSON.stringify(draft))
    formData.description = draft?.item?.description ?? null
    formData.cost = draft?.item?.cost ?? null
    formData.name = draft?.item?.name ?? null
    formData.mandatory = draft?.item.mandatory
    formData.serial_code = draft?.item?.serial_code
    formData.payment_mode = draft?.item?.payment_mode
    formData.school_number = draft?.item?.school_number ?? ""
    item_number.value = draft?.item?.number

    formattedCost.value = draft?.item?.cost.toLocaleString();

    if(draft?.item?.school_number) {
      fetchCampuses(draft?.item?.school_number)
    }
    if(draft?.campus_services){
      formData.campus_numbers = draft.campus_services.map(service => service.campus_number)
    }
  }
}


const fetchCampuses = (school_number) => {
  if(school_number) {
    campusStore.fetchCampuses(school_number)
  }
}

const fetchClasses = (campus_number) => {
  campusStore.fetchClassesByCampus(campus_number)
}



function updateCosts(event) {
  const rawValue = event.target.value.replace(/,/g, '');
  formattedCost.value = Number(rawValue).toLocaleString();
  formData.cost = rawValue;

}


const updateCost = () => {
  const rawValue = event.target.value.replace(/,/g, '');
  const numericValue = parseFloat(formattedCost.value)
  formattedCost.value = Number(rawValue).toLocaleString();
  // Strip non-numeric characters (optional, based on your formatting needs)
  if (isNaN(numericValue)) {
    return
  }

  if (numericValue === 0) {
    const confirmed = confirm("Are you sure you want to set the cost to 0?")
    if (!confirmed) {
      formattedCost.value = ''
    }
  }


  formData.cost = rawValue;
}



const createNewService = () =>{
  buttonLoader.value = true

  let data = formData
  data.cost = parseInt(formData.cost)
  data.code = parseInt(formData.code)

  if(props.productType === 'service') {
    if (item_number.value) {
      serviceStore.updateService(data, item_number.value)
    } else {
      serviceStore.createNewService(data)
    }
  }

  if(props.productType === 'product') {
    if (item_number.value) {
      serviceStore.updateProduct(data, item_number.value)
    } else {
      serviceStore.createNewProduct(data)
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
    () => serviceStore.updateServiceResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)

watch (
    () => serviceStore.updateProductResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      }
    }
)


watch (
    () => serviceStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        buttonLoader.value = false
      }
    }
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
        // campusList.value = data.data
        campusList.value = []
       // formData.campus_numbers = []
        let draft = data.data
        if (draft) {
          if(draft && (draft.length > 0)){
            let arr = []
            draft.forEach(lst => {
              arr.push({text:lst?.name,value:lst?.number})
            })
            campusList.value = arr
          }
        }
      }
    },
    {deep: true}
)





</script>
<template>
        <form @submit.prevent="createNewService">

          <div class="grid grid-cols-2 gap-4 text-gray-600">

            <div>

              <div class="mb-2">
                <label class="text-sm">Code</label>
                <input
                    @keypress="commons.codeValidator($event)"
                    maxlength="10"
                    type="text"
                    v-model="formData.code"
                    @paste.prevent
                    required
                    class="form-control form-control-sm shadow-none">
              </div>

              <div class="mb-2">
                <label class="text-sm">School <span class="star">*</span></label>
                <select
                    style="box-shadow: none;"
                    class="form-select form-select-sm" required
                    v-model="formData.school_number"
                    @change="fetchCampuses(formData.school_number)"
                >
                  <option disabled value="">--Select School--</option>
                  <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                  </option>
                </select>
              </div>


              <div class="mb-2">
                <label class="text-sm">Campus</label>

                <combo-box
                    v-model:optionResponse="formData.campus_numbers"
                    :optionList="campusList"
                    :optionDraft="formData?.campus_numbers"
                ></combo-box>
              </div>


              <div class="mb-2">
                <label class="text-sm">Name</label>
                <input  type="text" style="outline: none 0 !important;box-shadow: none;"
                        required class="form-control form-select-sm" v-model="formData.name">
              </div>

              <div class="mb-2">
                <label class="text-sm">Serial Code</label>
                <input  type="text" style="outline: none 0 !important;box-shadow: none;"
                        required class="form-control form-select-sm" v-model="formData.serial_code">
              </div>


            </div>

            <div>



              <div class="mb-2">
                <label class="text-sm">Cost</label>
                <input
                     v-model="formattedCost"
                  @input="updateCost"
                    @keypress="commons.onlyNumberValidator($event)"
                    maxlength="19"
                    style="outline: none 0 !important; box-shadow: none;"
                    type="text"
                    required
                    class="form-control form-select-sm">
              </div>


              <div class="mb-2">
                <label class="text-sm" v-if="productType === 'service'">Service is ?</label>
                <label class="text-sm" v-else >Product is ?</label>

                 <div class="flex">
                   <div class="mr-4">
                     <input v-model="formData.mandatory" class="cursor-pointer" type="radio" :value="true" name="flexRadioDefault" id="box1">
                     <label class="form-check-label ml-2 cursor-pointer text-sm text-gray-600" for="box1">
                       Mandatory
                     </label>
                   </div>
                   <div class="">
                     <input v-model="formData.mandatory" class="cursor-pointer" type="radio" :value="false" name="flexRadioDefault" id="box2">
                     <label class="form-check-label ml-2 cursor-pointer text-sm text-gray-600" for="box2">
                       Optional
                     </label>
                   </div>
                 </div>

              </div>

              <div class="mb-2">
                <label class="text-sm">Addition Info</label>
                <textarea
                    v-model="formData.description"
                    style="font-size: 12px; color: #4e5866;"
                    class="form-control shadow-none"
                    rows="4"
                ></textarea>
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
.text-sm2{
    font-size: 11px !important;
}
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>