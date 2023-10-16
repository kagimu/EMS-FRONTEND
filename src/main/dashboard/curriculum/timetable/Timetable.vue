<template>
  <div class="bg-white my-2">

    <div class="modal fade" id="subjectModal" tabindex="-1" :class="{ show: subtopicDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Timetable Period</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-period></new-period>
            </div>
          </div>

        </div>
      </div>
    </div>




    <div class="flex justify-content-between mt-4">
      <div class="ml-4">Timetable setup</div>
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubtopic" data-bs-toggle="modal" data-bs-target="#subjectModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Period
      </button>
    </div>


    <div class="row">
      <div class="col-12">
        <div class="mt-1">

        <div class="row mx-auto mb-2 mt-2">

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectSubjectCluster(learning_area_number)"
                  v-model="learning_area_number">
                <option disabled value="">Filter by class</option>
                <option value="">All</option>
                <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="learning_area_number">
                    <option disabled value="">Filter by Stream</option>
                    <option value="">All</option>
                    <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.name}}</option>
                </select>
            </div>

        </div>
<!--
            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectSubject(subject_cluster_number)"
                  v-model="subject_cluster_number">
                <option disabled value="">Filter by Subject Cluster</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectClusterList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>

            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectStrand(subject_number)"
                  v-model="subject_number">
                <option disabled value="">Filter by Subject</option>
                <option value="">All</option>
                <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>


            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  @click="selectTopic(strand_number)"
                  v-model="strand_number"
              >
                <option disabled value="">Filter by Strand</option>
                <option value="">All</option>
                <option v-for="(list, index) in strandList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>


            <div class="col-4 mb-2">
              <select
                  style="box-shadow: none;"
                  class="form-select form-select-sm"
                  v-model="topic_number"
                  @click="filterSubTopic(topic_number)"
              >
                <option disabled value="">Select Topic</option>
                <option value="">All</option>
                <option v-for="(list, index) in topicList" :key="index" :value="list.number">{{list.name}}</option>
              </select>
            </div>


          </div>-->
