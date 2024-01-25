<template>
        <form @submit.prevent="createNewService">
          <div class="mb-2">
            <label class="textColor"><small>Service Name</small></label>
            <input maxlength="10" type="text" style="outline: none 0 !important;box-shadow: none;"
                required class="form-control form-select-sm" v-model="formData.name">
          </div>
            <div class="mb-2">
                <label class="textColor"><small>Cost</small></label>
                <input v-model="formData.cost" style="outline: none 0 !important; box-shadow: none;" type="number"  required  class="form-control form-select-sm">
            </div>
            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button type="submit" class="btn btn-primary border-0"> <i class="bi bi-save"></i> SaveData
                    <!-- <span  style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status"><span class="visually-hidden">Loading...</span> 
                        </span> -->
                </button>
            </div>
        </form>
   
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";


const formData = reactive({
    name: null,
    cost: null,
})

const createNewService = () =>{
alert(JSON.stringify(formData))
}

</script>

<style scoped>
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>