<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import useCommonsStore from "@/composables/useCommons.js";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import useNotificationStore from "@/composables/useNotification.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";

import {useRouter} from "vue-router";

const commons = useCommonsStore()
const reportSetupStore = useReportSetupStore()
const notificationStore  = useNotificationStore()
const routerData = useRouter()
const campusStore = useCampusStore()
const campusNumber = routerData.currentRoute.value.query.id
// const campus_curriculum_number = routerData.currentRoute.value.query.crr

const errorMessage = ref("")
const loader = ref(false)
const classList = ref([])

const form = reactive({
  report_template_number:null,
  campus_class_number:null
})

onMounted(() => {
    campusStore.fetchClassesByCampus(campusNumber)
    }
)

const addReportTemplate = () => {
  loader.value = true
  form.code = form.code ? parseInt(form.code) : form.code
  reportSetupStore.newReportSettings(form)
}

watch(
    () => campusStore.campusClassesResponse,
    async (data) => {
        if (data) {
            classList.value = data.data
        }
    },
    {deep: true}
)

</script>

<template>
  <div>
  <form @submit.prevent="addReportTemplate">
    <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="errorMessage">
      {{ errorMessage }}
    </div>

    <div class="mb-2">
    <ul class="list-group text-sm mb-4" style="border-radius: 0 0 0 0;">

<li class="list-group-item" v-for="(list, index) in classList" :key="index" :value="list.number">
    <div class="row">
            <div class="col-lg-1" style="width: 5px;">
                <input
            v-model="form.campus_class_number"
            style="outline: none 0 !important; box-shadow: none;"
            class="form-check-input me-1 " type="checkbox" :value="list.class_number" :id="list.class_number">
            </div>
            <div class="col-lg-11" style="float: left;">
                <label class="textSize" :for="list.class_number"><small>{{list.class_name}} [{{ list.class_abbreviation }}]</small></label>
            </div>
    </div>
                
</li>

</ul>
</div>


    <div class="flex justify-content-end mt-4" style="width: 100%;">
      <button
          type="submit"
          class="btn btn-primary border-0">
        Save
        <span v-if="loader" style="width: 1.2rem; height: 1.2rem;" class="spinner-border text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </span>
      </button>
    </div>

  </form>
  </div>
</template>

<style scoped>
.textSize{
    font-size: 13px;
}
</style>