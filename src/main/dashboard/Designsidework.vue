<template>
  <div>
    <!-- Trigger button for Parent Modal -->
    <button @click="showParentModal = true" class="btn btn-primary">
      Open Parent Modal
    </button>

    <!-- Parent Modal -->
    <div
      class="modal fade"
      :class="{ show: showParentModal }"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="parentModalLabel"
      aria-hidden="true"
      v-if="showParentModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="parentModalLabel">Parent Modal</h5>
            <button type="button" class="btn-close" @click="closeParentModal"></button>
          </div>
          <div class="modal-body">
            <p>This is the Parent Modal.</p>
            <!-- Trigger button for Nested Modal -->
            <button @click="showNestedModal = true" class="btn btn-secondary">
              Open Nested Modal
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Nested Modal -->
    <div
      class="modal fade"
      :class="{ show: showNestedModal }"
      style="display: block"
      tabindex="-1"
      role="dialog"
      aria-labelledby="nestedModalLabel"
      aria-hidden="true"
      v-if="showNestedModal"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="nestedModalLabel">Nested Modal</h5>
            <button type="button" class="btn-close" @click="closeNestedModal"></button>
          </div>
          <div class="modal-body">
            <p>This is the Nested Modal.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const showParentModal = ref(false);
const showNestedModal = ref(false);

const closeParentModal = () => {
  showParentModal.value = false;
};

const closeNestedModal = () => {
  showNestedModal.value = false;
};

// Manage body scroll
const handleBodyScroll = (status) => {
  document.body.style.overflow = status ? 'hidden' : 'auto';
};

watch([showParentModal, showNestedModal], ([newParent, newNested]) => {
  handleBodyScroll(newParent || newNested);
});
</script>

<style scoped>
.modal {
  display: none;
}
.modal.show {
  display: block;
}
.modal.show + .modal.show {
  z-index: 1060; /* Ensures Nested Modal appears above Parent Modal */
}
</style>
