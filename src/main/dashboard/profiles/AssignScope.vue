<script setup>
  import {onMounted,reactive, ref, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
  import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
  import {useAssessmentStore} from "@/main/dashboard/assessment/store/assessment.js"
  import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
  import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
  import {useLevelStore} from "@/main/settings/level/store/level.js";
  import {useScopeStore} from "@/main/dashboard/profiles/store/scope.js";
  import { useAbility } from '@casl/vue';
  const { can } = useAbility()

  const levelStore = useLevelStore()
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const  notificationStore  = useNotificationStore()
  const studentNum=ref(null)
  const studentData = ref([])
  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const school_number = ref(null)
  const academicYearStore = useAcademicYearStore()
  const academicYearList = ref([])
  const studyPeriodList  = ref([])
  const classStore = useClassesStore()
  const streamList = ref([])
  const curriculumList = ref([])
  const levelList = ref([])
  const scopeStore = useScopeStore()
  
  onMounted(() => {
    schoolStore.fetchSchools()
   }
  )

  const props = defineProps({
    user_number:String
  })
  
  const form = reactive({
  study_period_number: "",
  campus_class_number: "",
  campus_number: "",
  stream_number:"",
  school_number:"",
  academic_year_number:"",
  curriculumNumber:"",
  level:""
  })
  

  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)

}
  



  const fetchClasses = (campus_number) => {
    campusStore.fetchClassesByCampus(campus_number)
    levelStore.fetchCampusCurriculum(campus_number)
  }

  const fetchAcademicYear = (campusN) =>{
  academicYearStore.fetchAcademicYearByCampus(campusN)
  classStore.fetchClassStreams(campusN)
  }

  const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
}



const fetchLevelClasses = (levelNumber) => {
   classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
}

const assignRolePlease = () =>{
  let data = {
  campus_number:form.campus_number,
  school_number:form.school_number,
  curriculum_number:form.curriculumNumber,
  class_number:form.campus_class_number,
  stream_number:form.stream_number,
  user_number:props.user_number
}
alert(JSON.stringify(data))
scopeStore.createNewScope(data)
}

watch (
      () => scopeStore.newScopeResponse,
      async (data) => {
        if(data){
          buttonLoader.value = false
          notificationStore.successToast("Success", data.message)
        }
      },
      {deep:true}
  )

watch(
    () => scopeStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )

watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        classList.value = data.data
      }
    },
    {deep:true}
)
watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data ///---------------
      }
    },
    {deep:true}
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
    () => campusStore.errorMessage,
    async (data) => {
          if (data) {
              notificationStore.errorToast("Error", data.message)
          }
    },
    {deep: true}
  )
  

</script>
<template>

  <div>
     <!-- end  -->
       
            <div class="row">
                <div class="col-12">
                    <div class="mt-4">
                        <div class="row mx-auto">
                        <div class="row">
                            <form @submit.prevent="assignRolePlease()">
                          
                                <div class="mb-2">
                                    <!-- <label class="textColor"><small>School</small> </label> -->
                                    <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm" required
                                    v-model="form.school_number"
                                    @change="fetchCampuses(form.school_number)"
                                    >
                                    <option disabled  value="">-Select School-</option>
                                    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                                    </option>
                                    </select>
                                    
                                </div>
                           
                                <div class="mb-2">
                                    <!-- <label class="textColor"><small>Campus</small>  </label> -->
                                    <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm"
                                    v-model="form.campus_number" required
                                    @change="fetchClasses(form.campus_number)"
                                    >
                                    <option disabled value="">-Select Campus-</option>
                                    <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                                    </option>
                                    </select>
                                </div>
                           
                            <div class="mb-2">
                            <select
                            style="box-shadow: none;"
                            class="form-select form-select-sm"
                                v-model="form.curriculumNumber"  
                                @change="fetchCampusLevel(form.curriculumNumber)"                                         
                            >
                                <option disabled value="" >--Select Curriculum--</option>
                                <option  v-for="(lvl, index) in curriculumList" :key="index" :value="lvl.number">{{lvl.name}}</option>
                            </select>
                            </div>

                           
                            <div class="mb-2">
                                <select
                                style="box-shadow: none;"
                                class="form-select form-select-sm"
                                    v-model="form.level"
                                    @change="fetchLevelClasses(form.level)"
                                >
                                    <option disabled value="">-Select level-</option>
                                    <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
                                </select>
                                
                            </div>
                          
                                <div class="mb-2">
                                <!-- {{ classList }} -->
                                    <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm" required
                                    v-model="form.campus_class_number"
                                    @change="fetchAcademicYear(form.campus_class_number)"
                                    >
                                    <option disabled value="">-Select class-</option>
                                    <template v-for="(classItem, index) in classList" :key="index">
                                    <option v-for="(classDetail, indx) in classItem.classes" :key="indx" :value="classDetail.number">
                                    {{ classDetail.name }}
                                    </option>
                                    </template>
                                    </select>
                                </div>
                            
                                <div class="mb-2">
                                    <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm" required
                                    v-model="form.stream_number"
                                    >
                                    <option disabled value="">-Select Stream-</option>
                                    <option v-for="(slist, index) in streamList" :key="index" :value="slist.number">{{ slist.name }}
                                    </option>
                                    </select>
                                </div>
                           
                                <!-- <div class="mb-2">
                                    <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm" required
                                    v-model="form.academic_year_number"
                                    >
                                    <option disabled value="">-Select AcademicYear-</option>
                                    <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                                    </select>
                                </div> -->
                            
<!--                             
                                <div class="mb-2">

                                    <select
                                    style="box-shadow: none;"
                                    class="form-select form-select-sm" required
                                    v-model="form.study_period_number"
                                    >
                                    <option disabled value="">- Select Study period -</option>
                                    <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.number">{{ studyPeriod.study_period_name }}</option>
                                    </select>
                                </div> -->

                                <div class="mb-2">
                                 <div class="row">
                                    <div class="col-8">

                                    </div>
                                    <div class="col-4">
                                        <button style="float: right;" type="submit" class="btn btn-primary">Submit</button>
                                    </div>

                                 </div>
                                </div>
                               </form>

                        </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
    
            
</template>

<style scoped>
</style>