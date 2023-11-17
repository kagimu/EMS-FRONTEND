<template>
    <div>

        <form @submit.prevent="addStudyTimetable">

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
                        @change="fetchAcademicYears"
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

                <label class="textColor"><small>Academic Year</small></label>
                <select
                        @change="fetchStudyPeriods"
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="academic_year_number"
                >
                    <option disabled value="">Select academic year</option>
                    <option v-for="(list, index) in academicYearList" :key="index" :value="list.number">{{ list.academic_year_name }}
                    </option>
                </select>
            </div>

            <div class="mb-2">

                <label class="textColor"><small>Study Period</small></label>
                <select
                        style="box-shadow: none;"
                        class="form-select form-select-sm"
                        v-model="study_period_number"
                >
                    <option disabled value="">Select study period</option>
                    <option v-for="(list, index) in studyPeriodList" :key="index" :value="list.number">{{ list.study_period_name }}
                    </option>
                </select>
            </div>


            <div class="mb-2">

                <label class="textColor"><small>Name</small></label>
                <input
                        type="text"
                         class="form-control form-control-sm"
                        v-model="form.name"

                />
            </div>







            <div class="flex justify-content-end mt-3" style="width: 100%;">
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
import {useAcademicYearStore} from "@/main/dashboard/manageLevel/academicYear/store/academicYear.js";
import {useStudyPeriodStore} from "@/main/dashboard/manageLevel/studyPeriod/store/studyPeriod.js";
import useNotificationStore from "@/composables/useNotification.js";

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
const academicYearStore = useAcademicYearStore()
const studyPeriodStore = useStudyPeriodStore()
const  notificationStore  = useNotificationStore()

const schoolList = ref([])
const campusList = ref([])
const subjectList = ref([])
const levelList = ref([])
const academicYearList = ref([])
const studyPeriodList = ref([])
const classList = ref([])
const streamList = ref([])
const school_number = ref(null)
const class_number = ref(null)
const level_number = ref(null)
const campus_number = ref(null)
const academic_year_number = ref(null)
const study_period_number = ref(null)



const form = reactive({
    study_period_number: "",
    name: "",
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
    classStore.fetchClassesByLevelAndCampus({campus_number:form.campus_number,level_number:level_number.value})
}

const fetchAcademicYears = () => {
    academicYearStore.fetchAcademicYear(level_number.value)
}

const fetchStudyPeriods = () => {
    let data = {
        level:level_number.value,
        academic_year_number:academic_year_number.value
    }
    studyPeriodStore.fetchStudyPeriod(data)
}

const fetchStreamsAndSubjects = (class_level_number) => {
    fetchStreams(class_level_number)
    subjectStore.fetchSubjectsByClass(class_level_number)

}

const fetchLevelsByCampus = (campus_number) =>{
    levelStore.fetchLevelsByCampusNumber(campus_number)
}


const fetchStreams = (class_number) => {
    classStore.fetchClassStreams(class_number)
}

const addStudyTimetable = () => {
    loader.value = true
    form.study_period_number = study_period_number.value
    timetableStore.newTimetable(form)
}


onMounted(
    () => {
        schoolStore.fetchSchools(authStore.profile.number)
       // classStore.fetchClasses()
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
    () => timetableStore.newTimetableResponse,
    async (data) => {
        if (data) {
            loader.value = false
            notificationStore.successToast("Success",data.message)
            await timetableStore.fetchTimetables(campus_number.value)
        }
    },
    {deep: true}
)
watch(
    () => classStore.classStreams,
    async (data) => {
        if (data) {
            streamList.value = data.data
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
    () => academicYearStore.academicYearResponse,
    async (data) => {
        if (data) {
            academicYearList.value = data.data
        }
    },
    {deep: true}
)

watch(
    () => studyPeriodStore.studyPeriodResponse,
    async (data) => {
        if (data) {
            studyPeriodList.value = data.data
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