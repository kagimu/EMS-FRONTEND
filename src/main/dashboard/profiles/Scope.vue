<script setup>
    import {onMounted, reactive, ref, watch,defineEmits} from "vue";
    import {useRouter} from "vue-router";
    import useCommonsStore from "@/composables/useCommons.js";
    import useNotificationStore from "@/composables/useNotification.js";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
    import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
    import {useCurriculumStore} from "@/main/dashboard/curriculum/curriculumSetup/store/curriculum.js";
    import {useLevelStore} from "@/main/settings/level/store/level.js";
    import {useScopeStore} from "@/main/dashboard/profiles/store/scope.js";

    const props = defineProps({
    user_number:String
   })

    const classError = ref(null)
    const loader = ref(false)
    const commons = useCommonsStore()
    const  notificationStore  = useNotificationStore()
    const levelNumber = ref("")
    const curriculumList = ref([])
    const campusList = ref([])
    const schoolList = ref([])
    const classList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const school_number = ref(null)
    const academicYearStore = useAcademicYearStore()
    const classStore = useClassesStore()
    const student_num = ref(null)
    const campus_class_number = ref(null)
    const academicYearList = ref([])
    const curriculumStore = useCurriculumStore()
    const curriculum_number = ref(null)
    const levelList = ref([])
    const levelStore = useLevelStore()
    const level = ref(null)
    const scopeStore = useScopeStore()
    const campus_number = ref(null)
    const current_academic_year_number = ref(null)


    onMounted(() => {
          schoolStore.fetchSchools()
          curriculumStore.fetchCurriculum()
      }
    )
    

    const form = reactive({
      school_number:null
       })
    
       const fetchLevels = (curriculumNumber) => {
      levelStore.fetchCurriculumLevels(curriculumNumber)
      let data = reactive(
        {
        added_by_number:props.user_number,
        curriculum_number:curriculumNumber
        }
      )
      scopeStore.createNewCurriculumScope(data)
    }


    const levelScope = (levelN) =>{
        let data = reactive(
        {
        added_by_number:props.user_number,
        level_number:levelN
        }
      )
        scopeStore.createNewLevelScope(data)
    }
    
    const fetchCampuses = (school_number) => {
        let data = reactive(
        {
        added_by_number:props.user_number,
        school_number:school_number
        }
      )
        scopeStore.createNewSchoolScope(data)
      campusStore.fetchCampuses(school_number)
    }
    
    const fetchClasses = (campus_number) => {
        let data = reactive(
        {
        added_by_number:props.user_number,
        campus_number:campus_number
        }
      )
      scopeStore.createNewCampusScope(data)
      campusStore.fetchClassesByCampus(campus_number)
    }

    const academicYearScope = (current_academic_year_number) => {
        let data = reactive(
        {
        added_by_number:props.user_number,
        learning_area_number:current_academic_year_number
        }
      )
        scopeStore.createNewAcademicYearScope(data)
      campusStore.fetchClassesByCampus(campus_number)
    }

    
    //fetchacadmicYear
    const fetchAcademicYear = (classN) =>{
        let data = reactive(
        {
        added_by_number:props.user_number,
        class_number:classN
        }
      )
        scopeStore.createNewClassScope(data)

    academicYearStore.fetchAcademicYearByCampus(classN)
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
 
    watch(
    () => curriculumStore.curriculumDataResponse,
    async (data) => {
      if(data){
        curriculumList.value = data.data
      }
    },
    {deep:true}
)

watch(
  () => levelStore.curriculumLevelInfoResponse,
  async (data) => {
    if(data){
      levelList.value = data.data
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
    () => scopeStore.newCurriculumScopeResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
    )
    
    watch(
    () => scopeStore.newLevelScopeResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
    )


    watch(
    () => scopeStore.newCampusScopeResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
    )

    watch(
    () => scopeStore.newClassScopeResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
    )
    watch(
    () => scopeStore.newAcademicYearScopeResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
    )
    watch(
    () => scopeStore.newLevelSchoolResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success", data.message)
      }
    },
    {deep:true}
    )


 </script>

<template>
    <div>
        <!-- {{  user_number }} -->
       <form @submit.prevent="">
          <div class="mb-2">
             <label class="textColor"><small>Curriculum</small> </label>
             <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="curriculum_number"
                @change="fetchLevels(curriculum_number)"
                >
                <option disabled value="">All</option>
                <option v-for="(list, index) in curriculumList" :key="index" :value="list.number">{{ list.name }}
                </option>
             </select>
          </div>

          <div class="mb-2">
             <label class="textColor"><small>Level</small> <span class="star">*</span></label>
                 <select
                     style="box-shadow: none;"
                     class="form-select form-select-sm"
                     v-model="level"
                     @change="levelScope(level)">
                   <option disabled value="">All</option>
                   <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.level_number">{{lvl.code+". "+lvl.name}}</option>
                 </select>
             </div>

          <div class="mb-2">
             <label class="textColor"><small>School</small> </label>
             <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="form.school_number"
                @change="fetchCampuses(form.school_number)"
                >
                <option disabled value="">All</option>
                <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                </option>
             </select>
          </div>
          <div class="mb-2">
             <label class="textColor"><small>Campus</small>  </label>
             <select
                style="box-shadow: none;"
                class="form-select form-select-sm"
                v-model="campus_number" required
                @change="fetchClasses(campus_number)"
                >
                <option disabled value="">All</option>
                <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                </option>
             </select>
          </div>
          <div class="row">
             <div class="col-lg-12">
                <div class="mb-2">
                   <label class="textColor"><small>Class</small> </label>
                   <select
                      style="box-shadow: none;"
                      class="form-select form-select-sm" required
                      v-model="campus_class_number"
                      @change="fetchAcademicYear(campus_class_number)"
                      >
                      <option disabled value="">All</option>
                      <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">{{ claslist.class_name }}
                      </option>
                   </select>
                </div>
             </div>
          </div>
          <div class="mb-2">
             <label class="textColor"><small>Current Academic Year</small> </label>
             <select
                style="box-shadow: none;"
                class="form-select form-select-sm" required
                v-model="current_academic_year_number"
                @change="academicYearScope(current_academic_year_number)"
                >
                <option disabled value="">All</option>
                <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
             </select>
          </div>
       </form>
    </div>
 </template>
 
 <style scoped>
    .noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    }
 </style>