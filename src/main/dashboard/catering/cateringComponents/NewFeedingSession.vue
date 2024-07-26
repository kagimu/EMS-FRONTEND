 <script setup>
    import {onMounted,reactive, ref, watch} from "vue";
    import useNotificationStore from "@/composables/useNotification.js";
    import {useCateringStore} from "@/main/dashboard/catering/store/catering.js";
    import {useSchoolStore} from "@/main/dashboard/manageSchool/store/school.js";
    import {useCampusStore} from "@/main/dashboard/manageCampus/store/campus.js";
    import { useAbility } from '@casl/vue';
    import useCommonsStore from "@/composables/useCommons.js";


    const commons = useCommonsStore()
    const { can } = useAbility()
    const  notificationStore  = useNotificationStore()
    const buttonLoader = ref(false)
    const cateringStore = useCateringStore()
    const campusList = ref([])
    const schoolList = ref([])
    const schoolStore = useSchoolStore()
    const campusStore = useCampusStore()
    const errorMessage = ref(null)
    const showSchool = ref("none")
    const Items = ref([])
    const itemOption = ref([])
    const isSelected = ref(true)

const props = defineProps({
  groupData:[]
})

const showSchool = ref("none")
onMounted(() => {
        schoolStore.fetchSchools()
        if(props.groupData.number != ""){
        form.code = props.groupData.code;
        form.name = props.groupData.name;
        form.school_number = props.groupData.school_number;
        showSchool.value = "true"
      }
    }
)

const form = reactive({
    code:null,
    name:null,
    status:"ACTIVE",
    // campus_number:null,
    school_number:null
})
const addFeedingSessionGroup = () => {
    // parseInt
    let myData = reactive({
    code:parseInt(form.code),
    name:form.name,
    status:"ACTIVE",
    // campus_number:form.campus_number,
    school_number:form.school_number
})
    buttonLoader.true
    if(props.groupData.number){
    if(!confirm("Sure want Edit " + props.groupData.name )){
      return
    }
    let formD = {
      feeding_session_number:props.groupData.number,
      name:form.name,
      code:parseInt(form.code),
      status:"ACTIVE",
      school_number:form.school_number
    }
    cateringStore.updateFeedingSession(formD)
}else{
    cateringStore.newFeedingGroupSessionsInfo(myData)
}
   
}

watch (
    () => cateringStore.newFeedingGroupSessionsInfoResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message)
        // await cateringStore.fetchFeedingGroupSessions()
      }
    },
    {deep:true}
)

watch (
    () => cateringStore.updateFeedingSessionResponse,
    async (data) => {
      if(data){
        buttonLoader.value = false
        notificationStore.successToast("Success", data.message) 
        form.code = ""
        form.name = ""

      }
    },
    {deep:true}
)

watch (
      () => cateringStore.errorMessage,
      async (data) => {
        if(data){
        
          errorMessage.value = data.message
        //   notificationStore.errorToast("Error",data.message)
        }
      },
      {deep:true}
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

  const fetchCampuses = (school_number) => {
    campusStore.fetchCampuses(school_number)
}


watch(
    () => campusStore.campusListResponse,
    async (data) => {
        if (data) {
            campusList.value = data.data
        }
    },
    {deep: true}
)



</script>