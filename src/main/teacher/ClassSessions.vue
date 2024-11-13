<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
import {useLevelStore} from "@/main/settings/level/store/level.js";
import { useAbility } from '@casl/vue';
import {useLearningAreaStore} from "@/main/dashboard/curriculum/curriculumSetup/lerningArea/store/learningArea.js";
import useCommonsStore from "@/composables/useCommons.js";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import {useSubjectStore} from "@/main/dashboard/curriculum/curriculumSetup/subject/store/subject.js";
import AppModal from "@/components/AppModal.vue";
import StudentsInASession from "@/main/teacher/StudentsInASession.vue"
  
  const levelStore = useLevelStore()
  const  notificationStore  = useNotificationStore()
  const schoolStore = useSchoolStore()
  const campusStore = useCampusStore()
  const classStore = useClassesStore()
  const schemeOfWorkStore = useSchemeOfWorkStore();

  const { can } = useAbility()
  const campusList = ref([])
  const schoolList = ref([])
  const classList = ref([])
  const curriculumList = ref([])
  const levelList = ref([])

const academicYearList = ref([])
const commons = useCommonsStore()
const subjectStore = useSubjectStore()
const streamListData = ref([])
const page = ref(1)
const per_page = ref(20)
const uploadDialog = ref(false)
const total_items = ref(0)
const total_rows = ref(0)
let classNo = ""
const sessionListData = ref([])
 

if(classNo){
  selectedClass.value =  form.class_number
}


  onMounted(() => {
    schoolStore.fetchSchools()
    dofetchSessions()
   }
  )


  const form = reactive({
  class_number: "",
  campus_class_number: "",
  campus_number: "",
  school_number:"",
  curriculumNumber:"",
  level:"",
  stream_number:""
  })
  
  
  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
  }
  
  const fetchClasses = (campus_level_number) => {
    levelStore.fetchCampusCurriculum(campus_level_number)
  }
  

  const fetchCampusLevel = (curriculumNumber) => {
   classStore.fetchCampusLevel(curriculumNumber)
  }
  
  const fetchLevelClasses = (levelNumber) => {
    classStore.fetchClassLevel({campusCurriculumNumber: form.curriculumNumber, campusLevelNumber: levelNumber})
  }
  
  watch(
    () => classStore.campusLevelResponse,
    async (data) => {
      if(data){
        levelList.value = data.data
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
  


const fetchAcademicYrList = (classNumber) => {
  subjectStore.fetchAcademicYearByClass(classNumber)
}

watch(
    () => subjectStore.academicYearByClassResponse,
    async (data) => {
      if(data){
        let acd = data.data

        academicYearList.value = acd

      }
    },
    {deep:true}
)


watch(
    () => classStore.classLevelInfoResponse,
    async (data) => {
      if(data){
        let classInfo = data.data[0].classes
        classList.value = classInfo
      }
    },
    {deep:true}
)

const getStreams = (classN) => {
    alert(classN)

    subjectStore.fetchAcademicYearByClass(classN)

    const classObj = classList.value.find(cls => cls.number === classN)
    streamListData.value = classObj.streams
    alert(JSON.stringify(streamListData.value))
    return classObj.streams

  }

  const dofetchSessions = () => {
      let data = {
        page: 1,
        per_page: per_page.value,
        stream_number:form.stream_number
      }
      schemeOfWorkStore.fetchClassSessions(data)
  }


  function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      stream_number:form.stream_number
    }
    schemeOfWorkStore.fetchClassSessions(data)
  }
}


const fetchSessionList = (data) => {
  if(data) {
    let current_page = data.page
    page.value = current_page
  
    let per_page_item = data.per_page;
    per_page.value = per_page_item;

    let objArray = data.content

    let count_items = (current_page * per_page_item)
    let totalItems = data?.total_rows


    if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
      objArray.forEach((list, i) => {

        list.key =  (current_page - 1) * per_page_item + i + 1

        const index = sessionListData.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          sessionListData.value.push(list);
        }
      })
    }

  }
}

