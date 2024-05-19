<template>
  <div>
    <div class="text-sm">
      <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container-fluid">
          <router-link
              :to="{name:'welcome'}"
              class="text-white no-underline ml-5 text-[16px]">
            Wholesome ED
          </router-link>
          <button class="navbar-toggler" data-bs-target="#navbarCollapse" data-bs-toggle="collapse" type="button">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div id="navbarCollapse" class="navbar navbar-collapse">
            <div class="navbar-nav">
            </div>
            <div class="flex py-2">
              <router-link :to="{name:'welcome'}" class="mr-3 no-underline text-white"><i class="bi bi-house mr-2"></i>Home </router-link>
              <router-link :to="{name:'application'}" class="mr-3 no-underline text-white"><i class="bi bi-arrow-right-circle mr-2"></i>Apply </router-link>
              <router-link :to="{name:'login'}" class="mr-3 no-underline text-white"><i class="bi bi-box-arrow-in-right mr-2"></i> Login</router-link>
              <router-link :to="{name:'register'}" class="mr-3 no-underline text-white"><i class="bi bi-person mr-2"></i>Register </router-link>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <div class="w-[90%] mx-auto mt-5 mb-5">
      <div class="grid grid-cols-2 gap-4">

        <div class="text-center">
          <div class="text-[45px] mt-5">WholesomeEd</div>
          <div>Transforming Education</div>
        </div>

        <div class="text-[15px] border rounded-lg p-4 bg-white">
          <p class="leading-[1.75]">Welcome to <b>WholesomeEd</b>, the comprehensive education management platform designed to revolutionize how schools operate and students learn. Our integrated suite of modules covers every aspect of the educational experience, ensuring that schools run smoothly and students receive the highest quality education.</p>

          <p class="leading-[1.75]"> At WholesomeEd, we believe that a holistic approach to education is key to fostering growth, wellness, and academic excellence. From nutritious meals to cutting-edge curriculum design, our platform is built to support the diverse needs of the educational community.</p>

          <p class="leading-[1.75]">
            WholesomeEd is more than just a management system; it’s a partner in creating a nurturing, efficient, and inspiring educational environment. Join us in transforming education and supporting every student’s journey to success.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white pt-4 pb-5">
      <div class="text-center mb-3 text-[#6b7280]">
        <div class="text-[20px]">Begin your Online Enrollment Today !</div>
        <div class="text-sm">Get started in just 3 easy steps</div>
      </div>
      <div class="w-[70%] mx-auto">
        <div class="grid grid-cols-3 gap-4">

          <div>
            <router-link :to="{name:'register'}" class="nav-item nav-link">
              <div class="mx-auto bg-white border rounded-lg text-center py-3" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
                <div>
                  <div class="pb-2 text-gray-500"><b>Register</b></div>

                  <div class="text-gray py-4 px-3 text-gray-500 border-t border-b">
                    With supporting text below as a natural lead-in to additional content.
                  </div>
                  <div class="text-gray-500 mt-2"><b>More</b></div>
                </div>
              </div>
            </router-link>
          </div>


          <div>
            <router-link :to="{name:'login'}" class="nav-item nav-link">
              <div class="mx-auto bg-white border rounded-lg text-center py-3" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
                <div>
                  <div class="pb-2 text-gray-500"><b>Activate Account</b></div>

                  <div class="text-gray py-4 px-3 text-gray-500 border-t border-b">
                    With supporting text below as a natural lead-in to additional content.
                  </div>
                  <div class="text-gray-500 mt-2"><b>More</b></div>
                </div>
              </div>
            </router-link>
          </div>


          <div>
            <router-link :to="{name:'application-guide'}" class="nav-item nav-link">
              <div class="mx-auto bg-white border rounded-lg text-center py-3" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)">
                <div>
                  <div class="pb-2 text-gray-500"><b>Apply</b></div>

                  <div class="text-gray py-4 px-3 text-gray-500 border-t border-b">
                    With supporting text below as a natural lead-in to additional content.
                  </div>
                  <div class="text-gray-500 mt-2"><b>More</b></div>
                </div>
              </div>
            </router-link>
          </div>


        </div>
      </div>
    </div>

    <div class="mb-10 p-10">
      <div class="grid grid-cols-5 gap-4">

        <div class="border rounded-md bg-white">
          <div class="text-center  border-b py-2">Curriculum:</div>
         <div class="p-3 text-sm leading-[1.75]">Empower educators to craft engaging and standards-aligned lesson plans. Our Curriculum module offers customizable tools to design and deliver effective educational content, promoting a dynamic and inclusive learning environment.</div>
        </div>

        <div class="border rounded-md bg-white">
          <div class="text-center border-b py-2">Assessments:</div>
          <div class="p-3 text-sm leading-[1.75]">Accurate and insightful evaluations are crucial for student development. The Assessments module enables teachers to create, administer, and grade a variety of assessments, providing real-time feedback and analytics to track student progress.</div>
        </div>

        <div class="border rounded-md bg-white">
          <div class="text-center border-b py-2">Enrollment:</div>
          <div class="p-3 text-sm leading-[1.75]">Streamline the student registration process with ease. Our Enrollment module simplifies application submission, status tracking, and information management, making it easier for families to enroll and stay informed.</div>
        </div>

        <div class="border rounded-md bg-white">
          <div class="text-center border-b py-2">Admission:</div>
          <div class="p-3 text-sm leading-[1.75]">Select the best candidates efficiently and fairly. The Admission module facilitates application review, interview scheduling, and decision-making workflows, ensuring a transparent and organized admission process.</div>
        </div>

        <div class="border rounded-md bg-white">
          <div class="text-center border-b py-2">Catering:</div>
          <div class="p-3 text-sm leading-[1.75]">Ensuring students are well-nourished is foundational to their success. Our Catering module manages meal planning, accommodates dietary needs, and integrates with local suppliers to provide healthy and delicious meals.</div>
        </div>

      </div>
    </div>

    <div>&nbsp;</div>


    <footer class="absolute bottom-0 left-0 w-screen bg-[#0d56c3] py-0">
      <div class="flex justify-between px-3 py-1">
        <div class="text-white text-sm"><small>© 2023 WholeSome Ed, All rights reserved.</small></div>
        <a  class="text-white no-underline text-sm" href="#"><small><span>Powered by</span> <b>Hamsoft</b></small></a>
      </div>
    </footer>

  </div>
</template>



<style scoped>

div.card {
  width: 300px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  height: 180px;
  padding-top: 15px;
}
.text-gray {
  --tw-text-opacity: 1;
  color: rgba(80, 80, 80, var(--tw-text-opacity));
}
.card-title{
  font-size: 1.25rem;

}
.hr{
  display: none;
  border-top:none;
  width: 150px;
  border-bottom: 2px solid rgb(0, 123, 255);
  border-left: none;
  border-right: none;
  margin-left: 30%;
  margin-right: 30%;
}
.navbar-expand-lg .navbar-nav .nav-link{
  color:white;
}
.container, .container-fluid, .container-lg, .container-md, .container-sm, .container-xl, .container-xxl {
  padding: 0px !important; }
.bg-primary{
  background-color: rgb(13, 86, 195) !important;
}
.navbar{
  padding: 0px;;
}


</style>

<script setup>

</script>
