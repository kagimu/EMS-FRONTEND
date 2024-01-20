<template>
  <div>

          <div>
            <div style="font-size: 8px;">
                <div><b>Scheme of Work</b></div><br />
                <div style="margin-bottom: 4px;" v-if="schemeOfWorkList.name"><small><b>Title:</b> {{schemeOfWorkList.name}}</small></div>
                <div style="margin-bottom: 4px;" v-if="schemeOfWorkList.academic_year_name"><small><b>Class:</b> {{schemeOfWorkList.academic_year_name}}</small></div>
                <div style="margin-bottom: 4px;" v-if="schemeOfWorkList.class_name"><small><b>Class:</b> {{schemeOfWorkList.class_name}}</small></div>
                <div style="margin-bottom: 4px;" v-if="schemeOfWorkList.subject_name"><small><b>Subject:</b> {{schemeOfWorkList.subject_name}}</small></div>
                <div style="margin-bottom: 4px;" v-if="schemeOfWorkList.status"><small><b>Status:</b> {{schemeOfWorkList.status}}</small></div>
            </div>




              <table cellspacing="0" cellpadding="0"   style="width:100%; font-size: 7px;">
              <tr>
                <td style="border-top: 1px solid #949698;border-bottom: 1px solid #949698;">#</td>
                <td style="border-top: 1px solid #949698;border-bottom: 1px solid #949698;">Strand</td>
                <td style="border-top: 1px solid #949698;border-bottom: 1px solid #949698;">Topic</td>
                <td style="border-top: 1px solid #949698;border-bottom: 1px solid #949698;">Sequence</td>
                <td style="border-top: 1px solid #949698;border-bottom: 1px solid #949698;">Subtopic</td>
                <td style="border-top: 1px solid #949698;border-bottom: 1px solid #949698;">Estimated Time (Min)</td>
                <td style="border-top: 1px solid #949698;border-bottom: 1px solid #949698;">Lesson Plan (Concept(s))</td>
              </tr>
              <tr v-for="(lst,index) in schemeOfWorkList.subtopic" :key="index" >
                <td style="border-bottom: 1px solid #1a1e21;">{{index+1}}</td>
                <td style="border-bottom: 1px solid #1a1e21;" >
                  {{lst.strand_name}}
                </td>
                <td style="border-bottom: 1px solid #1a1e21;">
                  {{lst.topic_name}}
                </td>
                <td style="border-bottom: 1px solid #1a1e21;">
                  {{lst.code}}
                </td>
                <td style="border-bottom: 1px solid #1a1e21;">
                  <div style="width: 200px; white-space: break-spaces">
                    {{lst.name}}
                  </div>
                </td>
                <td style="border-bottom: 1px solid #1a1e21;">
                  {{lst.estimated_time}}
                </td>
                <td style="border-bottom: 1px solid #1a1e21;">

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

<script setup>

import {ref, watch} from "vue";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useRouter} from "vue-router";


const level = ref( "")
const academic_year_number = ref( "")
const learningAreaList = ref( [])
const classList = ref( [])
const levelList = ref( [])
const classStore = useClassesStore()
const routerData = useRouter()


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

<style scoped>

</style>