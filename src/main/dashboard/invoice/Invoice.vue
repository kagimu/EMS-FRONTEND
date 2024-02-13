<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card mt-3">
          <div class="card-header">
     <div class="row">
      <div class="col-lg-4">
          <h6 style="margin-top:20px; text-align: left;font-size: 15px;">4 Invoices<b></b>     </h6>
      </div>
      <div class="col-lg-8">
        <RouterLink :to="{name : 'new-invoice'}" class="btn btn-primary btn-sm" style="float: right;">
          <small><i class="bi bi-plus"> Add Custom Invoice</i></small></RouterLink></div>
     </div>
         </div>
          <div class="card-body" style="padding: 0;">
  <div class="container mt-4">
    <table
      id="datatable"
      class="table table-striped"
      style="font-size: 13px !important;"
    >
      <thead>
        <tr>
          <th>Payer</th>
          <th>Amount</th>
          <th>Invoice Title</th>
          <th>Invoice no.</th>
          <th>Date Issued</th>
          <th>Status</th>
          <th>#</th>
        </tr>
   
      </thead>
      <tbody>
       
     
           <tr>
          <td>Collins Mpiima</td>
          <td>40000</td>
          <td>Service Payment</td>
          <td>#309070113618</td>
          <td>Jan 17, 2024 1:08 PM</td>
          <td><span class="link-success">Paid</span></td>
          <td>
            <router-link
                class="text-decoration-none"
                :to="{name:'invoice-details', query:{Invid:invoiceId}}"
            ><button class="link-primary" style="border-width: 0px;text-decoration: none;" title=""><small>
            <i class="bi bi-eye">&nbsp;View Details</i></small></button></router-link>  
            </td>
        </tr>  
          
      </tbody>
    </table>
  </div>
  </div>
  </div>
  </div>
  </div>

  </div>
  </template>

<script setup>
let invoiceId = "sirina-id"

</script>

<style>

</style>