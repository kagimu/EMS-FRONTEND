
<script setup>
import InvoicePayment from './InvoicePayment.vue';
import { onMounted, reactive, ref, watch, computed } from "vue";
import { useInvoiceStore } from "@/main/dashboard/invoice/store/invoice.js";
import { useRouter } from 'vue-router';
import useNotificationStore from "@/composables/useNotification.js";
import AppModal from "@/components/AppModal.vue";
import { useApplicationStore } from "@/main/application/applicationComponents/store/application.js";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { useAbility } from '@casl/vue';

const { can } = useAbility();
const invoiceStore = useInvoiceStore();
const showDialog = ref(false);
const invoiceData = ref([]);
const notificationStore = useNotificationStore();
const applicationStore = useApplicationStore();
const routerData = useRouter();
const invoice_number = ref(null);
const student_number = ref(null);

const userData = ref([]);
const mymodalpay = ref(false);
const thisInvoiceNumber = ref(null);
const studentName = ref(null);
const dob = ref(null);
const className = ref(null);
const academicYear = ref(null);
const studyPeriod = ref(null);
const stream = ref(null);
const status = ref(null);
const campus = ref(null);
const school = ref(null);
const actionType = ref(null);
const invoiceNum = ref(null);
const errorMessage = ref(null);
const confirmationRef = ref(null);

const props = defineProps({
  invoiceN: String,
  studentN: String
});

const showModal = (invoice) => {
  mymodalpay.value = true;
  thisInvoiceNumber.value = invoice;
};

onMounted(async () => {
   doFetchInvoices()
});


watch(
    () => props.studentN,
    async (data) => {
      if (data) {
        doFetchInvoices()
      }
    }
);


const  doFetchInvoices = () => {
  let invoice_number = props.invoiceN;
  let student_number = props.studentN;
  if(invoice_number){
    invoiceStore.fetchInvoiceId(invoice_number);
  }
  if(student_number){
    applicationStore.fetchStudent(student_number);
  }
}

watch(
  () => applicationStore.studentDataResponse,
  async (data) => {
    if (data) {
      userData.value = data;
      studentName.value = `${data.surname} ${data.second_name} ${data.other_name}`;
      dob.value = data.date_of_birth;
      className.value = data.current_enrollment.class;
      studyPeriod.value = data.current_enrollment.study_period;
      stream.value = data.current_enrollment.stream;
      status.value = data.current_enrollment.status;
      campus.value = data.current_enrollment.campus;
      school.value = data.current_enrollment.school;
      academicYear.value = data.current_enrollment.academic_year;
    }
  },
  { deep: true }
);

const myData = reactive({
  ref_number: invoice_number,
  date: null,
  due_date: null,
  total_amount: null,
  paid_amount: null,
  balance: null,
  status: null,
  invoiceN: null
});

watch(
  () => invoiceStore.invoiceResponseById,
  async (data) => {
    if (data) {
      invoiceData.value = data.data;
      myData.ref_number = data.data.ref_number;
      myData.date = data.data.date;
      myData.due_date = data.data.due_date;
      myData.total_amount = Intl.NumberFormat('en-US').format(data.data.total_amount);
      myData.paid_amount = Intl.NumberFormat('en-US').format(data.data.paid_amount);
      myData.balance = Intl.NumberFormat('en-US').format(data.data.balance);
      myData.status = data.data.status;
      myData.invoiceN = data.data.number;
    }
  },
  { deep: true }
);

const goBack = () => {
  window.history.back();
};

const openModal = () => {
  showDialog.value = true;
};

watch(
  () => invoiceStore.errorMessage,
  async (data) => {
    if (data) {
      errorMessage.value = data.message;
      notificationStore.errorToast("Error", data.message);
    }
  },
  { deep: true }
);

const invoice = ref({
  items: [
    { description: 'Item 2', price: 20 },
    { description: 'Item 3', price: 15 },
  ]
});

const total = 5000000;

const columns = computed(() => {
  const items = invoice.value.items;
  const numColumns = Math.ceil(items.length / 7);
  return Array.from({ length: numColumns }, (_, columnIndex) => {
    const startIndex = columnIndex * 7;
    return items.slice(startIndex, startIndex + 7);
  });
});

watch(
  () => invoiceStore.newInvoicePaymentResponse,
  async (data) => {
    if (data) {
      notificationStore.successToast("Success", data.message);
      mymodalpay.value = false;
      // await invoiceStore.fetchInvoiceId(props?.invoiceN);
    }
  }
);

const deleteInvoice = async () => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete this Invoice?");
  if (agreed) {
    await invoiceStore.deleteInvoice(myData.invoiceN);
  }
};

const cancelInvoice = async () => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to cancel this Invoice?");
  if (agreed) {
    await invoiceStore.cancelInvoice(myData.invoiceN);
  }
};

