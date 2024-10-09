<template>
  <div class="text-center pa-4">
    <button @click="showDialog = true" class="settings-btn">
      Settings
    </button>

    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <div class="dialog-header">
          <button @click="showDialog = false" class="close-btn">✖</button>
          <h2>Settings</h2>
          <button @click="saveSettings" class="save-btn">Save</button>
        </div>

        <div class="dialog-content">
          <h3>User Controls</h3>
          <div class="list-item">
            <span>Content filtering</span>
            <p>Set the content filtering level to restrict apps that can be downloaded</p>
            <input type="checkbox" v-model="contentFiltering" />
          </div>
          <div class="list-item">
            <span>Password</span>
            <p>Require password for purchase or use password to restrict purchase</p>
            <input type="checkbox" v-model="passwordRequired" />
          </div>

          <h3>General</h3>
          <div class="list-item">
            <span>Notifications</span>
            <p>Notify me about updates to apps or games that I downloaded</p>
            <input type="checkbox" v-model="notifications" />
          </div>
          <div class="list-item">
            <span>Sound</span>
            <p>Auto-update apps at any time. Data charges may apply</p>
            <input type="checkbox" v-model="sound" />
          </div>
          <div class="list-item">
            <span>Auto-add widgets</span>
            <p>Automatically add home screen widgets</p>
            <input type="checkbox" v-model="widgets" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showDialog = ref(false);
const notifications = ref(false);
const sound = ref(true);
const widgets = ref(false);
const contentFiltering = ref(false);
const passwordRequired = ref(false);

const saveSettings = () => {
  // Implement save logic here
  console.log('Settings saved:', {
    notifications: notifications.value,
    sound: sound.value,
    widgets: widgets.value,
    contentFiltering: contentFiltering.value,
    passwordRequired: passwordRequired.value,
  });
  showDialog.value = false; // Close the dialog after saving
};
</script>

<style scoped>
.settings-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn,
.save-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.list-item {
  margin: 10px 0;
}

.list-item input[type="checkbox"] {
  margin-left: 10px;
}
</style>
