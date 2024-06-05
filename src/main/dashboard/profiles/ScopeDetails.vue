<template>
    <div>
      <div class="row mt-3">
        <div class="col-12">
      
            <table 
          class="table table-striped"
          style="font-size: 11px !important;" >
        <thead>
        <tr>
            <th>#</th>
          <th>Name</th>
          <th>School</th>
          <th>Campus</th>
          <th>Curriculum</th>
          <th>Class</th>
          <th>Stream</th>
        </tr>
        </thead>
        <tbody>
            <tr v-for="(list, index) in scopeData" :key="index">
                <td>{{ index+1 }}</td>
            <td>{{list.user_name }}</td>
            <td>{{list.school_name  }}</td>
            <td> {{list.campus_name  }} </td>
            <td>{{ list.curriculum_name }}</td>
            <td>{{ list.class_name }}</td>
            <td>{{ list.stream_name }}</td>
        </tr>
    
      
        </tbody>
      </table>
        </div>
  
  
      </div>
  
    </div>
  </template>
  
  <script setup>
  
  import {onMounted, reactive, ref, watch,computed} from "vue";
  import useNotificationStore from "@/composables/useNotification.js";
  import { useAbility } from '@casl/vue';
  import { useRolesStore } from "@/main/settings/roles/store/roles.js";
  import AssignScope from "@/main/dashboard/profiles/AssignScope.vue"
  import {useScopeStore} from "@/main/dashboard/profiles/store/scope.js";
  
 
  const notificationStore = useNotificationStore()
  const roleStore = useRolesStore()
  const rolesData = ref([])
  const { can } = useAbility()
  const errorMessage = ref(null)
  const user_number = ref(null)
  const scopeStore = useScopeStore()
  const scopeData = ref([])
  

  onMounted(
    async () => {
      scopeStore.fetchScope()
    } )

    watch (
        () => scopeStore.scopeResponse,
        async (data) => {
          if(data){
           scopeData.value = data.data
          }
        },
        {deep:true}
    )
  </script>
  
  <style scoped>
  
  input:focus {
    box-shadow: none;
  }
  
  .textColor{
    color: #717375;
  }
  
  </style>