const cancelInvoicePayment = async (payment_number) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to cancel this Payment?");
  if (agreed) {
    await invoiceStore.cancelInvoicePayment(payment_number);
  }
};

const deleteInvoicePayment = async (payment_number) => {
  const agreed = await confirmationRef.value.confirm("Are you sure, you want to delete this Payment?");
  if (agreed) {
    await invoiceStore.deleteInvoicePayment(payment_number);
  }
};

watch(
  () => invoiceStore.cancelInvoiceResponse,
  async (data) => {
    if (data) {
      notificationStore.successToast("Success", data.message);
      await invoiceStore.fetchInvoiceId(props?.invoiceN);

    }
  }
);

watch(
  () => invoiceStore.cancelInvoicePaymentResponse,
  async (data) => {
    if (data) {
      notificationStore.successToast("Success", data.message);
      await invoiceStore.fetchInvoiceId(props?.invoiceN);
    }
  }
);

watch(
  () => invoiceStore.deleteInvoiceResponse,
  async (data) => {
    if (data) {
      notificationStore.successToast("Success", data.message);
      goBack();
    }
  }
);

watch(
  () => invoiceStore.deleteInvoicePaymentResponse,
  async (data) => {
    if (data) {
      notificationStore.successToast("Success", data.message);
      await invoiceStore.fetchInvoiceId(props?.invoiceN);
    }
  }
);

const printableContent = ref(null);

