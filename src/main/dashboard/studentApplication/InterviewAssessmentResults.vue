<script setup>
import {onMounted, watch,ref} from "vue";
import {useApplicationStore} from "@/main/application/applicationComponents/store/application.js";
import useNotificationStore from "@/composables/useNotification.js";

const applicationStore= useApplicationStore()
const  notificationStore  = useNotificationStore()

// let  interviewNumber = routerData.currentRoute.value.query.interview_id
const  interviewStudentList = ref( [])
const interviewObject = ref({AssessmentMetrics:[]})

onMounted(
    () => {
        applicationStore.fetchInterviewDetails(interviewNumber)
        applicationStore.fetchStudentsOnInterview(interviewNumber)
    }
)

watch(
    () => applicationStore.StudentsOnInterviewResponse,
    async (data) => {
        if(data){
            // notificationStore.successToast("Success", data.message)
            interviewStudentList.value = data.data
        }
    },
    {deep:true}
)

watch (
    () => applicationStore.interviewDetails,
    async (data) => {
        if(data){
            interviewObject.value = data
        }
    },
    {deep:true}
)

</script>

<template>
    <div>
        <table class="table table-hover caption-top table-striped" style="font-size: 14px;">
            <thead>
            <tr>
                <th scope="col">No</th>
                <th scope="col">Student Name</th>
                <!-- <th v-for="(val,idx) in interviewObject.AssessmentMetrics" :key="idx" ></th> -->
                <th>Score</th>
                <th scope="col">Comment</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(student, index) in interviewStudentList" :key="index">
                <td>{{index+1}}</td>
                <td>{{ student.Student.surname + " " + student.Student.second_name }} </td>
                <td v-for="(val,idx) in interviewObject.AssessmentMetrics" :key="idx" >
                    <input  type="number" class="form-control" style="width:100px"></td>
                <td><input type="text" class="form-control"></td>

            </tr>
            <tr>
                <td>2</td>
                <td>Mutebi Denis</td>
        
                <td><input type="number" class="form-control" style="width:100px"></td>
                <td><input type="text" class="form-control"></td>
            </tr>
            <tr>
                <td>3</td>
                <td>Isaac K</td>
                <td><input type="number" class="form-control" style="width:100px"></td>
                <td><input type="text" class="form-control"></td>
            </tr>


            </tbody>
        </table>
    </div>

</template>

<style scoped>

</style>