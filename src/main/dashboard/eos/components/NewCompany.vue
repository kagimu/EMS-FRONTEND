<template>
    <div>

        <form @submit.prevent="addCompany">

            <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="error">
                {{ error }}
            </div>

            <div class="mb-2">
                <label class="text-sm"><small>Company Name</small></label>
                <input
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.name"
                        required
                        class="form-control form-select-sm">
            </div>

            <div class="mb-2">
                <label class="text-sm"><small>Address</small></label>
                <textarea
                        style="outline: none 0 !important; box-shadow: none;"
                        type="text" v-model="form.description"
                        required
                        class="form-control form-select-sm"></textarea>
            </div>

            <div class="row">
                <div class="col">
                    <label class="text-sm"><small>Phone</small></label>

                    <input class="form-control" type="text" v-model="form.phone" placeholder="Phone">
                </div>
                <div class="col">
                    <label class="text-sm"><small>Email</small></label>
                    <input class="form-control" type="text" v-model="form.email" placeholder="Email">
                </div>
            </div>


            <div class="flex justify-content-end mt-2" style="width: 100%;">
                <button
                        type="submit"
                        class="btn btn-primary border-0">
                    Save
                    <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light"
                          role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
                </button>
            </div>

        </form>


    </div>
</template>

<script setup>

import {onMounted, reactive, ref, watch} from "vue";
import {CalendarStore} from "@/main/dashboard/eos/store/EosStore.js";
import {useRouter} from "vue-router";
import useCommonsStore from "@/composables/useCommons.js";
import useNotificationStore from "@/composables/useNotification.js";

const error = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()

const calendarStore = CalendarStore()
const commons = useCommonsStore()
const notificationStore = useNotificationStore()


const form = reactive({
    name: null,
    address: null,
    phone: null,
    email: null
})


const addCompany = () => {
    loader.value = true
    calendarStore.createCompany(form)
}


onMounted(
    () => {
        /* if(props.classNumber){
           classesStore.classDetails(props.classNumber)
         }*/
    }
)

watch(
    () => calendarStore.companyCreateSuccess,
    async (data) => {
        if(data){
            loader.value = false
            notificationStore.successToast("Success",data.message)
        }

    },
    {deep:true}
)


watch(
    () => calendarStore.calendarError,
    async (data) => {
        notificationStore.errorToast("Error", data.message)

    },
    {deep: true}
)


</script>

<style scoped>
.noFocus:focus {
    outline: none 0 !important;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
}
</style>