const printContent = () => {
  const printContents = printableContent.value.innerHTML;
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow.document.write(`
    <html>
    <head>
      <title>Invoice</title>
      <style>
        ${document.head.innerHTML}
      </style>
    </head>
    <body>
      ${printContents}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  // printWindow.close();
};


watch (
    () => invoiceStore.newInvoicePaymentResponse,
    async (data) => {
      if(data){
        mymodalpay.value = false
        doFetchInvoices()
      }
    }
)


</script>




<template>
  <div>
    <AppModal title="Pay" v-model="mymodalpay" xl>
      <InvoicePayment :invoiceNumber="thisInvoiceNumber"></InvoicePayment>
    </AppModal>

    <div class="row">
      <div class="col-12">
        <div class=" mt-3">
          <div class="">
            <div class="row">
              <div class="col-lg-7">
                <h6 style="margin-top:20px; text-align: left;font-size: 15px;">
                  Promissory Note<b></b>
                </h6>
              </div>
              <div class="col-lg-5">
                <!-- <button v-if="can('delete_invoice','general')" @click="deleteInvoice()" class="btn btn-danger btn-sm mb-2 mr-4" style="float: right;">
                  <small><i class="bi bi-trash">&nbsp;Delete</i></small>
                </button> -->
                <button @click="showModal(myData.invoiceN)" class="btn btn-primary btn-sm mb-2 mr-4" style="float: right;" type="button" v-if="can('pay_invoice','general')">
                  <small><i class="bi bi-check-lg"><small>&nbsp;Make Payment</small></i></small>
                </button>
                <button @click="printContent" class="btn btn-secondary btn-sm mb-2 mr-4" style="float: right;">
                  <small><i class="bi bi-printer">&nbsp;Print</i></small>
                </button>
                
                <span v-if="myData.status !== 'CANCELLED'"> <button @click="cancelInvoice()"
                                                                    class="btn btn-danger btn-sm mb-2 mr-4" style="float: right;" v-if="can('cancel_invoice','general')">
                  <small><i class="bi bi-x">&nbsp;cancel</i></small>
                </button>
              </span>
              </div>
            </div>
          </div>
          <div class="card-body" style="padding: 0;">
            <div class="container mt-1">
              <div ref="printableContent" class="printable">
                <section class="py-3 py-md-5 invoice-container">
                  <div class="container">
                    <div class="row justify-content-center">
                      <div class="col-12">
                        <div class="row mb-3">
                          <div class="col-12 col-sm-6 col-md-8 invoice-bill-to">
                            <h4>Bill To</h4>
                            <address>
                              <strong>{{ studentName }}</strong><br />
                              {{ school }}<br />
                              {{ campus }}<br />
                              {{ className + "(" + stream + ")" }}<br />
                              {{ academicYear }}, {{ studyPeriod }}<br />
                            </address>
                          </div>
                          <div class="col-12 col-sm-6 col-md-4 invoice-details">
                            <h4 class="row">
                              <span class="col-6">Note#</span>
                              <span class="col-6 text-sm-end">{{ myData.ref_number }}</span>
                            </h4>
                            <div class="row">
                              <span class="col-6">Invoice Date</span>
                              <span class="col-6 text-sm-end">{{ myData.date }}</span>
                              <span class="col-6">Due Date</span>
                              <span class="col-6 text-sm-end">{{ myData.due_date }}</span>
                              <span class="col-6">Status</span>
                              <span class="col-6 text-sm-end badge bg-warning text-black fw-bold"><b>{{ myData.status }}</b></span>
                            </div>
                          </div>
                        </div>

                        <div class="row mb-3">
                          <div class="col-12">
                            <div class="table-responsive">
                              <table class="table table-striped table-hover table-bordered invoice-table">
                                <thead>
                                  <tr>
                                    <th scope="col" class="text-uppercase">#</th>
                                    <th scope="col" class="text-uppercase">Qty</th>
                                    <th scope="col" class="text-uppercase">Item</th>
                                    <th scope="col" class="text-uppercase text-end">Unit Price</th>
                                    <th scope="col" class="text-uppercase text-end">Amount</th>
                                  </tr>
                                </thead>
                                <tbody class="table-group-divider">
                                  <tr v-for="(payment, index) in invoiceData?.items" :key="index">
                                    <td scope="row">{{ (index + 1) }}</td>
                                    <td scope="row">{{ payment.quantity }}</td>
                                    <td>{{ payment.item_name }}</td>
                                    <td class="text-end">{{ payment.unit_cost?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                    <td class="text-end">{{ payment.unit_cost?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" colspan="3" class="text-uppercase text-end">Total</th>
                                    <td class="text-end">{{ myData.total_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")  }}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" colspan="3" class="text-uppercase text-end">Paid</th>
                                    <td class="text-end">{{ myData.paid_amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")  }}</td>
                                  </tr>
                                  <tr>
                                    <th scope="row" colspan="3" class="text-uppercase text-end">Balance</th>
                                    <td class="text-end">{{ myData.balance?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")  }}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>

<!--        <div class="card mt-2">-->
<!--          <div class="card-header">-->
<!--            Payments-->
<!--            <hr />-->
<!--            <table class="table table-hover caption-top mt-5 table-sm payments-table">-->
<!--              <thead>-->
<!--                <tr>-->
<!--                  <th scope="col" style="width: 10%;">#</th>-->
<!--                  <th scope="col">Invoice Number</th>-->
<!--                  <th scope="col">Date</th>-->
<!--                  <th scope="col">By</th>-->
<!--                  <th scope="col">Amount</th>-->
<!--                  <th v-if="can('cancel_payment', 'general')">Action</th>-->
<!--                </tr>-->
<!--              </thead>-->
<!--              <tbody>-->
<!--                <tr v-for="(payment, index) in invoiceData.payments" :key="index">-->
<!--                  <td>{{ index + 1 }}</td>-->
<!--                  <td>{{ payment.invoice_ref_number }}</td>-->
<!--                  <td>{{ payment.date_time }}</td>-->
<!--                  <td>{{ payment.recorded_by }}</td>-->
<!--                  <td>{{ payment.amount?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")  }}</td>-->
<!--                  <td v-if="can('cancel_payment', 'general')">-->
<!--                    <button @click="cancelInvoicePayment(payment.payment_number)" class="btn btn-warning btn-sm mb-2 mr-2">-->
<!--                      <small><i class="bi bi-x">&nbsp;Cancel</i></small>-->
<!--                    </button>-->
<!--                    <button v-if="can('delete_payment', 'general')" @click="deleteInvoicePayment(payment.payment_number)" class="btn btn-danger btn-sm mb-2">-->
<!--                      <small><i class="bi bi-trash"></i> Delete</small>-->
<!--                    </button>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </tbody>-->
<!--            </table>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
  <ConfirmationModal ref="confirmationRef"></ConfirmationModal>
</template>


<style>
  .invoice-container {
    background-color: #f9f9f9;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  }

  .invoice-bill-to h4 {
    color: #4a4a4a;
    font-weight: bold;
  }

  .invoice-details {
    text-align: right;
  }

  .invoice-table th,
  .invoice-table td {
    padding: 12px;
    border: 1px solid #ddd;
  }

  .invoice-table th {
    background-color: #f1f1f1;
    font-weight: bold;
  }

  .invoice-table td {
    text-align: left;
  }

  .payments-table th,
  .payments-table td {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }

  .badge {
    padding: 8px;
    font-size: 12px;
  }

  @media print {
    .invoice-container {
      padding: 0;
      background-color: white;
      box-shadow: none;
    }

    .payments-table {
      font-size: 12px;
    }

    /* Adjust print-friendly styles for the invoice */
    h4 {
      font-size: 14px;
    }

    .invoice-table th, .invoice-table td {
      font-size: 12px;
    }

    .btn, .btn-danger, .btn-sm, .bi {
      display: none;
    }
  }

  address{
    text-transform: capitalize;
  }
</style>


<!-- body { font-family: Arial, sans-serif; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid black; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
.text-end { text-align: right; }
.mb-8 { margin-bottom: 2rem; text-align: left; font-size: 17px; }
.mb-2 { text-align: left; }
.text-sme { font-size: 14px; }
.non-printable { padding: 20px; background-color: #f0f0f0; }
.printable { padding: 20px; border: 1px solid #ccc; margin-top: 20px; }
img { display: block; margin-top: 20px; }
button { margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer; } -->