<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";

const  notificationStore  = useNotificationStore()
const schemeOfWorkStore = useSchemeOfWorkStore()
let classNo = ""
const classSessionStudentsData = ref([])
const page = ref(1)
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)

const step = ref(null)
const  concept= ref(null)
const topic= ref(null)
const subject= ref(null)
const  sub_topic= ref(null)
const  streamName = ref(null)
const  className= ref(null)
const  date= ref(null)
const time= ref(null)
const teacher= ref(null)
const number_of_students= ref(null)
const comment = ref(null)
const enrollmentList = ref( [])
const loading = ref(false)
const stream  = ref(null)
const schoolNumber = ref(null)
const selectedItems = ref([])

const enrollmentStore = useEnrolmentStore()

 
const props = defineProps({
    sessionInfo: String
  })



if(classNo){
  selectedClass.value =  form.class_number
}

  onMounted(async () => {
    getSessionInfo()
    dofetchStudentSessionsData()

    if(localStorage.getItem("SchoolInfo")){
           let data =  JSON.parse(localStorage.getItem("SchoolInfo")) 
           const numbers = data.map(item => item.number);
           schoolNumber.value = numbers[0]
        }


        await doFetchEnrollent()
   }
  )

  const form = reactive({
  class_number: "",
  campus_class_number: "",
  campus_number: "",
  school_number:"",
  curriculumNumber:"",
  level:"",
  stream_number:"",
  })


  const getSessionInfo = () => {
    let draft = props.sessionInfo
    schemeOfWorkStore.fetchStudentsInSession(draft.number)
    step.value = draft.step
    concept.value = draft.concept
    topic.value = draft.topic
    subject.value = draft.subject
    sub_topic.value = draft.sub_topic
    streamName.value = draft.stream
    className.value = draft.class
    date.value = draft.date
    time.value = draft.time
    teacher.value = draft.teacher
    number_of_students.value = 30
    comment.value = draft.comment
    stream.value = draft.stream_number

  }

  watch(
    () => props.sessionInfo,
    async (data) => {
      if(data){
        getSessionInfo()
      }
    }
  )


  const dofetchStudentSessionsData = () => {
      let data = {
   
        session_number:props.sessionInfo.number
      }
      schemeOfWorkStore.fetchStudentsInSession(data)
  }



const fetchSessionStudentList = (data) => {
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

        const index = classSessionStudentsData.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          classSessionStudentsData.value.push(list);
        }
      })
    }

  }
}


watch(
    () => schemeOfWorkStore.classSessionStudentsResponse,
    async (data) => {
      if(data){
        // fetchSessionStudentList(data)
        alert(JSON.stringify(data))
        
      }
    }
  )



const doFetchEnrollent = () =>{
// let schoolInfo = JSON.parse(localStorage.getItem("currentSchoolInfo") )
let data = {
page: 1,
per_page: per_page.value,
study_period_number:"",
school_number:schoolNumber.value,
campus_number: "",
campus_class_number:"",
stream_number:stream.value,
academic_year_number:"",
status:""
}
loading.value = true;
enrollmentList.value = []
enrollmentStore.fetchEnrolment(data)

}

function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
if (scrollTop + clientHeight >= scrollHeight) {
let data = {
page: (page.value+1),
per_page: per_page.value,
study_period_number:"",
school_number:schoolNumber.value,
campus_number: "",
campus_class_number:"",
stream_number:stream.value,
academic_year_number:"",
status:""
}

enrollmentStore.fetchEnrolment(data)
}
}


const fetchEnrollmentList = (data) => {
if(data) {
let current_page = data.page
page.value = current_page
loading.value = false;

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

const index = enrollmentList.value.findIndex(object => object.number === list.number);

if (index === -1) {
enrollmentList.value.push(list);
}
})
}

}
}

watch (
() => enrollmentStore.enrolmentResponse,
async (data) => {
if(data){
fetchEnrollmentList(data)
}
},
{deep:true}
)


