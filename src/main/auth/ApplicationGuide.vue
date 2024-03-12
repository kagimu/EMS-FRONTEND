<template>
 <div>
    <div class="row" style="margin-top: 120px;margin-bottom: 80px;">
      <div class="col-lg-3"></div>
      <div class="col-lg-6">
        <div class="align-centre mt-2 h6 font500 text-uppercase mb-2">
          <p class="text" style="color:#0b5dd7cc;"><b>Wholesome Ed</b></p>
          </div>
        <hr>
        <div class="card">
          <div class="card-body">

      <!-- <section class="ac-container" style="">
        <div>
          <input id="ac-1" name="accordion-1" type="radio" checked="">
          <label for="ac-1" >Getting Started</label>
          <article class="ac-small"  style="padding: 20px !important">
         
            <span>
              To get started, make sure you have:
            </span>
            <ol class="font50y0" style="padding-bottom: 20px;">
              <li>Register For a Free Account</li>
              <li>Activate Your Account</li>
              <li>Login Into Your Account</li>
              <li >Fill The Application Form</li>
            </ol>
          </article>
        </div>
        <div>
          <input id="ac-2" name="accordion-1" type="radio">
          <label for="ac-2">How we work</label>
          <article class="ac-medium">
            <p>Like you, I used to think the world was this great place where everybody lived by the same standards I did, then some kid with a nail showed me I was living in his world, a world where chaos rules not order, a world where righteousness is not rewarded. That's Cesar's world, and if you're not willing to play by his rules, then you're gonna have to pay the price. </p>
          </article>
        </div>
        <div>
          <input id="ac-3" name="accordion-1" type="radio">
          <label for="ac-3">References</label>
          <article class="ac-large">
            <p>You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man. </p>
          </article>
        </div>
        <div>
          <input id="ac-4" name="accordion-1" type="radio">
          <label for="ac-4">Contact us</label>
          <article class="ac-large">
            <p>You see? It's curious. Ted did figure it out - time travel. And when we get back, we gonna tell everyone. How it's possible, how it's done, what the dangers are. But then why fifty years in the future when the spacecraft encounters a black hole does the computer call it an 'unknown entry event'? Why don't they know? If they don't know, that means we never told anyone. And if we never told anyone it means we never made it back. Hence we die down here. Just as a matter of deductive logic. </p>
          </article>
        </div>
      </section> -->
           

    <div class="row" style="padding: 10px;">
      <div class="col-lg-8">
        <p style="text-align: left !important;color:#ef0f0fcc !important;font-size: 14px;;">APPLICATION GUIDELINES</p>
      </div>
      <div class="col-lg-4">
        <router-link class=" text-uppercase btn btn-sm btn-primary form-control" :to="{name:'login'}"  style="font-size: 12px !important;font-weight: 500px;">
          <i class="bi bi-box-arrow-in-up-left"></i>&nbsp;BACK TO LOGIN PAGE</router-link>
      </div>
      
    </div>
      <div class="accordion" id="accordionExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
        Getting Started
      </button>
    </h2>
    <div id="collapseOne" class="accordion-collapse collapse " aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <h1>How to get Started</h1>
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingTwo">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        Creating Your Account
      </button>
    </h2>
    <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Activate  your Account
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Login to your Account
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        Fill the Application Form
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>

  <div class="accordion-item">
    <h2 class="accordion-header" id="headingThree">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
       Track Your Application Status
      </button>
    </h2>
    <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
      <div class="accordion-body">
        <!-- content here -->
      </div>
    </div>
  </div>
</div>

          </div>
        </div>
       
        <div class="mt-5 mb-2 text-center">
          <router-link class="d-inline text-sm2 font500 text-white text-uppercase btn btn-sm btn-primary" :to="{name:'login'}"  style="font-size: 12px !important;font-weight: 500px;"><i class="bi bi-pencil-square"></i>&nbsp;BACK TO LOGIN PAGE</router-link></div>
      </div>
      <div class="col-lg-3"></div>
    </div>
  </div>

