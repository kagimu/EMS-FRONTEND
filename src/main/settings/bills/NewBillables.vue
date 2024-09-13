<script setup>
import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue"
import useNotificationStore from "@/composables/useNotification.js"
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js"
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js"
import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
import useCommonsStore from "@/composables/useCommons.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import {useStudyModeStore} from "@/main/settings/mode-of-study/store/studyMode.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useBillStore} from "@/main/settings/bills/store/bills.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";

const commons = useCommonsStore()
const studentInfoList = ref( [])
const serviceStore= useServiceStore()
let errorMessage = ref(null)
const emit = defineEmits()
const  notificationStore  = useNotificationStore()
const isAddButtonDisabled = ref(false);
const classList = ref([])
const buttonLoader = ref(false)
const campus_level_number = ref("")

const academicYearList = ref([])
const studyPeriodList  = ref([])

const levelStore = useLevelStore()
const classStore = useClassesStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const modeStudyStore = useStudyModeStore()
const billStore = useBillStore()
const campusList = ref([])
const schoolList = ref([])
const campusLevelList = ref([])
const curriculumList = ref([])
const curriculumNumber = ref("")
const modeOfSchoolData  = ref([])
const academicYearStore = useAcademicYearStore()
const campusClassList = ref(null)
const studyPeriodStore = useStudyPeriodStore()


const props = defineProps({
  userNumber:String
})

const Services = ref([{ name: "", quantity: 1, cost: 0, amount: 0 }]);
const ServiceOptions = ref([])

const formData = reactive({
  description:null,
  class_number:"",
  mode_of_study_number:"",
  campus_number:"",
  study_period_number:"",
  bill_type:null,
  academic_year_number:"",
  school_number:""
})

onMounted(
    async () => {
      await serviceStore.fetchServicesList()
      await schoolStore.fetchSchools()
    
    } )


  const createBill = () => {
     buttonLoader.value=true

      const selectedItems = Services.value.map(
      service => ({
        item_number: service.number,
        quantity: parseInt(service.quantity),
        unit_cost: parseInt(service.cost)
      }))


    let data  = formData
    data.billable_items = selectedItems
    data.bill_status = "ACTIVE"


/*  let data = {
    description:formData.description,
   class_number:formData.class_number,
    mode_of_study_number:formData.mode_of_study_number,
    campus_number:formData.campus_number,
    study_period_number:formData.study_period_number,
    school_number:formData.school_number,
    bill_type:formData.type,
    billable_items:selectedItems,
    bill_status:"ACTIVE"
  }*/
//  alert(JSON.stringify(data))s
  billStore.newBillable(data)
}


const getModeOfStudyInfo = (schoolN) =>{
  let data = {
    school_number:schoolN,
  }
  modeStudyStore.fetchModeOfStudy(data)
}







function updateService(index) {
  const Service = Services.value[index];
  const selectedOption = ServiceOptions.value.find(option => option.item_number === Service.number);
  if (selectedOption) {
    Service.cost = selectedOption.cost;
    updateAmount(index);
  }
}

function updateAmount(index) {
  const Service = Services.value[index];
  Service.amount = Service.quantity * Service.cost;
}

function addService() {
  Services.value.push({ name: "", quantity: 1, cost: 0, amount: 0 });
}

function removeService(index) {
  Services.value.splice(index, 1);
}

function calculateTotal() {
  return Services.value.reduce((total, Service) => total + Service.amount, 0);
}

function availableOptions(index) {
  const selectedNames = Services.value.map(Service => Service.number);
  return ServiceOptions.value.filter(option => !selectedNames.includes(option.item_number) || option.item_number === Services.value[index].number);
}


watch(Services, (newServices) => {
  isAddButtonDisabled.value = newServices.length === ServiceOptions.value.length;
}, { deep: true });




watch(
    () => serviceStore.servicesListResponse,
    async (data) => {
      if (data) {
        ServiceOptions.value = data.map(option => ({ name: option.item.name, cost: option.item.cost,item_number:option.item.number }));
      }
    },
    { deep: true }
)


