<template>
  <label class="ems-field" :for="inputId">
    <span class="ems-field__label">
      {{ label }}<span v-if="required" class="ems-field__req">*</span>
    </span>

    <span
      class="ems-field__control"
      :class="{ 'ems-field__control--focus': focused, 'ems-field__control--error': !!error }"
    >
      <input
        :id="inputId"
        class="ems-field__input"
        :type="resolvedType"
        :value="modelValue"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="required"
        :inputmode="inputmode"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="focused = true"
        @blur="focused = false"
      />
      <button
        v-if="isPassword"
        type="button"
        class="ems-field__toggle"
        :aria-label="reveal ? 'Hide password' : 'Show password'"
        @click="reveal = !reveal"
      >
        {{ reveal ? 'Hide' : 'Show' }}
      </button>
    </span>

    <span v-if="error" class="ems-field__error">{{ error }}</span>
  </label>
</template>

<script setup>
import { computed, ref } from 'vue'

let fieldSeq = 0

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  inputmode: { type: String, default: undefined },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const focused = ref(false)
const reveal = ref(false)
fieldSeq += 1
const inputId = `ems-field-${fieldSeq}`
const isPassword = computed(() => props.type === 'password')
const resolvedType = computed(() => (isPassword.value && reveal.value ? 'text' : props.type))
</script>