<!--            <div class="row mx-auto">
                <div class="col-12 mx-auto">
            <table class="table table-hover caption-top table-striped" style="font-size: 14px; border: 2px solid">
              <thead>
              <tr style="border: 2px solid">
                <th scope="col">DAY</th>
                <th scope="col">Monday</th>
                <th scope="col">Tuesday</th>
                <th scope="col">Wednesday</th>
                <th scope="col">Thursday</th>
                <th scope="col">Friday</th>
                <th scope="col">Saturday</th>
                <th scope="col">Sunday</th>
              </tr>
              </thead>
              <tbody>


              <tr style="border: 1px solid">
                  &lt;!&ndash; Rowspan the first column and apply vertical text styling &ndash;&gt;
                  <td style="border: 1px solid" rowspan="10" >PERIOD</td>
                  <td style="border: 1px solid">P1 : English <br/> 8:00AM - 9:00AM</td>
                  <td style="border: 1px solid">P1 : English <br/> 8:00AM - 9:00AM</td>
                  <td style="border: 1px solid">P1 : English <br/> 8:00AM - 9:00AM</td>
                  <td style="border: 1px solid">P1 : English <br/> 8:00AM - 9:00AM</td>
                  <td style="border: 1px solid">P1 : English <br/> 8:00AM - 9:00AM</td>
                  <td style="border: 1px solid">P1 : English <br/> 8:00AM - 9:00AM</td>
                  <td style="border: 1px solid">P1 : English <br/> 8:00AM - 9:00AM</td>
              </tr>
              &lt;!&ndash; Additional rows &ndash;&gt;
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P2 : Math <br/> 9:00AM - 10:00AM</td>
                  <td style="border: 1px solid">P2 : Math <br/> 9:00AM - 10:00AM</td>
                  <td style="border: 1px solid">P2 : Math <br/> 9:00AM - 10:00AM</td>
                  <td style="border: 1px solid">P2 : Math <br/> 9:00AM - 10:00AM</td>
                  <td style="border: 1px solid">P2 : Math <br/> 9:00AM - 10:00AM</td>
                  <td style="border: 1px solid">P2 : Math <br/> 9:00AM - 10:00AM</td>
                  <td style="border: 1px solid">P2 : Math <br/> 9:00AM - 10:00AM</td>
              </tr>
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P3 : Science <br/> 10:00AM - 11:00AM</td>
                  <td style="border: 1px solid">P3 : Science <br/> 10:00AM - 11:00AM</td>
                  <td style="border: 1px solid">P3 : Science <br/> 10:00AM - 11:00AM</td>
                  <td style="border: 1px solid">P3 : Science <br/> 10:00AM - 11:00AM</td>
                  <td style="border: 1px solid">P3 : Science <br/> 10:00AM - 11:00AM</td>
                  <td style="border: 1px solid">P3 : Science <br/> 10:00AM - 11:00AM</td>
                  <td style="border: 1px solid">P3 : Science <br/> 10:00AM - 11:00AM</td>
              </tr>
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P4 : History <br/> 11:00AM - 12:00PM</td>
                  <td style="border: 1px solid">P4 : History <br/> 11:00AM - 12:00PM</td>
                  <td style="border: 1px solid">P4 : History <br/> 11:00AM - 12:00PM</td>
                  <td style="border: 1px solid">P4 : History <br/> 11:00AM - 12:00PM</td>
                  <td style="border: 1px solid">P4 : History <br/> 11:00AM - 12:00PM</td>
                  <td style="border: 1px solid">P4 : History <br/> 11:00AM - 12:00PM</td>
                  <td style="border: 1px solid">P4 : History <br/> 11:00AM - 12:00PM</td>
              </tr>
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P5 : Lunch <br/> 12:00PM - 1:00PM</td>
                  <td style="border: 1px solid">P5 : Lunch <br/> 12:00PM - 1:00PM</td>
                  <td style="border: 1px solid">P5 : Lunch <br/> 12:00PM - 1:00PM</td>
                  <td style="border: 1px solid">P5 : Lunch <br/> 12:00PM - 1:00PM</td>
                  <td style="border: 1px solid">P5 : Lunch <br/> 12:00PM - 1:00PM</td>
                  <td style="border: 1px solid">P5 : Lunch <br/> 12:00PM - 1:00PM</td>
                  <td style="border: 1px solid">P5 : Lunch <br/> 12:00PM - 1:00PM</td>
              </tr>
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P6 : Science <br/> 1:00PM - 2:00PM</td>
                  <td style="border: 1px solid">P6 : Science <br/> 1:00PM - 2:00PM</td>
                  <td style="border: 1px solid">P6 : Science <br/> 1:00PM - 2:00PM</td>
                  <td style="border: 1px solid">P6 : Science <br/> 1:00PM - 2:00PM</td>
                  <td style="border: 1px solid">P6 : Science <br/> 1:00PM - 2:00PM</td>
                  <td style="border: 1px solid">P6 : Science <br/> 1:00PM - 2:00PM</td>
                  <td style="border: 1px solid">P6 : Science <br/> 1:00PM - 2:00PM</td>
              </tr>
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P7 : Math <br/> 2:00PM - 3:00PM</td>
                  <td style="border: 1px solid">P7 : Math <br/> 2:00PM - 3:00PM</td>
                  <td style="border: 1px solid">P7 : Math <br/> 2:00PM - 3:00PM</td>
                  <td style="border: 1px solid">P7 : Math <br/> 2:00PM - 3:00PM</td>
                  <td style="border: 1px solid">P7 : Math <br/> 2:00PM - 3:00PM</td>
                  <td style="border: 1px solid">P7 : Math <br/> 2:00PM - 3:00PM</td>
                  <td style="border: 1px solid">P7 : Math <br/> 2:00PM - 3:00PM</td>
              </tr>
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P8 : History <br/> 3:00PM - 4:00PM</td>
                  <td style="border: 1px solid">P8 : History <br/> 3:00PM - 4:00PM</td>
                  <td style="border: 1px solid">P8 : History <br/> 3:00PM - 4:00PM</td>
                  <td style="border: 1px solid">P8 : History <br/> 3:00PM - 4:00PM</td>
                  <td style="border: 1px solid">P8 : History <br/> 3:00PM - 4:00PM</td>
                  <td style="border: 1px solid">P8 : History <br/> 3:00PM - 4:00PM</td>
                  <td style="border: 1px solid">P8 : History <br/> 3:00PM - 4:00PM</td>
              </tr>
              <tr style="border: 1px solid">
                  <td style="border: 1px solid">P9 : Art <br/> 4:00PM - 5:00PM</td>
                  <td style="border: 1px solid">P9 : Art <br/> 4:00PM - 5:00PM</td>
                  <td style="border: 1px solid">P9 : Art <br/> 4:00PM - 5:00PM</td>
                  <td style="border: 1px solid">P9 : Art <br/> 4:00PM - 5:00PM</td>
                  <td style="border: 1px solid">P9 : Art <br/> 4:00PM - 5:00PM</td>
                  <td style="border: 1px solid">P9 : Art <br/> 4:00PM - 5:00PM</td>
                  <td style="border: 1px solid">P9 : Art <br/> 4:00PM - 5:00PM</td>
              </tr>

              </tbody>
            </table>
            </div>
            </div>-->

            <div class="row mx-auto">
                <div class="col-12 mx-auto">
                    <table class="table table-hover caption-top table-striped" style="font-size: 14px; border: 2px solid">
                        <thead>
                        <tr style="border: 2px solid">
                            <th scope="col">DAY</th>
                            <th v-for="(day,idxx) in distinctDays" scope="col" :key="idxx">{{day}}</th>

                        </tr>
                        </thead>
                        <tbody>


                        <tr style="border: 1px solid" >
                            <th scope="col"> </th>

                            <!-- Rowspan the first column and apply vertical text styling -->
                            <td style="border: 1px solid" v-for="(period,idx) in periodList" :key="idx">

                                {{period.Stream.class_name}}    {{period.Stream.name}} : {{period.Subject.name}} <br/> {{period.start_time}} - {{period.end_time}}

                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
      </div>
    </div>



  </div>
