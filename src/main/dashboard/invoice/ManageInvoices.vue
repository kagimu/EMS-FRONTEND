<script setup>


import FinancialStatement from "@/main/dashboard/invoice/FinancialStatement.vue";
import Invoice from "@/main/dashboard/invoice/Invoice.vue";
import Transactions from "@/main/dashboard/transactions/Transactions.vue";

</script>
<template>
    <div>


      <FinancialStatement></FinancialStatement>

        <div class="row">
        <div class="col-12">
          <div class="mt-1 ">
            <div class="" style="padding: 0;">
                <div>
    <div class="m-0">
      <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
          <button class="nav-link navColor active" id="assembled-tab" data-bs-toggle="tab" data-bs-target="#assembled" type="button" role="tab" aria-controls="assembled" aria-selected="false"><small>Invoices And Financial Statement</small></button>
          <button class="nav-link navColor " id="class-list-tab" data-bs-toggle="tab" data-bs-target="#class-list" type="button" role="tab" aria-controls="class-list" aria-selected="false"><small>Transactions</small></button>
        </div>
      </nav>
      <div class="tab-content" id="nav-tabContent">
        <div class="tab-pane fade show active" id="assembled" role="tabpanel" aria-labelledby="assembled-tab" tabindex="0">
            <Invoice></Invoice>
        </div>

        <div class="tab-pane fade " id="class-list" role="tabpanel" aria-labelledby="class-list-tab" tabindex="0">
       <Transactions></Transactions>
        </div>
    
      </div>

    </div>
  </div>
  
  
            </div>
          </div>
        </div>
  

      </div>
    </div>
</template>
