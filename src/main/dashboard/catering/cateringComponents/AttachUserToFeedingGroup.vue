<script setup>
import {onMounted,reactive, ref,computed, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import { stringifyQuery } from "vue-router";

const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const cateringStore = useCateringStore()
const accountStore = useAccountStore()
const school_number = ref("")
const schoolsList = ref([])
const campus_number = ref("")
const campusList = ref([])
const page = ref(1)
const per_page = ref(15)
const feedingGroupData = ref([])
const enrollmentStore = useEnrolmentStore()
const userList = ref( [])
let errorMessage = ref(null)
const buttonLoader = ref(false)
const  notificationStore  = useNotificationStore()
const selectedStudents = ref([])

const props = defineProps({
    userNumber:stringifyQuery
})

const formData = reactive ({
  feeding_group_number:""
})


onMounted(
    () => {
      cateringStore.fetchUsersToAssign()
      schoolStore.fetchSchools()
      getStudentNumber()
    }
)

const getStudentNumber = () => {
    selectedStudents.value = [props.userNumber]
}

watch(
    () => props.userNumber,
    async (data) => {
        getStudentNumber()
    }
)


const doFeedingUsers = (schoolN) =>{
  cateringStore.fetchFeedingGroup(schoolN ?? "")
  campusStore.fetchCampuses(schoolN ?? "")
}

watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
      feedingGroupData.value = data.data
    }
)



watch(
    () => cateringStore.feedingGroupUsersAvailableResponse,
    async (data) => {
      if(data){
        userList.value = data.data
      }
    },
    {deep:true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
      if(data){
        schoolsList.value = data.data
      }
    }
)


const addFeedingGroupUsers = () => {

  if (selectedStudents.value.length === 0) {
    notificationStore.errorToast("Error", "Please select at least one user on to be added to a feeding group..");
    return
  }
    buttonLoader.value = true

    const data = {
                feeding_group_number:formData.feeding_group_number,
                campus_number:campus_number.value,
                user_number:selectedStudents.value,
                status:"ACTIVE"
              }


    cateringStore.newFeedingGroupUsers(data)
}


watch (
    () => cateringStore.newFeedingGroupResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchUsersToAssign()

      }
    }
)

watch(
    () => cateringStore.errorMessage,
    async (data) => {
      if (data) {
        buttonLoader.value = false
        notificationStore.errorToast("Error", data.message)
      }
    }
)

watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    }
)

</script>
<template>
    <div>
<div class="row">
<div class="col-lg-12">
<div class="row mt-3 mb-2 mx-auto">
    <form @submit.prevent="addFeedingGroupUsers">

    <div class="mb-2">
        <label class="text-sm">School</label>
        <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="school_number"
            @change="doFeedingUsers(school_number)"
        >
        <option disabled value="">-Select</option>
        <option v-for="(lvl, index) in schoolsList" :key="index" :value="lvl.number">{{lvl.name}}</option>
        </select>
    </div>
    

    <div class="mb-2">
    <label  class="text-sm">Campus</label>
    <select
        style="box-shadow: none;"
        class="form-select form-select-sm"
        v-model="campus_number"
    >
        <option disabled value="">-Select</option>
        <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
        </option>
    </select>
    </div>
    
    
    <div class="mb-2">
    <label  class="text-sm">Feeding Group</label>
    <select @change="" class="form-select form-control shadow-none" v-model="formData.feeding_group_number" required>
<option value="" disabled>-select </option>
<option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
</select>
    </div>

    <div class="mb-2">
    <button style="float: right;" type="submit" class="btn btn-primary btn-sm mb-2"><small>Submit</small>
        <div v-if="buttonLoader" class="spinner-border spinner-border-sm" role="status" >
        <span class="visually-hidden">Loading...</span>
    </div></button>
    
    </div>

</form>
</div>
</div>
</div>
</div>

</template>
    