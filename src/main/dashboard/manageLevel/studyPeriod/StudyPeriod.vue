<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router";
import NewStudyPeriod from "@/main/dashboard/manageLevel/studyPeriod/NewStudyPeriod.vue";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import AppModal from "@/components/AppModal.vue";
import { useAbility } from '@casl/vue';
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { reactive } from "vue";
const confirmationRef = ref(null);

const { can } = useAbility()
const schoolList = ref([])
const studyPeriodStore = useStudyPeriodStore()
const academicYearStore = useAcademicYearStore()
const classStore = useClassesStore()

const routerData = useRouter()
const newStudyPeriodDialog = ref( false)
const campus_curriculum_number = routerData.currentRoute.value.query.crr
const schoolNumber = routerData.currentRoute.value.query.sch
const studyPeriodList = ref( [])
const  notificationStore  = useNotificationStore()
const academicYearNumber = ref( "")
const class_number = ref( "")
const academicYearList = ref( [])
const deletionLoader = ref( undefined)
const editMode = ref( false)
const campus_level_number = ref("")
const campusLevelList = ref([])
const campusStore = useCampusStore()
const campusClassList = ref(null)
const nextTermBegins = ref(null)

onMounted(
    () => {
      // studyPeriodData()
      classStore.fetchCampusLevel(campus_curriculum_number)
    }
)

const formData = reactive({
  next_term_begins: ""
})

const fetchAcademicYear = (campus_level_number) => {
  academicYearStore.fetchAcademicYearByLevel(campus_level_number)
  let data = {
    school_number:schoolNumber,
    campus_level_number:campus_level_number
  }
  campusStore.fetchClassesBySchool(data)
}


const addStudyPeriod = () => {
  newStudyPeriodDialog.value = true
  editMode.value = false
}


const editStudyPeriod = (styPeriod,nextD)  => {
  if(styPeriod) {
    nextTermBegins.value = nextD
    editMode.value = true
    newStudyPeriodDialog.value = true
    studyPeriodStore.fetchStudyPeriodData(styPeriod.study_period_number	)
  }
}


const deleteStudyPeriod = async (styPeriod, idx) => {
  deletionLoader.value = idx

const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete: "+styPeriod.study_period_name);
if (agreed) {
  await studyPeriodStore.deleteStudyPeriod(styPeriod.study_period_number)
}


}





