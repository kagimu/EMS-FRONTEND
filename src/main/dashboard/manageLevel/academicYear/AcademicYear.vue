<template>
  <div>
    <div class="modal fade" id="newAcademicYearModal" tabindex="-1" :class="{ show: newAcademicYearDialog }" aria-labelledby="" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header text-sm p-0">
            <h6 class="modal-title ml-3 mt-2 mb-2">Add Academic Year</h6>
            <button style="margin-right: 5px;" type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-2 mb-2">
              <new-academic-year></new-academic-year>
            </div>
          </div>
        </div>
      </div>
    </div>



    <div class="flex justify-content-between mt-10 mb-4 mr-3">
      &nbsp;
      <button type="button"  class="btn btn-sm buttonStyle btn-primary mr-2"  @click="addSubject" data-bs-toggle="modal" data-bs-target="#newAcademicYearModal">
        <i style="font-size: 15px;"  class="bi-plus mr-2"></i>
        Add Academic Year
      </button>
    </div>



    <table class="table table-hover caption-top" style="font-size: 14px;">
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Academic Year</th>
        <th scope="col">Study Periods</th>
        <th scope="col">Date Period</th>
        <!--        <th scope="col">Action</th>-->
      </tr>
      </thead>
      <tbody>
      <tr v-for="(classes, index) in subjectList" :key="index">
        <td>{{index+1}}</td>
        <td> {{classes.name}}</td>
        <td> {{classes.class+" ("+classes.abbreviation+")"}}</td>
        <td> {{classes.class+" ("+classes.abbreviation+")"}}</td>
        <!--        <td>
                  <div>
                    <i
                        style="font-size: 13px;"
                        data-bs-toggle="offcanvas" data-bs-target="#editClass" aria-controls="offcanvasRight"
                        class="bi-pencil mr-2 cursor-pointer" @click="editClass(classes)"></i>
                    <i style="font-size: 13px;" class="bi-trash cursor-pointer"  @click="deleteClass(classes)"></i>
                  </div>
                </td>-->
      </tr>
      </tbody>
    </table>





  </div>
</template>

<script setup>
import NewSubjectClass from "@/main/dashboard/manageLevel/subjectClasses/NewSubjectClass.vue";
import {ref} from "vue";
import NewAcademicYear from "@/main/dashboard/manageLevel/academicYear/NewAcademicYear.vue";
const newAcademicYearDialog = ref( false)

const addSubject = (item) => {
  // classNumber.value = item.number
  newAcademicYearDialog.value = true
}


</script>

<style scoped>

</style>