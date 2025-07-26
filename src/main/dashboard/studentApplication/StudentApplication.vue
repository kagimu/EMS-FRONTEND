<script setup>

import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
import ApplicationList from "./ApplicationList.vue";
import Interviews from "./Interviews.vue";
import { useAbility } from '@casl/vue'
import InterviewScore from "./InterviewScore.vue"
import OfferAdmission from "./OfferAdmission.vue"


const { can } = useAbility()

const routerData = useRouter()

const route = routerData.currentRoute.value.query.s
const selectedPage = route ? route : "application-list"

const application = ref([
    {
    name:"Applicants",
    id:"application-list",
    action:"view_application_list"
  },
{
    name:"Interview pool",
    id:"interviews",
    action:"view_interviews"
  },
  {
    name:"Enter Interview Scores",
    id:"enter-interview-score",
    action:"view_interview_score"
  },
  {
    name:"Offer Admissions",
    id:"offer-admission",
    action:"view_offer_admission"
  },

])
const form = reactive({
  name:null
})


</script>
<template>
    <div>

    
      <div class="row">
        <div class="col-3">
          <div class="card mt-3 p-0">
            <div class="card-body" style="padding: 0;">
              <div class="mb-2 ml-3 mt-2" style="font-size: 16px;">Application</div>
  
  
              <div class="list-group list-group-flush mb-1" style="border-radius: 0 0 0 0;">
                <router-link
                    v-for="(item, idx) in application" :key="idx"
                    v-show="can(item.action,'general')"
                    class="list-group-item list-group-item-action"
                    :class="item.id === selectedPage ? 'active' : ''"
                    :to="{name:'student-application', query:{s:item.id}}">
                  <small style="font-size:12px;">{{item.name}}</small>
                </router-link>
              </div>
  
  
  
            </div>
          </div>
        </div>
  
        <div class="col-9">
          <div class="card mt-3">
            <div class="card-body" style="padding: 0;">
              <div>
                  <div v-if="selectedPage === 'application-list'">
                    <application-list></application-list>
                  </div>
                  <div v-if="selectedPage === 'interviews'">
                    <interviews></interviews>
                  </div>
                  
                  <div v-if="selectedPage === 'enter-interview-score'">
                  <interview-score></interview-score>
                  </div>

                  <div v-if="selectedPage === 'offer-admission'">
                  <OfferAdmission></OfferAdmission>
                  </div>
              </div>
  
  
            </div>
          </div>
        </div>
  
      </div>
  
    </div>
  </template>
  

  
  <style scoped>
  
  input:focus {
    box-shadow: none;
  }
  
  .text-sm2{
    color: #717375;
  }
  
  .navColor{
    color: black;
  }
  
  </style>