const studyPeriodData = () => {
  studyPeriodStore.fetchStudyPeriod(
      {
        academic_year_number:academicYearNumber.value,
        class_number:class_number.value,
        school_number:schoolNumber
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

watch(
    () => studyPeriodStore.newStudyPeriodResponse,
    async (data) => {
      if(data){
        studyPeriodData()
        newStudyPeriodDialog.value = false
        notificationStore.successToast("Success","Study Period added successfully")
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



watch(
    () => studyPeriodStore.deleteStudyPeriodResponse,
    async (data) => {
      if(data){
        deletionLoader.value = undefined
        studyPeriodData()
      }
    }
)

watch(
    () => studyPeriodStore.editStudyPeriodResponse,
    async (data) => {
      if(data){
        newStudyPeriodDialog.value = false
        notificationStore.successToast("Success",data.message)
        studyPeriodData()

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

watch(
    () => campusStore.schoolClassesResponse,
    async (data) => {
      if(data){
        campusClassList.value = data.data
      }
    }
)

watch(
    () => studyPeriodStore.errorMessage,
    async (data) => {
      if(data){
        deletionLoader.value  = undefined
        notificationStore.errorToast("Error",data.message)
      }
    }
)

const studyPeriodN = ref(null)
const loader = ref(false)

const configNextTerm = (dat,study_period_number) => {
  studyPeriodN.value = study_period_number

  const date = new Date(dat);
  const formattedDate = date.toISOString().split('T')[0];

  formData.next_term_begins = formattedDate
}

const setNextTermDate = async (academic_year_number) => {
  loader.value = true
  const data = {
    academic_year_number:academic_year_number,
    next_term_begins:formData.next_term_begins
  }
studyPeriodStore.setNextTermDate(data)
//  alert(JSON.stringify(data))
}



watch(
    () => studyPeriodStore.setNextTermDateResponse,
    async (data) => {
      if(data){
        notificationStore.successToast("Success","Next Study Period configured successfully")
      }
    }
)

</script>
<template>
  <div>

    <ConfirmationModal ref="confirmationRef"></ConfirmationModal>

    <AppModal :title="editMode ? 'Edit Study Period' : 'Add Study Period'" v-model="newStudyPeriodDialog" lg>
      <new-study-period :nextTermBegins="nextTermBegins"></new-study-period>
    </AppModal>


    <div class="flex justify-content-between mt-10 mb-4 mr-3">
      &nbsp;
      <button v-if="can('create_term','manage')"
          type="button"
          class="btn btn-sm buttonStyle btn-primary mr-2"
          @click="addStudyPeriod">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Study Period
      </button>
    </div>



    <div class="grid grid-cols-4 gap-2 mb-4 px-3">
      <div class="mb-2">
        <label class="text-sm"><small>Level</small></label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="campus_level_number"
            @change="fetchAcademicYear(campus_level_number)"
        >
          <option disabled value="">--Select Level--</option>
          <option v-for="(list, index) in campusLevelList" :key="index" :value="list.number">{{list.code+". "+list.name}}</option>
        </select>
      </div>



        <div class="mb-2">
          <label class="text-sm"><small>Academic Year</small></label>
          <select
              style="box-shadow: none;"
              class="form-select form-select-sm"
              v-model="academicYearNumber"
              @change="studyPeriodData()">
              <option disabled value="">--Select --</option>
              <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">
                {{list.code+". "+list.academic_year_name}}
              </option>
          </select>
        </div>

          <div class="mb-2">
            <label class="text-sm"><small>Class</small></label>
            <select
                class="form-select form-select-sm shadow-none" required
                v-model="class_number"
                @change="studyPeriodData()"
                >
              <option disabled :value=null>--Select Class--</option>
              <option value="">All</option>
              <option v-for="(list, index) in campusClassList" :key="index" :value="list.number">{{list?.name+" [ "+list?.abbreviation+" ]"}}</option>
            </select>
          </div>

    </div>


    <table class="table table-hover caption-top text-sm" style="font-size: 14px;" v-if="can('view_term','manage')">
      <thead>
      <tr>
        <th class="w-[2%]" scope="col">#</th>
        <th class="w-[15%]"  scope="col">Level</th>
        <th class="w-[20%]"  scope="col">Academic Year</th>
        <th class="w-[33%]"  scope="col">Study Period</th>
        <th class="w-[10%]"  scope="col">Classes</th>
        <th class="w-[5%]"  scope="col">Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(studyPeriod, index) in studyPeriodList" :key="index">
        <td> {{index+1}}</td>
        <td class="capitalize"> {{studyPeriod?.level_name}}</td>
        <td class="capitalize"> {{studyPeriod?.academic_year_name}}</td>
        <td class="capitalize">
          <div class="mb-1">{{studyPeriod?.study_period_name}}</div>
         <div class="text-xs">
          <div class="mb-1">code: <span class="border px-3 rounded-md text-[green]">{{studyPeriod?.code	}}</span></div>


           <div class="mb-1">From: <span class="border px-3 rounded-md text-[green]">{{studyPeriod?.study_period_start_date	}}</span></div>
           <div>To: <span class="border px-3 rounded-md text-[green]">{{studyPeriod?.study_period_end_date	}}</span> </div>
           <div class="mt-2" style="cursor: pointer;" @click="configNextTerm(studyPeriod?.study_period_end_date,studyPeriod?.study_period_number)">Next Term Begins: <span class="border px-3 rounded-md text-[orange]">
            <b>{{studyPeriod?.next_term_begins	}}</b></span>
            
            <div class="row" v-if="studyPeriodN ==studyPeriod.study_period_number">
              <div class="col-12">
                <!-- <input  type="date" class="border px-3 rounded-md text-[orange] mt-2 form-control" v-model="formData.next_term_begins"/> -->
              </div>
              <div class="">
                <!-- <button  type="button" class="btn btn-sm buttonStyle btn-outline-primary mt-2 btn-sm text-xs"
                 @click="setNextTermDate(studyPeriod?.academic_year_number)">
                 <i class="bi bi-gear"></i>&nbsp;Config
                 
            <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>

                </button> -->

              </div>

            </div>


          </div>
         </div>
        </td>
        <td class="capitalize">
          <div class="text-xs"  v-for="(lst,idx) in studyPeriod.classes" :key="idx">
           {{(idx+1)}}. {{lst?.name}}
          </div>
        </td>
        <td class="capitalize">
          <div>
            <i
                style="font-size: 13px;"
                data-bs-toggle="modal" data-bs-target="#levelModal"
                class="bi-pencil mr-2 cursor-pointer" @click="editStudyPeriod(studyPeriod,studyPeriod?.next_term_begins)"></i>
            <i
                style="font-size: 13px;" class="bi-trash cursor-pointer text-[red]"  @click="deleteStudyPeriod(studyPeriod, index)"></i>
            <div class="spinner-border spinner-border-sm ml-2" role="status" v-if="deletionLoader === index">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </td>

      </tr>



      </tbody>
    </table>





  </div>
</template>



<style scoped>

</style>