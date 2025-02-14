<script setup>
import { onMounted, reactive, ref } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import  AppModal from "@/components/AppModal.vue";

const notificationStore = useNotificationStore();
const showingAbsentModal = ref(false)
const showingPresentModal = ref(false)
const datePresent = ref(null)


onMounted(() => {
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  datePresent.value = date

})


const staffList = reactive([
  { id: 1, name: "John Doe", class: "Primary One", school: "ABC School",campus: "CBC School", status: null },
  { id: 2, name: "Jane Smith", class: "Primary Two", school: "XYZ Academy",campus: "LKS School", status: null },
]);


const markPresent = () => {
showingPresentModal.value = true
}

const markAbsent = () => {
showingAbsentModal.value = true
}

</script>

<template>

  <AppModal  v-model="showingAbsentModal" title="Mark Absent" @close="showingAbsentModal = false" xs>
    <form>
      <div class="mb-3">
        <label for="reason" class="form-label">Reason</label>
        <textarea class="form-control" id="reason" rows="3"></textarea>
      </div>
    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-danger me-2" @click="showingAbsentModal = false">Cancel</button>
      <button type="submit" class="btn btn-primary btn-sm text-sm" @click="showingAbsentModal = false">Comfirm</button>
    </div>
    </form>
  </AppModal>

  <AppModal  v-model="showingPresentModal" title="Mark Present" @close="showingPresentModal = false" xs>
    <form>

      <div class="mb-3">
        <label for="reason" class="form-label">Date</label>
        <input type="date" class="form-control" id="reason" rows="3" v-model="datePresent">
      </div>

      <div class="mb-3">
        <label for="reason" class="form-label">Arrival Time</label>
        <input type="time" class="form-control" id="reason" rows="3">
      </div>
    <div class="d-flex justify-content-end">
      <button type="button" class="btn btn-danger me-2" @click="showingPresentModal = false">Cancel</button>
      <button type="submit" class="btn btn-primary btn-sm text-sm" @click="showingPresentModal = false">Comfirm</button>
    </div>
    </form>
  </AppModal>
  
  <div class="">
    <div class="row mt-1">
      <div class="col-12">
        <div class="v">
          <div class="">
            <!-- <h4 class="mb-3 text-sm">Staff Attendance</h4> -->
            <table class="table text-xs table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Class</th>
                  <th>School</th>
                  <th>Campus</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="staff in staffList" :key="staff.id">
                  <td>{{ staff.name }}</td>
                  <td>{{ staff.class }}</td>
                  <td>{{ staff.school }}</td>
                  <td>{{ staff.campus }}</td>
                  <td>
                  Present
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn.active {
  background-color: #28a745;
  color: white;
}
</style>
