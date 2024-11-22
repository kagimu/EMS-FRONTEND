<script setup>
import {onMounted,reactive, ref, watch} from "vue";
import {useSchemeOfWorkStore} from "@/main/dashboard/curriculum/schemeOfWork/store/schemeOfWork.js";
const schemeOfWorkStore = useSchemeOfWorkStore();

let classNo = ""
const classSessionStudentsData = ref([])
const page = ref(1)
const per_page = ref(20)
const total_items = ref(0)
const total_rows = ref(0)
 
const props = defineProps({
    sessionNumber: String
  })


if(classNo){
  selectedClass.value =  form.class_number
}


  onMounted(() => {
    // getSessionInfo()
    dofetchStudentSessionsData()
   }
  )

  const getSessionInfo = () => {
    let draft = props.sessionNumber
    schemeOfWorkStore.fetchStudentsInSession(draft)
  }

  watch(
    () => props.sessionNumber,
    async (data) => {
      if(data){
        getSessionInfo()
      }
    }
  )


  const dofetchStudentSessionsData = () => {
      let data = {
        page: 1,
        per_page: per_page.value,
        session_number:props.sessionNumber
      }
      schemeOfWorkStore.fetchStudentsInSession(data)
  }


  function  onScroll({ target: { scrollTop, clientHeight, scrollHeight }}) {
  if (scrollTop + clientHeight >= scrollHeight) {
    let data = {
      page: (page.value+1),
      per_page: per_page.value,
      session_number:props.sessionNumber
    }
    schemeOfWorkStore.fetchStudentsInSession(data)
  }
}


const fetchSessionStudentList = (data) => {
  if(data) {
    let current_page = data.page
    page.value = current_page
  
    let per_page_item = data.per_page;
    per_page.value = per_page_item;

    let objArray = data.content

    let count_items = (current_page * per_page_item)
    let totalItems = data?.total_rows


    if(objArray && objArray.length > 0){

      per_page.value = per_page_item;
      page.value = current_page
      total_rows.value = totalItems

      total_items.value = (count_items > totalItems) ? totalItems : count_items
      objArray.forEach((list, i) => {

        list.key =  (current_page - 1) * per_page_item + i + 1

        const index = classSessionStudentsData.value.findIndex(object => object.number === list.number);

        if (index === -1) {
          classSessionStudentsData.value.push(list);
        }
      })
    }

  }
}


watch(
    () => schemeOfWorkStore.classSessionStudentsResponse,
    async (data) => {
      if(data){
        fetchSessionStudentList(data)
      }
    }
  )


</script>
<template>


  <div class="bg-white  rounded-md py-3 px-2">
    <div class="row mt-1">
    
     <div class="col-md-12">
        <div class="row">
          <div class="col-md-12">
            <div class="row">
              <div class="col-md-12">
                <h5 class="text-center text-sm">Students in this session</h5>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <PaginationTemplate
                  v-model:perPage="per_page"
                  :per_page="per_page"
                  :total_items="total_items"
                  :total_rows="total_rows"
                  @perPageChanged="dofetchStudentSessionsData"></PaginationTemplate>

             
                  <div  class="w-full overflow-auto max-h-[520px] scrollbar-thin"
                  @scroll="onScroll">
                <table class="table table-hover caption-top mt-1 table-sm table-striped">
                  <thead>
                    <tr>
                      <th style="width:5%">#</th>
                      <th>Name</th>
                      <th>Gender</th>
                      </tr>
                      </thead>
                  <tbody>
                    <tr v-for="(item,index) in classSessionStudentsData" :key="index">
                      <td>{{ index + 1 }}</td>
                      <td style="text-transform: capitalize;">{{item.surname	}} {{item.second_name}}</td>
                      <td>{{item.gender}}</td>
                    </tr>
                  </tbody>
                  </table>  
                </div>

                  <div v-if="total_items == 0" class="text-center">
                    <p>No students in this session</p>
          </div>

    </div>
    
  </div>
  
</div>

</div>

</div>
 
    </div>

  </div>

</template>
<style scoped></style>