</script>
<template>
<!-- {{ sessionInfo }} -->
  <!-- {{classSessionStudentsData}} -->

<div class="bg-gray-100 shadow-md rounded-md p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
    <!-- Left Section -->
    <div class="flex-shrink-0 flex items-center justify-center bg-blue-100 rounded-full w-16 h-16 text-blue-600">
      <i class="fas fa-chalkboard-teacher text-3xl"></i>
    </div>

    <!-- Right Section -->
    <div class="flex-1">
      <div class="mb-2">
        <div class="text-sm text-gray-500">Step:</div>
        <div class="text-lg font-semibold text-blue-600">{{ step }}</div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
        <p>
          <i class="fas fa-lightbulb text-yellow-500"></i>
          <strong> Concept:</strong> {{concept}}
        </p>
        <p>
          <i class="fas fa-book text-green-500"></i>
          <strong> Topic:</strong>{{topic}}
        </p>
        <p>
          <i class="fas fa-school text-indigo-500"></i>
          <strong> Class:</strong> {{className}}
        </p>
        <p>
          <i class="fas fa-stream text-pink-500"></i>
          <strong> Stream:</strong> {{ streamName }}
        </p>
        <p>
          <i class="fas fa-user-tie text-gray-500"></i>
          <strong> Teacher:</strong> {{ teacher }}
        </p>
        <p>
          <i class="fas fa-users text-purple-500"></i>
          <strong> No Of Students:</strong> {{ number_of_students }}
        </p>
        <p>
          <i class="fas fa-calendar-alt text-blue-500"></i>
          <strong> Date:</strong> {{ date }}
        </p>
        <p>
          <i class="fas fa-clock text-red-500"></i>
          <strong> Time:</strong> {{ time }}
        </p>
        <p>
          <i class="fas fa-comments text-gray-700"></i>
          <strong> Comment:</strong> {{ comment }}
        </p>
      </div>
    </div>
  </div>


  <div class="bg-white  rounded-md py-3 px-2">
    <div class="row mt-1">
    
     <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <PaginationTemplate
                  v-model:perPage="per_page"
                  :per_page="per_page"
                  :total_items="total_items"
                  :total_rows="total_rows"
                  @perPageChanged="doFetchEnrollent"></PaginationTemplate>

             
                  <div  class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                  @scroll="onScroll">

                  {{ selectedItems }}

                <table class="table no-border table-striped table-hover">
                  <thead>
                    <tr>
                      <th style="width: 3px;">#</th>
                      <th style="width: 10%;">Adn</th>
                      <th style="width: 5%;"></th>
                      <th>Name</th>
                      <th>comment</th>
                      </tr>
                      </thead>
                  <tbody>
                    <tr v-for="(item,index) in enrollmentList" :key="index">
                      <td>
                        <input type="checkbox" class="" style="width: 15px;height: 15px;" v-model="selectedItems" :value="item.number">
                      </td>
                      <td>{{ item.adn }}</td>
                      <td>
                        <div class="flex flex-row items-center">
                        <div class="text-center">
                            <img v-if="item?.photo" alt="photo" class="w-[30px] h-[30px] border rounded-full" :src="item?.photo"/>
                            <div v-else class="m-auto">
                                <i class="bi-person-circle text-[45px] text-[#8a8888]"></i>
                            </div>
                        </div>
                    </div>
                      </td>
                      <td style="text-transform: capitalize;">
                        {{item.student_surname }} {{item.student_second_name}} {{ item.student_other_name }}</td>
                      <td></td>
             
                    </tr>
                  </tbody>
                  </table>  
                </div>

                  <div v-if="total_items == 0" class="text-center">
                    <p>No students in this session</p>
          </div>

    </div>
    
  </div>
  
</div>

</div>

</div>
 
    </div>

  </div>

</template>
<style scoped>

.bg-blue-100 {
  background-color: #ebf8ff;
}
.text-blue-600 {
  color: #3182ce;
}
</style>