watch (
    () => billStore.errorMessage,
    async (data) => {
      if (data) {
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    { deep: true }
)


const studyPeriodData = (classN) => {
  studyPeriodStore.fetchStudyPeriod(
      {
        campus_curriculum_number:curriculumNumber.value,
        academic_year_number:formData.academic_year_number,
        class_number:classN,
        school_number:formData.school_number
      }
  )
}



watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)


const fetchCampuses = (school) => {
      campusStore.fetchCampuses(school)
      getModeOfStudyInfo(school)
  }
  
  const fetchCurriculum = (campus_number) => {
    levelStore.fetchCampusCurriculum(campus_number)
  }

  const fetchClassLevels = (campus_number) => {
    classStore.fetchCampusLevel(campus_number)
  }

  const fetchClasses = (campuslevelnumber) => {
    // classStore.fetchClassByLevel(campus_level_number)
    academicYearStore.fetchAcademicYearByLevel(campuslevelnumber)
    classStore.fetchClassLevel({campusCurriculumNumber: curriculumNumber.value, campusLevelNumber: campuslevelnumber})
    let data = {
    school_number:formData.school_number,
    campus_level_number:campuslevelnumber
  }
  campusStore.fetchClassesBySchool(data)
  
  }


  watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)


  
  watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        campusLevelList.value = data.data
      }
    }
)

watch (
    () => billStore.newBillableResponse,
    async (data) => {
      if (data) {
        notificationStore.successToast("Success", data.message)
        buttonLoader.value=false
      }
    },
    { deep: true }
)


watch(
    () => levelStore.campusCurriculumResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
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

  const fetchAcademicYear = (campusN) =>{
  academicYearStore.fetchAcademicYearByCampus(campusN)
  }

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
    () => academicYearStore.academicYearByLevelResponse,
    async (data) => {
      if(data){
        academicYearList.value = data.data
      }
    }
)



  watch(
    () => modeStudyStore.modeOfStudyInfoResponse,
    async (data) => {
      modeOfSchoolData.value = data.data
    },
    {deep: true}
)

</script>
<template>
  <div>
    <div class="row">
          <div class="card-body" style="padding: 0;">
            <div class="container mt-4">
              <form @submit.prevent="createBill">
                <div class="row">
                  <div class="col-lg-4">
                    <div class="mb-2">
            <label class="text-sm"><small>School</small></label>
         <select
                 style="box-shadow: none;"
                 class="form-select form-select-sm" required
                 v-model="formData.school_number"
                 @change="fetchCampuses(formData.school_number)"
         >
             <option disabled value="">-filter School -</option>
             <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
             </option>
         </select>
     </div>
                

     <div class="mb-2">
            <label class="text-sm"><small>Campus</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="formData.campus_number" required
              @change="fetchCurriculum(formData.campus_number)">
              <option disabled value="">Select campus</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}</option>
            </select>
        </div>   

        <div class="mb-2">
          <label class="text-sm"><small>Curriculum</small></label>
            <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
                v-model="curriculumNumber"  
                @change="fetchClassLevels(curriculumNumber)"                                         
            >
                <option disabled value="" >--Select Curriculum--</option>
                <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
            </select>
          </div>

        <div class="mb-2">
          <label class="text-sm"><small>Level</small></label>
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="campus_level_number"
                  @change="fetchClasses(campus_level_number)"
              >
                <option disabled value="">Select Level</option>
                <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
              </select>
            </div>

            <div class="mb-2">
            <label class="text-sm"><small>AcademicYear</small></label>
         
         <select
                 style="box-shadow: none;"
                 class="form-select form-select-sm" required
                 v-model="formData.academic_year_number"
         >
             <option disabled value="">-filter By AcademicYear</option>
            <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
         </select>
     </div>


            <div class="mb-2">
        <label class="text-sm"><small>Class</small></label>
        <select
            class="form-select form-select-sm shadow-none" required
            v-model="formData.class_number"
            @change="studyPeriodData(formData.class_number)">
          <option disabled value="">--Select Class--</option>
          <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
        </select>
      </div>


     <div class="mb-2">
      <label class="text-sm"><small>Study Period</small></label>
   <select
      style="box-shadow: none;"
      class="form-select form-select-sm" required
      v-model="formData.study_period_number"
      >
      <option disabled value="">filter by Study period -</option>
      <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>
   </select>
