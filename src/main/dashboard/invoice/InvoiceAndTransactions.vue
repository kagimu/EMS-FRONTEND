<script setup>

import router from "@/config/router.js";
import {useRouter} from "vue-router";
import { useAbility } from '@casl/vue';
import AllInvoices from "@/main/dashboard/invoice/AllInvoices.vue";
import AllTransactions from "@/main/dashboard/transactions/AllTransactions.vue";
import AllStatements from "@/main/dashboard/invoice/AllStatements.vue";
const { can } = useAbility()
const routerData = useRouter()
const selectedTab = routerData.currentRoute.value.query.tab ?? 'invoices'

const switchTabs = (tab) => {
  router.push({name: "financial-records", query: {tab:tab}});
}


</script>

<template>
  <div>
    <div class="bg-white border rounded-md py-3 px-2 mt-4">

  <div class="flex border-b mt-1">
    <div class="cursor-pointer text-sm rounded-t-md ml-1 mr-1" :class="selectedTab === 'invoices' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('invoices')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Invoices
      </div>
    </div>
    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'transactions' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('transactions')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Transactions
      </div>
    </div>

    <div class="cursor-pointer text-sm  rounded-t-md mr-1" :class="selectedTab === 'statements' ? 'border-b-2 border-[#2c2f8c] text-[#2c2f8c] font-bold bg-[#f1f8fe]' : 'border-b border-[#bbbbbb]   bg-[#f1f1f1] hover:border-b hover:border-[#2c2f8c] hover:text-[#2c2f8c] hover:font-bold'" @click="switchTabs('statements')">
      <div class="py-1 px-3">
        <i class="bi bi-box-arrow-in-right mr-1"></i>
        Financial Statements
      </div>
    </div>

  </div>

  <div v-if="selectedTab === 'invoices'">
    <AllInvoices></AllInvoices>
  </div>

  <div v-if="selectedTab === 'transactions'">
    <AllTransactions></AllTransactions>
  </div>

  <div v-if="selectedTab === 'statements'">
   <AllStatements></AllStatements>
  </div>

</div>
  </div>
</template>

<style scoped>

</style>