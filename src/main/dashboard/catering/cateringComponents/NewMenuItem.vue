<template>
    <div>
<form @submit.prevent="addMenuItem">
<div class="mb-2">
    <label class="textColor"><small>School</small> </label>
    <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="school_number"
            @change="fetchCampuses(school_number)"
    >
        <option disabled value="">Select School</option>
        <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
        </option>
    </select>
</div>
<div class="mb-2">
    <label class="textColor"><small>Campus</small>  </label>
    <select
            style="box-shadow: none;"
            class="form-select form-select-sm"
            v-model="menuForm.campus_number" required
    >
        <option disabled value="">Select campus</option>
        <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
        </option>
    </select>
</div>
<div class="mb-2">
    <label class="textColor"><small>Code</small></label>
    <input  v-model="menuForm.code" type="number" required class="form-control">
</div>
<div class="mb-2">
    <label class="textColor"><small>Name</small></label>
    <input v-model="menuForm.name"   type="text" required class="form-control">
</div>
<div class="mb-2">
    <label class="textColor"><small>Type</small></label>
    <input v-model="menuForm.type"  type="text" required class="form-control">
</div>
<div class="mb-2">
    <label class="textColor"><small>Unit Of Measurement</small></label>
    <select v-model="menuForm.unit_of_measure_number" class="form-control form-select"> 
        <option disabled value="">Select</option>
        <option v-for="(list, index) in unitMeasurementData" :key="index" :value="list.number">{{list.name}}</option>
    </select>
    
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
 
<script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import useNotificationStore from "@/composables/useNotification.js";
    import NewMenuItem from "@/main/dashboard/catering/cateringComponents/NewMenuItem.vue";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

    const notificationStore = useNotificationStore()
    const thisDialog = ref(false)
    const buttonLoader = ref(false)
    const campusList = ref([])
    const schoolList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()

    const showDialog = () => {
        thisDialog.value = true
    }
    const cateringStore = useCateringStore()
    const unitMeasurementData = ref([])

    const closeDialog = () => {
        thisDialog.value = false
    }

    onMounted(
    () => {
      cateringStore.fetchUnitOfMeasureInfo()
    
    }
)

watch(
    () => cateringStore.UnitOfMeasureInfoResponse,
    async (data) => {
          unitMeasurementData.value = data.data
    },
    {deep: true}
  )

  const menuForm = reactive({
    name:null,
    code:3,
    type:null,
    unit_of_measure_number:null,
    campus_number:null
  } )

  const addMenuItem = () =>{
    buttonLoader.value = true,
    cateringStore.newMenuItemInfo(menuForm)
  }

  watch(
    () => cateringStore.newMenuItemInfoResponse,
    async (data) => {
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchMenuItem()
    },
    {deep: true}
  )

  watch(
    () => cateringStore.errorMessage,
    async (data) => {
          if (data) {
          notificationStore.errorToast("Error", data.message)
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