</div>

          <div class="mb-2">
            <label class="text-sm"><small>Mode Of Study</small></label>
          <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="formData.mode_of_study_number"
            >
          <option disabled value="">-filter by Study Mode-</option>
          <option v-for="(mode, indx) in modeOfSchoolData" :key="indx" :value="mode.mode_of_study_number">
          {{ mode.name }}
          </option>

          </select>
          </div>

          <div class="mb-2">
                <label class="text-sm">Type ?</label>

                 <div class="flex">
                   <div class="mr-4">
                     <input v-model="formData.bill_type" class="cursor-pointer" type="radio" value="CONTINUING" name="flexRadioDefault" id="box1">
                     <label class="form-check-label ml-2 cursor-pointer" for="box1">
                       Continuing
                     </label>
                   </div>
                   <div class="">
                     <input v-model="formData.bill_type" class="cursor-pointer" type="radio" value="NEW_APPLICATION" name="flexRadioDefault" id="box2">
                     <label class="form-check-label ml-2 cursor-pointer" for="box2">
                      New Application
                     </label>
                   </div>
                 </div>


          <div class="mb-2">
                    <label class="text-sm">Description</label>
                    <textarea
                        v-model="formData.description"
                        required
                        class="form-control shadow-none h-[4rem]"></textarea>
                  </div>

                  </div>
            </div>
                  <div class="col-lg-8">
                    <table class="table table-striped">
                      <thead>
                        <tr>
                          <th class="w-[1%]">#</th>
                          <th class="w-[50%]">Item</th>
                          <th class="w-[10%]">Qty</th>
                          <th class="w-[19%]">Unit Price</th>
                          <th class="w-[20%]">Amount</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="" v-for="(Service, index) in Services" :key="index" >
                          <td>{{(index + 1)}}</td>
                          <td>
                            <select
                                class="form-control shadow-none py-2"
                                v-model="Service.number" @change="updateService(index)">
                              <option disabled value="">--Select item--</option>
                              <option :value="option.item_number" v-for="option in availableOptions(index)">
                                {{ option?.name }} ({{ option?.cost?.toLocaleString() }})
                              </option>
                            </select>
                          </td>
                          <td>
                            <input class="form-control shadow-none py-2" maxlength="10"  required  type="text"
                             @keypress="commons.numbersOnlyValidator($event)" 
                              v-model="Service.quantity" 
                              @input="updateAmount(index)" placeholder="1.0" >
                            </td>
                          <td>
                            <!-- readonly -->
                            <input
                                type="text"
                                v-model="Service.cost"
                                @keypress="commons.numbersOnlyValidator($event)" 
                                @input="updateAmount(index)"
                                placeholder="Unit Price"
                                class="form-control shadow-none py-2" >
                          </td>
                          <td>{{ Service.amount?.toLocaleString() }}</td>
                          <td><button type="button" @click="removeService(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                        </tr>
                      </tbody>
                    </table>
                    <button
                        class="btn btn-primary btn-sm text-sm"
                        @click.prevent="addService"
                        :disabled="isAddButtonDisabled">
                        <small class="p-1">
                          <b><i class="bi bi-plus-lg" title="Add Item"></i> </b>
                        </small>
                    </button>
                    <div class="row mt-10">
                      <div class="col-lg-8"></div>
                      <div class="col-lg-4">
                        <ul style="float: right;">
                          <li>Total : <span style="color:rgba(173, 12, 12, 0.92)">{{ calculateTotal() }}</span> </li>
                        </ul>
                      </div>
                    </div>
                   

                  </div>

                </div>
               
              <div class="row mt-3">
        
                <div class="col-lg-12">
               
                
                </div>
              </div> 
              <hr>
              <div class="row">
             
             <div class="col-lg-4">
            
           </div>
           <div class="col-lg-4"></div>
           <div class="col-lg-4 ">
             <button type="submit" class="btn btn-sm btn-primary mb-2 mt-1" style="float: right !important;margin-right: 0px;">
               <small>Create Bill Data</small>
           <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader">
             <span class="visually-hidden">Loading...</span>
           </div>
         </button>
           </div>
          
           </div>
             </form>
            </div>
          </div>
         
        </div>
      
    </div>

</template>



<style>
.mb-8 {
  margin-bottom: 2rem;
  text-align: left;
  color: rgb(0, 0, 0);
  font-family: Roboto, sans-serif;
  font-size: 17px;
}
.mb-2 {
  text-align: left;
  color: rgb(0, 0, 0);
  font-family: Roboto, sans-serif;
  border-radius: 3px !important;
}
input{
  background-color: #f8f9fa;
  border-radius: 2px;
  /* font-size: 10px !important; */
}
select{
  background-color: transparent;
  border-radius: 2px;
  font-size: 10px !important;
}
.star{
  color:red;
}
.text-sm2{
  /* font-size: 1px !important; */
}
  .select-no-border {
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
  }
  .inp{
    border: none !important;
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important; 
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent !important;
  }

</style>
