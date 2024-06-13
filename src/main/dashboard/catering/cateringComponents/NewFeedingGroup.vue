<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

import { useAbility } from '@casl/vue';


const { can } = useAbility()
import useCommonsStore from "@/composables/useCommons.js";
import FeedingGroup from "./FeedingGroup.vue";
const commons = useCommonsStore()


const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const cateringStore = useCateringStore()
const school_number = ref(null)
const campusList = ref([])
const schoolList = ref([])
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const errorMessage = ref(null)

const form = reactive({
  code:null,
  name:null,
  status:"ACTIVE",
  campus_number:null
})

const props = defineProps({
  groupData:[]
})

onMounted(() => {
      schoolStore.fetchSchools()
      if(props.groupData.number != ""){
        form.code = props.groupData.code;
        form.name = props.groupData.name;
      }
    }
)

const addFeedingGroup = () => {
  let myData = reactive({
    code:parseInt(form.code),
    name:form.name,
    status:"ACTIVE",
    // campus_number:form.campus_number,
    school_number:school_number.value
  })
  buttonLoader.true

  if(props.groupData.number){
    if(!confirm("Sure want Edit " + props.groupData.name )){
      return
    }
    // alert("Edit Boss !!")
    let formD = {
      feeding_group_number:props.groupData.number,
      name:form.name,
      code:parseInt(form.code),
      status:"ACTIVE"
    }
    cateringStore.editFeedingGroupInfo(formD)
  }else{
    cateringStore.newFeedingGroupInfo(myData)
  }

}
watch (
    () => cateringStore.newFeedingGroupInfoResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        // await cateringStore.fetchFeedingGroup()
        form.code=null,
            form.name=null,
            form.status="ACTIVE",
            form.campus_number=null
      }
    },
    {deep:true}
)

watch (
    () => cateringStore.editFeedingGroupInfoResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
      
      }
    },
    {deep:true}
)

watch (
    () => cateringStore.errorMessage,
    async (data) => {
      if(data){
        thisDialog.value = false
        errorMessage.value = data.message
        notificationStore.errorToast("Error",data.message)
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

const fetchCampuses = (school_number) => {
  campusStore.fetchCampuses(school_number)
}


watch(
    () => campusStore.campusListResponse,
    async (data) => {
      if (data) {
        campusList.value = data.data
      }
    },
    {deep: true}
)


</script>
<template>
    <div>
        <!-- {{ groupData }} -->
<form @submit.prevent="addFeedingGroup">
    <div class="mb-2" v-if="groupData == ''">
    <label class="textColor"><small>School</small> </label>
    <select
            style="box-shadow: none;"
            class="form-select form-select-sm shadow-none"
            v-model="school_number"
            @change="fetchCampuses(school_number)"
    >
        <option disabled value="">Select School</option>
        <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
        </option>
    </select>
</div>
<!-- <div class="mb-2" v-if="groupData == ''">
    <label class="textColor"><small>Campus</small>  </label>
    <select
            style="box-shadow: none;"
            class="form-select form-select-sm shadow-none"
            v-model="form.campus_number"
    >
        <option disabled value="">Select campus</option>
        <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
        </option>
    </select>
</div> -->
<div class="mb-2">
    <label class="textColor"><small>Code</small></label>
    <input
        v-model="form.code"
        @keypress="commons.numbersOnlyValidator($event)"
        maxlength="10"
        type="text"
        required
        @paste.prevent
        class="form-control shadow-none">
</div>
<div class="mb-2">
    <label class="textColor"><small>Name</small></label>
    <input v-model="form.name"   type="text" required class="form-control shadow-none" placeholder="eg. Full board">
    
</div>

<div class="text-right mt-4">
    <button  style="float: right" type="submit" class="btn btn-primary btn-sm float-end mb-2 mr-4"  data-bs-toggle="offcanvas" data-bs-target="#rolesDialog" aria-controls="rolesDialog"><i class="bi bi-arrow-right-circle"></i>&nbsp;<small>submit</small>
    <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
        <span class="visually-hidden">Loading...</span>
    </div></button>
</div>
</form>
    </div>
</template>
 
