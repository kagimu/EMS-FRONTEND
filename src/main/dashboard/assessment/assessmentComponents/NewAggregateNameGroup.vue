<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import useCommonsStore from "@/composables/useCommons.js";

const commons = useCommonsStore()
const  notificationStore  = useNotificationStore()
const buttonLoader = ref(false)
const errorMessage = ref(null)

const form = reactive({
  name:"",
  code:"",
  aggregate_group_number:""
})


const createAggregateGroupName = () =>{
  buttonLoader.value = true
  
}


</script>
<template>
    <div>

        <div class="modal-content">
      <div class="modal-body">
        <form @submit.prevent="createAggregateGroupName()">
          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Code</div>
            <input
                @keypress="commons.codeValidator($event)"
                maxlength="10"
                v-model="form.code"
                required
                @paste.prevent
                class="form-control form-select-sm shadow-none">
          </div>

          <div class="mb-2">
            <div class="text-[13px] text-[#505050]">Name</div>
            <input v-model="form.name" type="text" class="form-control shadow-none" placeholder="e.g Kindergatten">
          </div>

     <div class="flex justify-content-end mt-4" style="width: 100%;">
            <button type="submit" class="btn btn-primary border-0 btn-sm">
                 <small><i class="bi bi-save"></i> submit</small>
                 <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                      role="status" v-if="buttonLoader"><span class="visually-hidden">Loading...</span> 
                    </span>
            </button>
        </div>
    </form>
    </div>
    </div>
    </div>

</template>



<style scoped>

</style>