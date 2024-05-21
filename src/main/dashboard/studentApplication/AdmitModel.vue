<template>
  <div>
    <!-- {{ selectedStudentNumber }} -->
    <form @submit.prevent="Admit()">
      <!-- School Selection -->
      <div class="row">
        <div class="col-lg-4">
          <div class="mb-2">
            <label class="textSize"><small>School</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.school_number"
              @change="fetchCampuses(form.school_number)">
              <option disabled value="">Select School</option>
              <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}</option>
            </select>
          </div>
    

   
          <div class="mb-2">
            <label class="textSize"><small>Campus</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="form.campus_number" required
              @change="fetchClasses(form.campus_number)">
              <option disabled value="">Select campus</option>
              <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}</option>
            </select>
          </div>
         
          <!-- Class Selection -->
        
          <div class="mb-2">
            <label class="textSize"><small>Class</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.campus_class_number"
              @change="fetchAcademicYear(form.campus_class_number)">
              <option disabled value="">Select class</option>
              <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}</option>
            </select>
          </div>
       
        <!-- Stream, Academic Year, and Study Period Selection -->
  
          <div class="mb-2">
            <label class="textSize"><small>Stream</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.stream_number">
              <option disabled value="">Select Stream</option>
              <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}</option>
            </select>
          </div>
     

          <div class="mb-2">
            <label class="textSize"><small>Academic Year</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.academic_year_number">
              <option disabled value="">Select Year</option>
              <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
            </select>
          </div>
        

      
          <div class="mb-2">
            <label class="textSize"><small>Study Period</small></label>
            <select
              style="box-shadow: none;"
              class="form-select form-select-sm" required
              v-model="form.study_period_number">
              <option disabled value="">Select</option>
              <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
            </select>
          </div>
        </div>
      
    
    
      <!-- Service Selection -->
        <div class="col-lg-8">
          <div class="row">
              <!-- New Design -->
              <label>
            Requirement/Items
              </label>
              <table class="table table-hover caption-top mt-1 ">
                <thead>
                  <tr class="" style="padding: 0px;margin: 0px;font-size: 13px;">
                    <th class="textSize">Item</th>
                    <th class="textSize">Cost</th>
                    <th>Quantity</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(Service, index) in Services" :key="index">
                    <td>
                      <select class="form-select form-select-sm form-control select-no-border" v-model="Service.number" @change="updateService(index)">
                        <!-- <option :value="option.item_number" v-for="option in availableOptions(index)">{{ option.name }}</option> -->
                        <option :value="option.item_number" v-for="option in availableOptions(index)" :key="option.item_number">{{ option.name }}</option>
                      </select>
                    </td>
                    <td><input class="form-control" style="border: 0px; background-color: white;" disabled type="text" v-model="Service.cost" @input="updateAmount(index)" placeholder="Unit Price"></td>
                    <td><input class="form-control"  style="width: 50px; font-size: 14px; text-align: center;"  @keypress="commons.numbersOnlyValidator($event)" maxlength="10" type="text" v-model="Service.quantity"></td>
                    <td><button type="button" @click="removeService(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                  </tr>
                </tbody>
              </table>
              <button style="width: 30px;" class="btn btn-primary btn-sm textSize" @click.prevent="addService" :disabled="isAddButtonDisabled"><small><i class="bi bi-plus-lg"></i></small></button>
            </div>
         
        </div>
      </div>
      <!-- Form Submission Button -->
      <div class="flex justify-content-end mt-2" style="width: 100%;">
        <button type="submit" class="btn btn-primary border-0 btn-sm mb-2">
          <small> submit</small>
          <span style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span></span>
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
  import {onMounted, reactive, ref, watch, watchEffect, computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import {useServiceStore} from "@/main/dashboard/servicesAndProducts/store/service.js"
  import {useInvoiceStore} from "@/main/dashboard/invoice/store/invoice.js"
  import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
  import {useRouter} from "vue-router"
  import useCommonsStore from "@/composables/useCommons.js";
  
  const commons = useCommonsStore()
  const routerData = useRouter()
  
  const  notificationStore  = useNotificationStore()
  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const school_number = ref(null)
  const buttonLoader = ref(false)
  const assessmentStore = useAssessmentStore()
  const errorMessage = ref(null)
  // const academicData = ref([])
  const academicYearStore = useAcademicYearStore()
  const academicYearList = ref([])
  const studyPeriodList  = ref([])
  const admissionStore = useAdmissionStore()
  const classStore = useClassesStore()
  const streamList = ref([])
  
  const studentNumber = "";
  const interviewNumber = routerData.currentRoute.value.query.interview_id;
  const student_number = ref([])
  
    const props = defineProps({
      selectedStudentNumber:[]
    })  
    watch (
      () => props.selectedStudentNumber,
      async (data) => {
        if(data){
          student_number.value = props.selectedStudentNumber
        }
      },
      {deep:true}
  )
  
  const form = reactive({
  student_number,
  academic_year_number: null,
  study_period_number: null,
  campus_class_number: null,
  campus_number: null,
  interview_number:interviewNumber,
  stream_number:null,
  school_number:null
  })
  
  watch (
    () => admissionStore.admitStudentResponse,
    async (data) => {
      if(data){
      form.academic_year_number=null,
      form.study_period_number=null,
      form.campus_class_number=null,
      form.campus_number- null,
      form.interview_number=interviewNumber,
      form.stream_number=null,
      form.school_number=null
      buttonLoader.value=false
      }
    },
    {deep:true}
  )
  
  watch (
    () => admissionStore.errorMessage,
    async (data) => {
      if(data){
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
      }
    },
    {deep:true}
  )
  
  
  const fetchCampuses = (school_number) => {
      campusStore.fetchCampuses(school_number)
  }
  
  const fetchClasses = (campus_number) => {
      campusStore.fetchClassesByCampus(campus_number)
  }
  
  
  const fetchAcademicYear = (campusN) =>{
  academicYearStore.fetchAcademicYearByCampus(campusN)
  classStore.fetchClassStreams(campusN)
  
  }
  watch(
      () => academicYearStore.academicYearByCampusResponse,
      async (data) => {
          if (data) {
            academicYearList.value = data.data
  
            if(data && data.data){
          let studyData = data.data
          if(studyData && (studyData.length > 0)){
            studyPeriodList.value = studyData[0].studyPeriod
          }
        }
          }
      },
      {deep: true}
  )
  
  
  
  watch(
      () => classStore.classStreams,
      async (data) => {
          if (data) {
            streamList.value = data.data
          }
      },
      {deep: true}
  )
  
  
  
  
  onMounted(() => {
          schoolStore.fetchSchools()
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
              campusList.value = data.data
          }
      },
      {deep: true}
  )
  
  watch(
      () => campusStore.campusClassesResponse,
      async (data) => {
          if (data) {
              classList.value = data.data
          }
      },
      {deep: true}
  )
  
  watch(
      () => campusStore.errorMessage,
      async (data) => {
            if (data) {
                notificationStore.errorToast("Error", data.message)
            }
      },
      {deep: true}
  )
  
  const studentInfoList = ref( [])
  const serviceStore= useServiceStore()
  const  invoiceStore  = useInvoiceStore()
  const router = useRouter()
  const applicationStore= useApplicationStore()
  
  const goBack = () => {
    window.history.back()
  }
  
  // Creating invoice Logic =========================================================
  const Services = ref([]);
  const ServiceOptions = ref([])
  
  onMounted(
      async () => {
        await applicationStore.fetchApplicationList()
      } )
  
      watch(
      () => applicationStore.applicationListResponse,
      async (data) => {
        if(data){
          studentInfoList.value = data.data
         
        }
      },
      {deep:true}
      )
  
  
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
    Services.value.push({ name: '', quantity: 1, cost: 0, amount: 0 });
  }
  
  function removeService(index) {
    Services.value.splice(index, 1);
  }
  
  function calculateTotal() {
    return Services.value.reduce((total, Service) => total + Service.amount, 0);
  }
  
  // function availableOptions(index) {
  //   const selectedNames = Services.value.map(Service => Service.number);
  //   return ServiceOptions.value.filter(option => !selectedNames.includes(option.name) || option.item_number === Services.value[index].number);
  // }
  
  function availableOptions(index) {
  const selectedNumbers = Services.value.map((Service) => Service.number);
  return ServiceOptions.value.filter(
    (option) =>
      !selectedNumbers.includes(option.item_number) ||
      option.item_number === Services.value[index].number
  );
}

  onMounted(
    async () => {
      await serviceStore.fetchAllItems()
    } )
  
  watch(
    () => serviceStore.allItemsListResponse,
    async (data) => {
      if (data) {
        ServiceOptions.value = data.map(option => ({ name: option.name, cost: option.cost,item_number:option.number }));
      }
    },
    { deep: true }
  )
  
  const Admit = () =>{
      buttonLoader.value = true
      const itemNumbers = Services.value.map(service => service.number);
      // const items = { items: itemNumbers };
  
      const items = Services.value.map(service => ({
    item_number: service.number,
    quantity: parseInt(service.quantity)
  }));

    const data = {
      student_number:props.selectedStudentNumber,
      academic_year_number: form.academic_year_number,
      study_period_number: form.study_period_number,
      campus_class_number: form.campus_class_number,
      school_number:form.school_number,
      campus_number: form.campus_number,
      interview_number:interviewNumber,
      stream_number:form.stream_number,
      items
    }
   
    // alert(JSON.stringify(data))
    admissionStore.admitStudent(data)
  }
  
</script>
<style scoped>
  .noFocus:focus {
  outline: none 0 !important;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  }
  .textSize{
    font-size: 12px;
  }
</style>