</template>

<script setup>

import {onMounted, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useRouter} from "vue-router";
import NewPeriod from "@/main/dashboard/curriculum/timetable/NewPeriod.vue";
import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useTimetableStore} from "@/main/dashboard/curriculum/timetable/store/timetable.js";

const routerData = useRouter()

const subjectStore = useSubjectStore()
const notificationStore  = useNotificationStore()
const classStore = useClassesStore()
const timetableStores = useTimetableStore()


const learningAreaList = ref([])
const subjectClusterList = ref([])
const subjectList = ref([])
const strandList = ref([])
const periodList = ref([])
const distinctDays = ref([])
const topicList = ref([])
const classList = ref([])
const subject_cluster_number = ref("")
const subject_number = ref("")
const strand_number = ref("")
const topic_number = ref("")
const learning_area_number = ref("")
const campus_number = ref("")



const subtopicDialog = ref( false)
const subtopicList = ref( [])
let  topicNo = routerData.currentRoute.value.query.id
      topicNo = topicNo ? topicNo : ""


const addSubtopic = () => {
  subtopicDialog.value = true
}

const editClass = (data) => {
  alert(JSON.stringify(data))
}
const deleteClass = (data) => {
  alert(JSON.stringify(data))
}


const selectSubject = (subject_cluster_number) => {
  subjectStore.fetchSubjects(subject_cluster_number)
}





onMounted(
    () => {
      timetableStores.fetchPeriods(campus_number.value)
        timetableStores.fetchDistinctDays(campus_number.value)
    }
)


watch(
    () => timetableStores.PeriodListResponse,
    async (data) => {
      if(data){
        periodList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => timetableStores.DistinctDays,
    async (data) => {
        if(data){
            distinctDays.value = data.days
        }
    },
    {deep:true}
)

watch(
    () => subjectStore.subjectInfoResponse,
    async (data) => {
      if(data){
        subjectList.value = data.data
      }
    },
    {deep:true}
)



</script>

<style scoped>

.linkStyle {
  text-decoration: none;
  color: #1867c0;
  font-size: 16px;
}

.linkStyle:hover {
  font-size: 16px;
  color: green;
  text-decoration: underline;
}

.viewButtonStyle{
  background-color: #2c6fb9;
  color: #ffffff;
  border-radius: 0;
}

.viewButtonStyle:hover {
  background-color: #0557b4;
  color: #ffffff;
}

</style>