<template>
    <div>
<form @submit.prevent="addMenuItem">

    <div class="row">
        <div class="col-lg-6">
            <div class="mb-2">
    <label class="textColor"><small>Type</small> </label>
    <select
            style="box-shadow: none;"
            class="form-select form-select-sm" required
            v-model="menuForm.type"
            @change="chooseType()"
    >
        <option disabled value="">Select Type</option>
        <option>ITEM</option>
        <option>ASSEMBLED</option>
    </select>
    </div>
        </div>

        <div class="col-lg-6">
        <div class="mb-2">
        <label class="textColor"><small>Name</small></label>
        <input v-model="menuForm.name"   type="text" required class="form-control">
        </div>
        </div>

    </div>
  




<div class="row">
    <div class="col-lg-6">

        <div class="mb-2">
    <label class="textColor"><small>Code</small></label>
    <input  v-model="menuForm.code" type="number" required class="form-control">
</div>
    </div>
    <div class="col-lg-6">
        <div class="mb-2">
    <label class="textColor"><small>Unit Of Measurement</small></label>
    <select v-model="menuForm.unit_of_measure_number" class="form-control form-select"> 
        <option disabled value="">Select</option>
        <option v-for="(list, index) in unitMeasurementData" :key="index" :value="list.number">{{list.name}}</option>
    </select>
    
</div>

</div>

</div>

<div class="row">
<div class="col-lg-6">
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
</div>

<div class="col-lg-6">
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
</div>
</div>
<div>
</div>


<!-- if Assessmbled -->
<div v-if="menuForm.type=='ASSEMBLED'">
    <div class="row">
                  <div class="col-lg-12">
                   
                    <!-- New Design -->
                      <table class="table table-striped mt-2">
                        <thead>
                          <tr class="" style="padding: 0px;margin: 0px;font-size: 13px;">
                            <th>Item</th>
                            <th>Quantity</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(menu, index) in menuItems" :key="index" > 
                            <td>
                              <select class="form-select form-select-sm form-control select-no-border" v-model="menu.secondary_item_number" @change="updateService(index)">
                                <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                              </select>
                            </td>

                            <td><input type="number" v-model="menu.quantity" placeholder="1.0" class="inp"></td>
                            <td><button type="button" @click="removeMenuItem(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                          </tr>
                        </tbody>
                      </table>
                   
                      <button class="btn btn-primary btn-sm textColor" @click.prevent="addItem" :disabled="isAddButtonDisabled"><small>ADD ANOTHER ITEM</small></button>
                    
                  </div>
                </div> 
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
    const itemtype = ref(null)

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
    code:null,
    type:null,
    unit_of_measure_number:null,
    campus_number:null
  } )

  const addMenuItem = () =>{
    if(menuForm.type == 'ITEM'){
    alert(JSON.stringify(menuData))
    buttonLoader.value = true,
    cateringStore.newMenuItemInfo(menuForm)
    }else{
        //prepare data
        const secondaryItemNumbers = menuItems.value.map(menu => {
        return {
            secondary_item_number: menu.secondary_item_number,
            quantity: menu.quantity
        }
    })

     const data1 = {
        secondary_items: secondaryItemNumbers
    }
    const formattedData = JSON.stringify(data1)

        let myData = reactive({
        name:menuForm.name,
        code:menuForm.code,
        type:menuForm.type,
        unit_of_measure_number:menuForm.unit_of_measure_number,
        campus_number:menuForm.campus_number,
        secondary_items:secondaryItemNumbers
        })
        alert(JSON.stringify(myData))
        ///connect endpoint
        cateringStore.newAssemblyItem(myData)
    }
 


  }

  watch(
    () => cateringStore.newMenuItemInfoResponse,
    async (data) => {
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchMenuItem()
        menuForm.name=null,
        menuForm.code=null,
        menuForm.type=null,
        menuForm.unit_of_measure_number=null,
        menuForm.campus_number=null
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


  const feedingSessionGroupData = ref([])
 
  const menuOptions = ref([])
  const menuItems = ref([])
  const menuItemOptions = ref([])

 
  const form = reactive({
    primary_item_number:null
  })
  
  const menuData = ref([])

  onMounted(
    async () => {
        cateringStore.fetchMenuItem()
        cateringStore.fetchFeedingGroupSessions()
    } )

  watch(
    () => cateringStore.menuItemResponse,
    async (data) => {
        if (data) {
          menuData.value = data.data
        menuOptions.value = data.data.map(option => ({ number: option.number,name:option.name}));
      }
    },
    {deep: true}
  )

  watch(
  () => cateringStore.feedingGroupSessionsInfoResponse,
  async (data) => {
      feedingSessionGroupData.value = data.data
  },
  {deep: true}
)



  function addItem() {
    menuItems.value.push({ name: '', quantity: 1 })
  }
  
  function removeMenuItem(index) {
    menuItems.value.splice(index, 1)
  }
  
  function availableOptions(index) {
    const selectedNames = menuItems.value.map(menu => menu.name);
    return menuOptions.value.filter(option => !selectedNames.includes(option.name) || option.name === menuItems.value[index].name)
  }


const createFeedingSessionItem = () => {
    const secondaryItemNumbers = menuItems.value.map(menu => {
        return {
            secondary_item_number: menu.secondary_item_number,
            quantity: menu.quantity
        }
    })

  const data = {
        primary_item_number: form.primary_item_number,
        secondary_items: secondaryItemNumbers
    }
    const formattedData = JSON.stringify(data)
    alert(formattedData)
    cateringStore.newAssemblyItem(formattedData)
}

watch(
    () => cateringStore.newAssemblyItemResponse,
    async (data) => {
        notificationStore.successToast("Success", data.message)
        cateringStore.fetchAssemblyItem()
        clearFormData()
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

  const clearFormData = () => {
    form.primary_item_number = null
    menuItems.value = []
}


    </script>