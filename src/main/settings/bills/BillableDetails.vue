<script setup>
import { onMounted, ref, watch, reactive } from "vue";
import useNotificationStore from "@/composables/useNotification.js";
import { useAbility } from '@casl/vue';
import AppModal from "@/components/AppModal.vue";
import NewBillables from "@/main/settings/bills/NewBillables.vue";
import { useBillStore } from "@/main/settings/bills/store/bills.js";
import { useSchoolStore } from "@/main/dashboard/manageSchool/store/school.js";

const notificationStore = useNotificationStore();
const schoolStore = useSchoolStore();
const mymodal = ref(false);
const errorMessage = ref(null);
const loader = ref(false);
const { can } = useAbility();
const schoolList = ref([]);
const billStore = useBillStore();
const school_number = ref("");
const billableData = ref([]);

const props = defineProps({
  billableNumber: String
});

onMounted(async () => {
  schoolStore.fetchSchools();
  doFetchBillablesDetails(props.billableNumber);
});

const dataInfo = reactive({
  billable_number: "",
  status: "",
  class_name: "",
  study_period_name: "",
  campus_name: "",
  type: "",
  total_amount: 0,
});

const showModal = () => {
  mymodal.value = true;
};

const doFetchBillablesDetails = (billableNumber) => {
  let data = {
    billable_number: billableNumber
  };
  billStore.fetchBillableDetails(data);
};

watch(
  () => billStore.billableDetailsResponse,
  async (data) => {
    if (data) {
      billableData.value = data.data;
      Object.assign(dataInfo, {
        billable_number: billableData.value.billable_number,
        status: billableData.value.status,
        class_name: billableData.value.class_name,
        study_period_name: billableData.value.study_period_name,
        campus_name: billableData.value.campus_name,
        type: billableData.value.type,
        total_amount: billableData.value.total_amount
      });
    }
  },
  { deep: true }
);

watch(
  () => schoolStore.schoolsResponse,
  async (data) => {
    if (data) {
      schoolList.value = data.data;
    }
  },
  { deep: true }
);

watch(
  () => billStore.newBillableResponse,
  async (data) => {
    if (data) {
      mymodal.value = false;
    }
  },
  { deep: true }
);

watch(
  () => billStore.errorMessage,
  async (data) => {
    if (data) {
      errorMessage.value = data.message;
      notificationStore.errorToast("Error", data.message);
      loader.value = false;
    }
  },
  { deep: true }
);


const printableContent = ref(null);
const printContent = () => {
  const printContents = printableContent.value.innerHTML;
  const originalContents = document.body.innerHTML;

  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write('<html><head><title>Print</title>');
  printWindow.document.write(
    '<style>body { font-family: Arial, sans-serif; } </style>'); 
  printWindow.document.write('</head><body>');
  printWindow.document.write(printContents);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
}

</script>

<template>
  <div>
    <div class="row mb-3 printable" ref="printableContent" >
      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Bill Details</h5>
            <div>
              <button class="btn btn-secondary btn-sm me-2" >
                <i class="bi bi-pencil-square"></i> Edit
              </button>
              <button class="btn btn-danger btn-sm">
                <i class="bi bi-trash"></i> Delete
              </button>
            </div>
          </div>
          <div class="card-body">
            <div class="container">
              <section class="py-3">
                <div class="row">
                  <div class="col-md-8">
                    <h5>Bill To</h5>
                    <address>
                      <strong>Bill No:</strong> <u>{{ billableData.billable_number }}</u><br>
                      <strong>Class:</strong> {{ billableData.class_name }}<br>
                      <strong>Campus:</strong> {{ billableData.campus_name }}<br>
                      <strong>Study Period:</strong> {{ billableData.study_period_name }}<br>
                      <strong>Status:</strong> <span :class="{'text-success': billableData.status === 'Paid', 'text-danger': billableData.status !== 'Paid'}">{{ billableData.status }}</span>
                    </address>
                  </div>
                  <div class="col-md-4 text-end">
                    <button class="btn btn-outline-secondary btn-sm mb-2" @click="">
                      <i class="bi bi-printer"></i> Print
                    </button>
                  </div>
                </div>
              </section>

              <section class="mb-3"  >
                <div class="table-responsive">
                  <table class="table table-striped table-hover">
                    <thead class="table-dark">
                      <tr>
                        <th scope="col" class="text-uppercase">Qty</th>
                        <th scope="col" class="text-uppercase">Item</th>
                        <th scope="col" class="text-uppercase text-end">Unit Price</th>
                        <th scope="col" class="text-uppercase text-end">Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in billableData.billable_items" :key="index">
                        <td>{{ item.quantity }}</td>
                        <td>{{ item.item_name }}</td>
                        <td class="text-end">{{ item.unit_cost?.toLocaleString() ?? 'N/A' }}</td>
                        <td class="text-end">{{ item.total_cost?.toLocaleString() ?? 'N/A' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppModal v-model="mymodal">
      <NewBillables :billableData="billableData" />
    </AppModal>
  </div>
</template>

<style scoped>
.card-header {
  font-size: 18px;
}

.card {
  border-radius: 10px;
  overflow: hidden;
}

.table thead th {
  background-color: #343a40;
  color: white;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.btn {
  font-size: 14px;
  border-radius: 4px;
}

h5 {
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
