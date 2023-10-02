<template>
    <div>

        <form @submit.prevent="addPeriod">

            <div class="alert alert-danger text-sm mt-3 p-2" role="alert" v-if="classError">
                {{ classError }}
            </div>


            <div class="mb-2">
                <label class="textColor"><small>School</small></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="school_number"
                        @change="fetchCampuses(school_number)"
                >
                    <option disabled value="">Select School</option>
                    <option v-for="(list, index) in schoolList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Campus</small></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.campus_number"
                        @change="fetchLevelsByCampus(form.campus_number)"
                >
                    <option disabled value="">Select campus</option>
                    <option v-for="(list, index) in campusList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>

            <div class="mb-2">
                <label class="textColor"><small>Level</small></label>
                <select
                        @change="fetchClasses"
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="level_number"
                >
                    <option disabled value="">Select level</option>
                    <option v-for="(list, index) in levelList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Class</small></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="class_number">
                    <option disabled value="">Select Class</option>
                    <option v-for="(list, index) in classList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>

            <div class="mb-2">
                <label class="textColor"><small>Stream</small></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.stream_number">
                    <option disabled value="">Select stream</option>
                    <option v-for="(stream, index) in streamList" :key="index" :value="stream.number">
                        {{ stream.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Subject</small></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.subject_number">
                    <option disabled value="">Select subject</option>
                    <option v-for="(list, index) in subjectList" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Day of the week</small></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="form.day">
                    <option disabled value="">Select day of the week</option>
                    <option v-for="(list, index) in daysOfWeek" :key="index" :value="list.number">{{ list.name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">
                <label class="textColor"><small>Start Time</small></label>
                <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.start_time"
                       placeholder="09:00" required class="form-control form-select-sm">
            </div>

            <div class="mb-2">
                <label class="textColor"><small>End Time</small></label>
                <input type="text" style="outline: none 0 !important; box-shadow: none;" v-model="form.end_time"
                       placeholder="15:45" required class="form-control form-select-sm">
            </div>


            <div class="flex justify-content-end" style="width: 100%;">
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
import {useRouter} from "vue-router";

import {useSubjectStore} from "@/main/dashboard/curriculum/subject/store/subject.js";
import {useClassesStore} from "@/main/dashboard/manageLevel/class/store/classes.js";
import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
import {useAuthStore} from "@/main/auth/store/auth.js";
import {useTimetableStore} from "@/main/dashboard/curriculum/timetable/store/timetable.js";
import {useLevelStore} from "@/main/dashboard/manageLevel/store/level.js";

const classError = ref(null)
const name = ref(null)
const loader = ref(false)
const routerData = useRouter()


const subjectStore = useSubjectStore()

const classStore = useClassesStore()
const schoolStore = useSchoolStore()
const campusStore = useCampusStore()
const authStore = useAuthStore()
const timetableStore = useTimetableStore()
const levelStore = useLevelStore()

const schoolList = ref([])
const campusList = ref([])
const subjectList = ref([])
const levelList = ref([])
const classList = ref([])
const streamList = ref([])
const school_number = ref(null)
const class_number = ref(null)
const level_number = ref(null)
const campus_number = ref(null)


const form = reactive({
    stream_number: "",
    subject_number: "",
    campus_number: "",
    day: "",
    start_time: "",
    end_time: "",
})


const daysOfWeek = ref([
    {name: "Monday", number: 1},
    {name: "Tuesday", number: 2},
    {name: "Wednesday", number: 3},
    {name: "Thursday", number: 4},
    {name: "Friday", number: 5},
    {name: "Saturday", number: 6},
    {name: "Sunday", number: 7}
])


const selectSubjectCluster = (learning_area_number) => {
    subjectClusterStore.fetchSubjectCluster(learning_area_number)
}

const selectSubject = (class_number) => {
    subjectStore.fetchSubjectsByClass(class_number)
}

const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}

const fetchClasses = () => {
    classStore.fetchClassesByLevelAndCampus({campus_number:form.campus_number,level_number})
}

const fetchLevelsByCampus = (campus_number) =>{
    levelStore.fetchLevelInfo(campus_number)
}


const fetchStreams = (class_number) => {
    classStore.fetchClassStreams(class_number)
}

const addPeriod = () => {
    loader.value = true
    form.class_number = class_number.value
    timetableStore.newPeriodData(form)
}


onMounted(
    () => {

        schoolStore.fetchSchools(authStore.profile.number)
        classStore.fetchClasses()
    }
)


watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => schoolStore.schoolsResponse,
    async (data) => {
        if (data) {
            schoolList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => subjectStore.subjectInfoResponse,
    async (data) => {
        if (data) {
            subjectList.value = data.data
        }
    },
    {deep: true}
)


watch(
    () => classStore.classInfoResponse,
    async (data) => {
        if (data) {
            classList.value = data.data
        }
    },
    {deep: true}
)


watch(
    () => campusStore.campusListResponse,
    async (data) => {
        if (data) {
            campusList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => levelStore.levelResponse,
    async (data) => {
        if(data){
            levelList.value = data.data
        }
    },
    {deep:true}
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