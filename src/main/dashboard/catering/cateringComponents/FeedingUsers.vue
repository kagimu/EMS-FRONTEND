<template>
    <div>
  
    
     
  
      <!-- end  -->
      <div class="row mt-3">
        <div class="col-12">
          <div class="">
            <div class="" style="padding: 0;">
    <div class="container mt-4">
        <div class="row">
          <div class="col-lg-12">
            <div class="">
              <div class="">
                  <h5 style="font-size: 14px;margin-top: 2px;">Feeding Users</h5>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-3">
    <div class="col-lg-12">
      <div class="mb-2" style="width: 200px;">
    <!-- <select
      style="box-shadow: none;"
      class="form-select form-select-sm"
      v-model="learning_area_number">
    <option disabled value="">--Filter by class--</option>
    <option value="">All</option>
    <option v-for="(list, index) in learningAreaList" :key="index" :value="list.number">{{list.name}}</option>
    </select> -->
<select   class="form-select form-select-sm" v-model="formData.feeding_group_number"
      style="box-shadow: none;">
    <option  disabled value="">-filter By Feeding Group - </option>
    <option>All</option>
    <option v-for="(list,index) in feedingGroupData" :key="index" :value="list.number">{{list.name  }}</option>
</select>
</div>
<div class="table-responsive">
      <table
        id="datatable"
        class="ext-sm table table-sm table-striped table-bordered"
        style="font-size: 14px !important;"
      >
      <thead >
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Group</th>   
            <th colspan="2">Menu</th>
          </tr>
    <div class="alert alert-danger" role="alert" v-if="errorMessage" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
      {{errorMessage}}
    </div>
        </thead>
        <tbody>
          <tr v-for="(user, index) in userList" :key="index">
            <td>{{ index+1 }}</td>
            <td> 
                 {{ user.first_name + " " + user.second_name + " " + user.last_name}}
             </td>
            <td>Staff</td>
            <td>
              <ul style="float: left;">
                <li>Rice<i class="bi bi-x" style="color:red"></i></li>
                <li>Beans<i class="bi bi-x" style="color:red"></i></li>
                <li>Water<i class="bi bi-x" style="color:red"></i></li>
                <li>Soda<i class="bi bi-x" style="color:red"></i></li>
                <li>Mukene<i class="bi bi-x" style="color:red"></i></li>
              </ul>
            </td>
            <td>
              <button style="text-decoration: none" type="button" @click="setStudentN(user.number)" class="btn btn-link mb-2 btn-sm link-primary"><small>Add menu item</small></button>
              <div class="row" v-if="userN == user.number">
               <div class="col-lg-10">
                <form style="margin: 3px;" @submit.prevent="saveMeal">  
                      <table class="table table-striped mt-2">
                        <thead>
                          <tr class="" style="padding: 0px;margin: 0px;font-size: 13px;">
                            <th>Menu Item</th>
                            <th>Qty</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(menu, index) in menuItems" :key="index" > 
                            <td>
                              <select class="form-select form-select-sm form-control select-no-border" v-model="menu.menu_item_number">
                                <option :value="option.number" v-for="option in availableOptions(index)">{{ option.name }}</option>
                              </select>
                            </td>

                            <td><input type="number" v-model="menu.quantity" placeholder="1.0" class="inp" style="width: 20px;"></td>
                            <td><button type="button" @click="removeMenuItem(index)"><i class="bi bi-x-circle" style="color:red"></i></button></td>
                          </tr>
                        </tbody>
                      </table>
                      <button type="submit" class="btn btn-primary btn-sm textColor mb-2 mt-2" style="float: right;" >Save
                        <div class="spinner-border spinner-border-sm" role="status" v-if="buttonLoader" >
                      <span class="visually-hidden">Loading...</span>
                  </div>
                  </button>
                    </form>
                  </div>

                  <div class="col-lg-1">
                    <button class="btn btn-primary btn-sm textColor mb-2" @click.prevent="addItem" :disabled="isAddButtonDisabled"><small>+</small></button>
                  </div>
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
    </div>
  
  
    </div>
    </template>
    
    <script setup>
  import {onMounted,reactive, ref,computed, watch} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import AdmitModel from "@/main/dashboard/studentApplication/AdmitModel.vue";
  import { useEnrolmentStore } from "@/main/dashboard/enrollment/store/enrollment";
  import { useUserStore } from "@/main/dashboard/profiles/store/users.js"
  import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
  import { useAccountStore } from "@/main/dashboard/account/store/account.js";
import { RouterView } from "vue-router";


const cateringStore = useCateringStore()
const accountStore = useAccountStore()
const userN = ref(null)
const menuData = ref(null)

const setStudentN = (a) =>{
  userN.value = a
}

const form = reactive({
  user_number:userN,
})

// newFeedingsResponse,
// newFeedings

const saveMeal = () =>{
  buttonLoader.value = true
  const menuItemNumbers = menuItems.value.map(menu => {
        return {
            menu_item_number: menu.menu_item_number,
            quantity: menu.quantity
        }
    })

     const data1 = {
        menu_items: menuItemNumbers
    }

    let myData = reactive({
       user_number:form.user_number,
        menu_items:menuItemNumbers
        })

alert(JSON.stringify(myData))
cateringStore.newFeedings(myData)
}

  const feedingGroupData = ref([])
  const enrollmentStore = useEnrolmentStore()


  const userList = ref( [])
  let errorMessage = ref(null)
  const buttonLoader = ref(false)
  const  notificationStore  = useNotificationStore()

   
  const selectedStudents = ref([])

  
  const formData = reactive ({
    feeding_group_number:null
  })
  

  onMounted(
      () => {
        enrollmentStore.fetchEnrolment()
        cateringStore.fetchFeedingGroup()
        accountStore.fetchUsersToAssign()
      }
  )
  
  watch(
    () => cateringStore.feedingGroupInfoResponse,
    async (data) => {
        feedingGroupData.value = data.data
    },
    {deep: true}
  )


  watch(
    () => accountStore.userResponse,
    async (data) => {
      if(data){
        userList.value = data.data
      }
    },
    {deep:true}
    )



//   watch (
//     () => enrollmentStore.enrolmentResponse,
//     async (data) => {
//       if(data){
//         userList.value = data.data
//       }
//     },
//     {deep:true}
//   )

  
    const selectedStudentNumber = computed(() => {
    const selectedNames = [];
    selectedStudents.value.forEach((isSelected, index) => {
      if (isSelected) {
        selectedNames.push(userList.value[index].number);
      }
    });
    return selectedNames;
  })
    
  
  const addFeedingGroupUsers = () => {
    // admitshow.value = true
    if (selectedStudentNumber.value.length === 0) {
      notificationStore.errorToast("Error", "Please select at least one user to offer admission.");
    } else {
      let data = reactive({
        feeding_group_number:formData.feeding_group_number,
        user_number:selectedStudentNumber,
        status:"ACTIVE"
      })
    //   alert(JSON.stringify(data)) 
      cateringStore.newFeedingGroupUsers(data)
    }
  }
//   newFeedingGroupResponse
watch (
  () => cateringStore.newFeedingGroupResponse,
  async (data) => {
    if(data){
      notificationStore.successToast("Success", data.message)
    }
  },
  {deep:true}
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

  onMounted(
    async () => {
        cateringStore.fetchMenuItem()
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

 
  const menuOptions = ref([])
  const menuItems = ref([])

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



  watch(
    () => cateringStore.newFeedingsResponse,
    async (data) => {
      notificationStore.successToast("Success", data.message)
    },
    {deep: true}
  )

  
    </script>
  
  
    
    <style scoped>
  
    </style>