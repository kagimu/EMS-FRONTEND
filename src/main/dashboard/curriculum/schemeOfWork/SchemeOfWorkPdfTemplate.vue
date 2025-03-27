<script setup>

import {ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";
import api from "@/config/api.js";


const level = ref( "")
const academic_year_number = ref( "")
const learningAreaList = ref( [])
const classList = ref( [])
const levelList = ref( [])
const classStore = useClassesStore()
const routerData = useRouter()

let imagePath = api.defaults.baseURL + "/attachments/download/"


const schemeOfWorkList = ref([])

const props = defineProps({
  schemeOfWorkList: {},
})



watch(
    () => props.schemeOfWorkList,
    async (data) => {
      if(data){
        schemeOfWorkList.value = data
      }
    },
    {deep:true}
)



</script>
<template>
  <div>

          <div>
            <div style="font-size: 8px;">
                <div style="text-transform: uppercase;"><b>Scheme of Work</b></div><br />
            </div>

            <table style="width: 100%; font-size: 8px; margin-bottom: 20px;">
              <tr>
                <td style="width: 15%;">
                  <img alt="img" style="width: 70px; margin: 0 auto;" :src="imagePath+schemeOfWorkList?.school_badge"/>
                </td>
                <td>
                  <div style="text-transform: uppercase; margin-bottom: 2px;"><b>{{schemeOfWorkList?.school_name}}</b></div>

                  <div style="margin-top: 1px;text-transform: uppercase; margin-bottom: 2px;">{{schemeOfWorkList?.campus_name}}</div>

                  <div style="margin-top: 1px; margin-bottom: 2px;">
                    <small>
                      {{schemeOfWorkList?.campus_location	}} |
                      {{schemeOfWorkList?.campus_phone}} |
                      {{schemeOfWorkList?.campus_email}}
                    </small></div>
                  <span style="background-color: green; color: #ffffff; text-transform: uppercase; padding-left: 15px; padding-right: 15px;">
                     {{schemeOfWorkList?.name}}
                  </span>

                  <div style="margin-top: 2px;">
                    <span style="margin-right: 10px;"  v-if="schemeOfWorkList.academic_year_name"><small><!--<b>Academic Year:</b>--> {{schemeOfWorkList.academic_year_name}}</small></span> |
                    <span style="margin-left: 10px; margin-right: 10px;"  v-if="schemeOfWorkList.class_name"><small><!--<b>Class:</b>--> {{schemeOfWorkList.class_name}}</small></span> |
                    <span style="margin-left: 10px; margin-right: 10px;"  v-if="schemeOfWorkList.subject_name"><small><!--<b>Subject:</b>--> {{schemeOfWorkList.subject_name}}</small></span> |
                    <span style="margin-left: 10px; margin-right: 10px;"  v-if="schemeOfWorkList.status"><small><!--<b>Status:</b>--> {{schemeOfWorkList.status}}</small></span>
                  </div>

                </td>

              </tr>
            </table>


<br />

              <table cellspacing="0" cellpadding="0"   style="width:100%; font-size: 7px;">
              <tr>
                <td style="border-right: 1px solid #7a7c7e;border-left: 1px solid #7a7c7e;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">#</td>
                <td style="border-right: 1px solid #7a7c7e;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">Strand</td>
                <td style="border-right: 1px solid #7a7c7e;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">Topic</td>
                <td style="border-right: 1px solid #7a7c7e;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;text-align: center;padding: 2px;">Sequence</td>
                <td style="border-right: 1px solid #7a7c7e;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">Subtopic</td>
                <td style="border-right: 1px solid #7a7c7e;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;text-align: center;padding: 2px;">Estimated Time (Min)</td>
                <td style="border-right: 1px solid #7a7c7e;border-top: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">Lesson Plan (Concept(s))</td>
              </tr>
              <tr v-for="(lst,index) in schemeOfWorkList.subtopic" :key="index" >
                <td style="border-right: 1px solid #7a7c7e;border-left: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">{{index+1}}</td>
                <td style="border-right: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;" >
                  {{lst.strand_name}}
                </td>
                <td style="border-right: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">
                  {{lst.topic_name}}
                </td>
                <td style="border-right: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e; text-align: center;padding: 2px;">
                  {{lst.code}}
                </td>
                <td style="border-right: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">
                  <div style="width: 200px; white-space: break-spaces">
                    {{lst.name}}
                  </div>
                </td>
                <td style="border-right: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e; text-align: center;padding: 2px;">
                  {{lst.estimated_time}}
                </td>
                <td style="border-right: 1px solid #7a7c7e;border-bottom: 1px solid #7a7c7e;padding: 2px;">

                  <div >
                    <div  class="ml-5 text-wrap" v-for="(lsn, idx) in lst.lesson_plan" :key="idx">
                      {{lsn.code+". "+lsn.concept_name}}
                    </div>
                  </div>


                </td>
              </tr>

            </table>


          </div>

  </div>


</template>



<style scoped>

</style>