<script setup>
import FinancialStatement from "@/main/dashboard/invoice/FinancialStatement.vue";
import Invoice from "@/main/dashboard/invoice/Invoice.vue";
import Transactions from "@/main/dashboard/transactions/Transactions.vue";
import {ref} from "vue";


const selectedTab = ref("invoices")



const switchTabs = (tab) => {
   selectedTab.value = tab
}

</script>
<template>
    <div>


      <FinancialStatement></FinancialStatement>



      <div>
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
        </div>

        <div v-if="selectedTab === 'invoices'">
          <Invoice></Invoice>
        </div>
        <div v-if="selectedTab === 'transactions'">
          <Transactions></Transactions>
        </div>

      </div>



    </div>
</template>