const filterByStream = () => {
 dofetchSessions()
}

watch (
    () => schemeOfWorkStore.classSessionResponse,
    async (data) => {
      if(data){
        fetchSessionList(data)
      }
    },
    {deep:true}
)

const viewStudentModal = ref(false)
const session_number = ref(null)

const openViewStudents = (number) => {
  session_number.value = number
  viewStudentModal.value = true
}

</script>
<template> 

<AppModal v-model="viewStudentModal"  title="Students In A Class Session" xl4>
   <StudentsInASession :sessionNumber="session_number"></StudentsInASession>
</AppModal>

  <div class="bg-white  rounded-md py-3 px-2">
    <div class="row mt-1">
      <div class="col-lg-11">
        <h5 style="font-size: 14px;margin-top: 2px;">Class Sessions</h5>
      </div>
      <div class="col-lg-1">
        
        </div>
    </div>
    <div class="row">
      <div class="col-3">
        <div class="mb-2">
          <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="form.school_number"
            @change="fetchCampuses(form.school_number)"
            >
            <option disabled  value="">-filter by School-</option>
            <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-3">
        <div class="mb-2">
          <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.campus_number" required
            @change="fetchClasses(form.campus_number)"
            >
            <option disabled value="">-filter by Campus-</option>
            <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="col-2">
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
      </div>
      <div class="col-2" >
        <div class="mb-2">
          <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="form.level"
            @change="fetchLevelClasses(form.level)"
            >
            <option disabled value="">-Filter by level-</option>
            <option v-for="(lvl, index) in levelList" :key="index" :value="lvl.number">{{lvl.code+". "+lvl.name}}</option>
          </select>
        </div>
      </div>
      <div class="col-2">
        <div class="mb-2">
          <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="form.class_number"
            @change="getStreams(form.class_number)"
            >
            <option disabled value="">-filter by class-</option>
            <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
              {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
            </option>
          </select>
        </div>
      </div>
      <div class="col-2">
        <div class="mb-2">
        <select
            v-model="form.stream_number"
            class="form-select form-select-sm" required
            style="box-shadow: none;"
            @change="filterByStream()"
            >
            <option disabled value="">-Filter By Stream-</option>
            <option v-for="(slist, index) in streamListData" :key="index" :value="slist.stream_number">{{ slist.name }}
            </option>
        </select>
        </div>
      </div>

  
      <PaginationTemplate
                  v-model:perPage="per_page"
                  :per_page="per_page"
                  :total_items="total_items"
                  :total_rows="total_rows"
                  @perPageChanged="dofetchSessions"></PaginationTemplate>

              <div>
                <div
                    class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                    @scroll="onScroll">
                  <table
                      class="table table-hover caption-top mt-4 table-sm table-striped"
                      style="font-size: 13px !important;"
                  >
                    <thead >
                    <tr>
                      <th style="">Date</th>
                      <th style="">Time</th>
                      <th style="">Lesson Plan Step</th>
                      <th style="">Teacher</th>
                      <th>comment</th>
                      <th>#</th>
                    </tr>

                    </thead>
                    <tbody>
                
                    <tr v-for="(listData,index) in sessionListData" :key="index" >
                      <td>{{listData.date}}</td>
                      <td>{{listData.time}}</td>
                      <td>{{listData.lesson_plan_step_number}}</td>
                      <td style="text-transform:capitalize">{{listData.teacher	}}</td>
                     <td>{{ listData.comment }}</td>
                     <td>
                      <button class="btn btn-primary btn-sm" ><small @click="openViewStudents(listData.number)">View Students</small></button>
                     </td>
                    </tr>

                    </tbody>
                  </table>
                </div>
              </div>
            </div>
    </div>

    

</template>
<style scoped></style>