</template>
<script>
</script>
<style>
.text{
  font-size: 1.4rem!important;
    text-align: center;
    color: #0b5dd7cc !important;
    font-weight: 600px;
    padding-top: 15px;
    padding-bottom: 15px;
}
label{
  font-size: 16px !important;
    line-height: 0.5rem!important;
    color:rgb(0, 0, 0) !important;
    font-family: Spartan, sans-serif !important;
}
 p{
  color:rgba(14, 14, 14, 0.75) !important;
    font-size: .875rem!important;
    line-height: 1.25rem!important;
    font-weight: 500!important;
    margin: bottom 0.25em;
    font-family: Spartan, sans-serif I !important;
}

.ac-container {
    max-width: 600px;
}

.ac-container label {
    height: 30px !important;
    line-height: 21px !important;
    font-size: 12px !important;
    padding: 20px 20px;
    position: relative;
    z-index: 20;
    display: block;
    height: 30px;
    cursor: pointer;
    color: #777;
    text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
    line-height: 33px;
    font-size: 19px;
    background: #fff;
 
    box-shadow: 0 0 0 1px rgba(155,155,155,0.3),1px 0 0 rgba(255,255,255,0.9) inset,0 2px 2px rgba(0,0,0,0.1);
    font-size: 12px;
    height: 30px;
    line-height: 36px;
}

.ac-container {
    width: 100%;
    margin: 10px auto 30px auto;
    text-align: left;
}

.ac-container label:hover {
    background: #fff;
}

.ac-container input:checked + label,.ac-container input:checked + label:hover {
    background: #f1f2f3;
    color: #666;
    text-shadow: 0 1px 1px rgba(255,255,255,0.6);
    box-shadow: 0 0 0 1px rgba(155,155,155,0.3),0 2px 2px rgba(0,0,0,0.1);
    height: 30px;
    line-height: 21px;
    font-size: 13px;
}

.ac-container label:hover:after,.ac-container input:checked + label:hover:after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    right: 13px;
    top: 7px;
    //background: transparent url(../images/arrow_down.png) no-repeat center center;
}

.ac-container input:checked + label:hover:after {
    //background-image: url(../images/arrow_up.png);
}

.ac-container input {
    display: none;
}

.ac-container article {
  
    overflow: hidden;
    height: 0;
    position: relative;
    z-index: 10;
    -webkit-transition: height 0.3s ease-in-out,box-shadow 0.6s linear;
    -moz-transition: height 0.3s ease-in-out,box-shadow 0.6s linear;
    -o-transition: height 0.3s ease-in-out,box-shadow 0.6s linear;
    -ms-transition: height 0.3s ease-in-out,box-shadow 0.6s linear;
    transition: height 0.3s ease-in-out,box-shadow 0.6s linear;
}

.ac-container article p {
  color:rgba(14, 14, 14, 0.75) !important;
    font-size: .875rem!important;
    line-height: 1.25rem!important;
    font-weight: 500!important;
    margin: bottom 0.25em;
    font-family: Spartan, sans-serif !important;
    line-height: 23px;
    font-size: 10px;
    padding: 20px;
    text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
}

.ac-container input:checked ~ article {
    -webkit-transition: height 0.5s ease-in-out,box-shadow 0.1s linear;
    -moz-transition: height 0.5s ease-in-out,box-shadow 0.1s linear;
    -o-transition: height 0.5s ease-in-out,box-shadow 0.1s linear;
    -ms-transition: height 0.5s ease-in-out,box-shadow 0.1s linear;
    transition: height 0.5s ease-in-out,box-shadow 0.1s linear;
    box-shadow: 0 0 0 1px rgba(155,155,155,0.3);
}

.ac-container input:checked ~ article.ac-small {
    height: 140px;
}

.ac-container input:checked ~ article.ac-medium {
    height: 180px;
}

.ac-container input:checked ~ article.ac-large {
    height: 230px;
}


.textColor{
  color:rgba(33,37,41,0.75);
    font-size: .875rem!important;
    line-height: 1.25rem!important;
    font-weight: 500!important;
    margin: bottom 0.25em;
}
.text-sm2 {
    font-size: 13px !important;
    line-height: 0.5rem!important;
    color:white !important;
    font-weight: 900px !important;
  
}
.btn-info{
  background-color: #1d5f7d !important;
}
.btn{
  border-radius: 0px !important;
}
hr {
    margin: 1rem 0;
    color:#0b5dd762;
    border: 0;
    border-top: 1px solid;
    opacity: .25;

    padding-bottom: 10px;
}
.fs-4 {
    font-size: 1.2rem!important;
    text-align: center;

}

</style>