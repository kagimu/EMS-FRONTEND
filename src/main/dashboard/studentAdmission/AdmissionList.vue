<script setup>
   import {onMounted,reactive, ref, watch} from "vue";
   import useNotificationStore from "@/composables/useNotification.js";
   import { useAdmissionStore } from "@/main/dashboard/studentAdmission/newAdmissionComponents/store/adminission.js";
   import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
   import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
   import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
   import { useClassesStore } from "@/main/dashboard/manageLevel/class/store/classes";
   import EnrolModel from "@/main/dashboard/enrollment/EnrolModel.vue"
   import AppModal from "@/components/AppModal.vue";
   import {useEnrolmentStore} from "@/main/dashboard/enrollment/store/enrollment.js"
   import {useLevelStore} from "@/main/settings/level/store/level.js";
   import PaginationTemplate from "@/components/PaginationTemplate.vue";
   import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
   
   import { useAbility } from '@casl/vue';
   import FileUploader from "@/components/FileUploader.vue";
   const { can } = useAbility()
   const studyPeriodStore = useStudyPeriodStore()
   const levelStore = useLevelStore()
   const  notificationStore  = useNotificationStore()
   const studentNum=ref(null)
   const enrolmentStore = useEnrolmentStore()
   const mymodal = ref(false)
   const studentData = ref(null)
   const tableLoader = ref(true)
   const uploadDialog = ref(false)
   const studentPhoto = ref(null)
   const studentNumber = ref(null)
   
   const showModal = (studentN,adm,stud) =>{
   studentNum.value = studentN
   admissionInfoData.value = stud
   studentData.value =stud
   mymodal.value = true
    }
   
   const campusList = ref([])
   const schoolList = ref([])
   const classList = ref([])
   const schoolStore = useSchoolStore()
   const campusStore = useCampusStore()
   const academicYearStore = useAcademicYearStore()
   const academicYearList = ref([])
   const studyPeriodList  = ref([])
   const classStore = useClassesStore()
   const streamList = ref([])
   const admissionList = ref([])
   const admissionStore = useAdmissionStore()
   const admissionInfoData = ref(null)
   const loading = ref(false)
   const page = ref(1)
   const per_page = ref(20)
   const total_items = ref(0)
   const total_rows = ref(0)
   
   const curriculumList = ref([])
   const levelList = ref([])
   
   onMounted(() => {
     schoolStore.fetchSchools()
     // doFetchAdmission()
    }
   )
   
   const form = reactive({
   study_period_number: "",
   class_number: "",
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
     doFetchAdmission()
   }
   
   
   const fetchClasses = (campus_level_number) => {
     levelStore.fetchCampusCurriculum(campus_level_number)
     doFetchAdmission()
   }
   
   watch(
     () => campusStore.schoolClassesResponse,
     async (data) => {
       if(data){
         classList.value = data.data
       }
     }
   )
   
   const fetchStreamsAndStudyPeriod = (classNumber) =>{
   let sData = {
      campus_number:form.campus_number,
      class_number:classNumber,
      campus_curriculum_number:form.curriculumNumber
     }
     classStore.fetchClassStreams(sData)

     studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:form.academic_year_number,
        class_number:classNumber,
        school_number:form.school_number
      } )

     doFetchAdmission()
   }

   
   watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodList.value = data.data
      }
    }
)


   watch(
     () => academicYearStore.academicYearByLevelResponse,
     async (data) => {
       if(data){
         academicYearList.value = data.data
       }
     }
   )
   
   const fetchCampusLevel = (curriculumNumber) => {
    classStore.fetchCampusLevel(curriculumNumber)
   }
   
   
   
   const fetchLevelClasses = (levelNumber) => {
    let data = {
     school_number:form.school_number,
     campus_level_number:levelNumber
   }
   campusStore.fetchClassesBySchool(data)
   academicYearStore.fetchAcademicYearByLevel(levelNumber)
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
   

   
   const filterByStream = () => {
    doFetchAdmission()
   }
   
   const filterByStudyPeriod = () => {
    doFetchAdmission()
   }
   
   const doFetchAdmission = () =>{
     if(!form.school_number){
       return
     }

    let data = {
       page: 1,
       per_page: per_page.value,
       study_period_number:form.study_period_number,
       school_number:form.school_number,
       campus_number: form.campus_number,
       class_number:form.class_number,
       stream_number:form.stream_number,
       campus_class_number:form.campus_class_number,
       academic_year_number:form.academic_year_number
    }
    loading.value = true;
    admissionList.value = []
    admissionStore.fetchAdmissionByFilters(data)
   }
   
   
   
   function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
   if (scrollTop + clientHeight >= scrollHeight) {
     let data = {
       page: (page.value+1),
       per_page: per_page.value,
       study_period_number:form.study_period_number,
       school_number:form.school_number,
       campus_number: form.campus_number,
       campus_class_number:form.class_number,
       stream_number:form.stream_number,
       academic_year_number:form.academic_year_number
    }
   
    admissionStore.fetchAdmissionByFilters(data)
   
   
   }
   }
   
   
   const fetchAdmissions = (data) => {
     if(data) {
   
   
       let current_page = data.page
       page.value = current_page
       loading.value = false
   
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
   
           const index = admissionList.value.findIndex(object => object.admission_number === list.admission_number);
   
           if (index === -1) {
             admissionList.value.push(list);
           }
   
         })
       }
   
   
     }
   }
   
   
   watch (
     () => admissionStore.admissionByFiltersResponse,
     async (data) => {
       if(data){
         fetchAdmissions(data)
       }
     }
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
   
   
   
   watch(
     () => admissionStore.errorMessage,
     async (data) => {
           if (data) {
               notificationStore.errorToast("Error", data.message)      
           }
     },
     {deep: true}
   )
     
   watch (
       () => enrolmentStore.newsEnrolmentResponse,
       async (data) => {
         if(data){
          mymodal.value=false
          await admissionStore.fetchAdmissionByFilters(form.study_period_number, form.interview_number, form.stream_number, form.campus_number, form.class_number)
         }
       },
       {deep:true}
     )
   
     watch (
        () => enrolmentStore.newsEnrolmentResponse,
        async (data) => {
          if(data){
             doFetchAdmission()
          }
        },
        {deep:true}
      )
   
   const uploadStudentPhoto = (adm) => {
     studentNumber.value = adm?.student?.number
     studentPhoto.value = adm?.student?.photo
     uploadDialog.value = true
   }
   
   const successUpload = (data) => {
     if(data){
       uploadDialog.value = false
       doFetchAdmission()
     }
   }
   
   const closeDialog = () => {
      mymodal.value = false
}


</script>
<template>
   <AppModal title="Enrol" v-model="mymodal" xl6>
      <EnrolModel :studentNumber="studentNum" :admissionData="admissionInfoData" :studentDataInfo="studentData" @closeDialog="closeDialog"></EnrolModel>
   </AppModal>
   <AppModal title="Upload Student Photo" v-model="uploadDialog" xl>
      <file-uploader ref="profileUploadComponents" v-on:nextAction="successUpload"  :studentNumber="studentNumber" :imageUrl="studentPhoto"></file-uploader>
   </AppModal>
   <div>
      <!-- end  -->
      <div class="row">
         <div class="col-12">
            <div class="card">
               <div class="" style="padding: 0;">
                  <div class="">
                     <div class="row">
                        <div class="col-lg-12">
                           <div class="">
                              <div class="card-bod">
                                 <div class="row">
                                    <div class="col-lg-11">
                                       <h5 style="font-size: 14px;margin-top: 2px;">ADMISSION OFFERS </h5>
                                    </div>
                                    <div class="col-lg-1">
                                       <i class="bi bi-printer" style="float: right;"> Print </i>
                                    </div>
                                 </div>
                                 <div class="row">
                                    <div class="col-12">
                                       <div class="mt-4">
                                          <div class="row">
                                             <div class="row">
                                                <div class="col-3">
                                                   <div class="mb-2">
                                                      <!-- <label class="text-sm"><small>School</small> </label> -->
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
                                                      <!-- <label class="text-sm"><small>Campus</small>  </label> -->
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
                                                <div class="col-3">
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
                                                <div class="col-3" >
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

                                                <div class="col-3">
                                                   <div class="mb-2">
                                                      <select
                                                         style="box-shadow: none;"
                                                         class="form-select form-select-sm" required
                                                         v-model="form.academic_year_number"
                                                         @change="doFetchAdmission()"
                                                         >
                                                         <option disabled value="">-filter AcademicYear-</option>
                                                         <option v-for="(academicList,index) in academicYearList" :key="index" :value="academicList.number">{{ academicList.academic_year_name }}</option>
                                                      </select>
                                                   </div>
                                                </div>

                                                <div class="col-3">
                                                   <div class="mb-2">
                                                      <!-- {{ classList }} -->
                                                      <select
                                                         style="box-shadow: none;"
                                                         class="form-select form-select-sm" required
                                                         v-model="form.class_number"
                                                         @change="fetchStreamsAndStudyPeriod(form.class_number)"
                                                         >
                                                         <option disabled value="">-filter by class-</option>
                                                         <option v-for="(claslist, index) in classList" :key="index" :value="claslist.number">
                                                            {{claslist?.name+" [ "+claslist?.abbreviation+" ]"}}
                                                         </option>
                                                      </select>
                                                   </div>
                                                </div>
                                                <div class="col-3">
                                                   <div class="mb-2">
                                                      <!-- <label class="text-sm"><small>Stream</small> </label> -->
                                                      <select
                                                         style="box-shadow: none;"
                                                         class="form-select form-select-sm" required
                                                         v-model="form.stream_number"
                                                         @change="filterByStream()"
                                                         >
                                                         <option disabled value="">-filter by Stream-</option>
                                                         <option v-for="(slist, index) in streamList" :key="index" :value="slist.stream_number">{{ slist.name }}
                                                         </option>
                                                      </select>
                                                   </div>
                                                </div>
                                             
                                                <div class="col-3">
                                                   <div class="mb-2">
                                                      <select
                                                         style="box-shadow: none;"
                                                         class="form-select form-select-sm" required
                                                         v-model="form.study_period_number"
                                                         @change="filterByStudyPeriod()"
                                                         >
                                                         <option disabled value="">filter by Study period -</option>
                                                         <option v-for="(studyPeriod, index) in studyPeriodList" :key="index" :value="studyPeriod.study_period_number">{{ studyPeriod.study_period_name }}</option>

                                                      </select>
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <PaginationTemplate
                        @perPageChanged="doFetchAdmission"
                        v-model:perPage="per_page"
                        :per_page="per_page"
                        :total_items="total_items"
                        :total_rows="total_rows"></PaginationTemplate>
                     <div
                        class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                        @scroll="onScroll">
                        <table
                           id="datatable"
                           class="table table-hover caption-top mt-4 table-sm table-striped"
                           style="font-size: 14px !important;"
                           >
                           <thead >
                              <tr>
                                 <th>#</th>
                                 <th>ADN</th>
                                 <th>Student</th>
                                 <th>Campus</th>
                                 <th>Class</th>
                                 <th>Stream</th>
                                 <th>Study Period</th>
                                 <th>Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr v-for="(adm , index) in admissionList" :key="index">
                                 <td>
                                    {{adm.key}}
                                 </td>
                                 <td>
                                    {{adm.student.adn}}
                                 </td>
                                 <td style="text-transform: capitalize !important;">
                                    <div class="flex flex-row items-center">
                                       <div class="text-center">
                                          <img v-if="adm?.student?.photo" alt="photo" class="w-[50px] h-[50px] border rounded-full" :src="adm?.student?.photo"/>
                                          <div v-else class="m-auto">
                                             <i class="bi-person-circle text-[45px] text-[#8a8888]"></i>
                                          </div>
                                       </div>
                                       <div class="ml-2">{{ adm.student.surname + " " + adm.student.second_name+ " " + adm.student.other_name }}</div>
                                    </div>
                                 </td>
                                 <td>{{ adm.campus.name }}</td>
                                 <td>{{ adm.student.campus_class }}</td>
                                 <td>{{ adm.stream.name }}</td>
                                 <td>{{ adm.studyPeriod.study_period_name }}</td>
                                 <td>
                                    <div class="flex">
                                       <!--                                 <div class="mr-2 rounded-sm px-2 text-[#0d6dfa] cursor-pointer" style="border: 1px solid #0d6dfa;" @click="uploadStudentPhoto(adm)">
                                          <i class="bi bi-card-image cursor-pointer mr-1"></i>
                                          Upload Photo
                                          </div>-->
                                       <div v-if="can('enroll_student','manage')">
                                          <button  v-if="adm.status !== 'Enrolled'" @click="showModal(adm.student.number,adm.admission_number,adm)"
                                             type="button" class="btn btn-sm btn-primary mb-2 mr-4 "
                                             style="color: white;">
                                          <small>Enrol&nbsp;<i class="bi bi-box-arrow-in-right"></i></small>
                                          </button>
                                       </div>
                                       <router-link  v-if="adm.status === 'Enrolled'" style=""
                                          class="text-decoration-none"
                                          :to="{name:'student-profile-details', query:{st_id:adm.student.number}}">
                                          <button type="button"
                                             class="text-[#0d6efd] border border-primary px-3 rounded-sm hover:bg-[#0d6efd] hover:text-white"
                                             >view Details</button>
                                       </router-link>
                                       <span  v-if="adm.status === 'Enrolled'" class="link link-success"><i class="bi bi-check"></i>enrolled</span>
                                    </div>
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
   </div>
</template>
<style scoped></style>