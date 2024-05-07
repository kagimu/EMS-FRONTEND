<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useReportSetupStore} from "@/main/dashboard/manageLevel/report_setup/report_forms/store/report_setup_store.js";
import api from "@/config/api.js";
import clearClassModal from "@/main/dashboard/manageLevel/report_setup/reportTemplate/clearClassModal.vue";
import AppModal from "@/components/AppModal.vue";

const reportSetupStore = useReportSetupStore()
const showClearClassModal = ref(false)
const classOnTemplateList = ref([])
const classListData = ref(null)

const props = defineProps({
    reportTemplateId:String,
    school_number:String
  })

  onMounted(() => {
  fetchTemplateClasses()
    }
)

watch (
  () => props.reportTemplateId,
  async (data) => {
    if(data){
        fetchTemplateClasses()
    }
  }
)

const fetchTemplateClasses = () =>{
 fetchClassesAddedReportTemplate(props.reportTemplateId,props.school_number)
}

const fetchClassesAddedReportTemplate = async (templateN,schoolN)  => {
        return await api.get("main/school/report-templates/by-class?template_number="+templateN+"&school_number="+schoolN)
            .then((response) => {
                if(response && response.data){
                    classOnTemplateList.value  = response.data
                }       
            })
            .catch((error) => {
                if(error && error.response){
                    errorMessage.value = error.response.data
                }
            })
    }

    

watch(
    () => reportSetupStore.classesAddedToReportTemplateListResponse,
    async (data) => {
      if(data){
      classOnTemplateList.value = data;
      }
    }
)

const clearClass = (classInfo) => {
  showClearClassModal.value = true
  classListData.value = classInfo
}

</script>

<template>
<div>

    <AppModal title="Comfirm !" v-model="showClearClassModal" xs>
        <clearClassModal :classListData="classListData"></clearClassModal>
    </AppModal>


      <div>
     <div v-for="(listD,index) in classOnTemplateList" :key="index">
     <!-- {{listD}} -->

    <ul v-for="(classInfo, classIndex) in listD.classes" :key="classIndex">
<li><span>{{classIndex+1}}</span>.{{classInfo.class_name}}<i
style="font-size: 13px;" class="bi-x cursor-pointer link-danger"  @click="clearClass(classInfo)"></i> </li>
</ul> 
                    
                  </div> 
                 </div>

</div>


</template>

<style>

</style>
