<template>
  <div>
    <!-- Organisation details -->
    <EmsContentPanel
      title="Organisation details"
      icon="bi bi-building"
      description="The profile of your current organisation."
      :count="null"
      :state="orgState"
      :error-message="orgError"
    >
      <div v-if="orgState === 'ready'" class="ems-form">
        <div class="ems-toolbar">
          <EmsField v-model="form.name" label="Organisation name" required />
          <EmsField v-model="form.phone" label="Telephone" inputmode="tel" />
          <EmsField v-model="form.email" label="Email" type="email" inputmode="email" />
          <EmsField v-model="form.address" label="Physical address" />
        </div>
        <div class="ems-toolbar">
          <EmsField v-model="form.website" label="Website" inputmode="url" />
          <EmsField v-model="form.facebook" label="Facebook" />
          <EmsField v-model="form.instagram" label="Instagram" />
          <EmsField v-model="form.twitter" label="Twitter / X" />
        </div>
        <div class="ems-toolbar">
          <EmsField v-model="form.whatsapp" label="WhatsApp" />
          <EmsField v-model="form.linkedin" label="LinkedIn" />
        </div>
        <div v-if="orgNote" class="ems-alert" :class="orgNote.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
          {{ orgNote.text }}
        </div>
        <div class="ems-actions">
          <button type="button" class="ems-btn ems-btn--primary" :disabled="orgSaving" @click="saveOrganisation">
            {{ orgSaving ? 'Saving…' : 'Save organisation' }}
          </button>
        </div>
      </div>
    </EmsContentPanel>

    <!-- Custom fields -->
    <EmsContentPanel
      title="Custom fields"
      icon="bi bi-input-cursor-text"
      :description="fieldsDescription"
      :count="activeDefinitions.length"
      count-noun="field"
      count-noun-plural="fields"
      :state="fieldsState"
      :error-message="fieldsError"
    >
      <template v-if="fieldsState === 'ready'" #actions>
        <button type="button" class="ems-btn" @click="showManage = !showManage">
          {{ showManage ? 'Hide field manager' : 'Manage fields' }}
        </button>
      </template>

      <div v-if="fieldsState === 'ready'">
        <!-- Values form (rendered dynamically from the definitions) -->
        <div v-if="activeDefinitions.length" class="ems-form">
          <template v-for="def in activeDefinitions" :key="def.number">
            <label v-if="def.type === 'boolean'" class="ems-field">
              <span class="ems-field__label">{{ def.label }}</span>
              <span><input type="checkbox" v-model="values[def.number]" true-value="true" false-value="false" /> {{ def.description }}</span>
            </label>

            <label v-else-if="def.type === 'select'" class="ems-field">
              <span class="ems-field__label">{{ def.label }}<span v-if="def.required" class="ems-field__req">*</span></span>
              <span class="ems-field__control">
                <select v-model="values[def.number]" class="ems-field__input">
                  <option value="">—</option>
                  <option v-for="opt in optionsOf(def)" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </span>
              <span v-if="def.description" class="ems-small ems-muted">{{ def.description }}</span>
            </label>

            <EmsField
              v-else
              v-model="values[def.number]"
              :label="def.label + (def.required ? ' *' : '')"
              :type="inputType(def.type)"
              :inputmode="inputMode(def.type)"
            />
          </template>

          <div v-if="valuesNote" class="ems-alert" :class="valuesNote.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
            {{ valuesNote.text }}
          </div>
          <div class="ems-actions">
            <button type="button" class="ems-btn ems-btn--primary" :disabled="valuesSaving" @click="saveValues">
              {{ valuesSaving ? 'Saving…' : 'Save custom fields' }}
            </button>
          </div>
        </div>
        <p v-else class="ems-small ems-muted">No custom fields have been defined yet. Use “Manage fields” to add one.</p>

        <!-- Field manager -->
        <section v-if="showManage" class="ems-form" style="margin-top: 18px; border-top: 1px solid #eef1f6; padding-top: 14px;">
          <h3 class="ems-panel__title">Add a custom field</h3>
          <div class="ems-toolbar">
            <EmsField v-model="newField.label" label="Label" required />
            <EmsField v-model="newField.key" label="Key (optional)" />
            <label class="ems-field">
              <span class="ems-field__label">Type</span>
              <span class="ems-field__control">
                <select v-model="newField.type" class="ems-field__input">
                  <option value="text">Text</option>
                  <option value="multiline">Multiline text</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="email">Email</option>
                  <option value="url">URL</option>
                  <option value="select">Dropdown</option>
                  <option value="boolean">Checkbox</option>
                </select>
              </span>
            </label>
            <EmsField v-model.number="newField.display_order" label="Order" type="number" inputmode="numeric" />
          </div>
          <EmsField v-if="newField.type === 'select'" v-model="newField.optionsCsv" label="Dropdown options (comma separated)" />
          <EmsField v-model="newField.description" label="Description" />
          <label class="ems-small"><input type="checkbox" v-model="newField.required" /> Required</label>
          <div v-if="managerNote" class="ems-alert" :class="managerNote.ok ? 'ems-alert--success' : 'ems-alert--error'" role="status">
            {{ managerNote.text }}
          </div>
          <div class="ems-actions">
            <button type="button" class="ems-btn ems-btn--primary" :disabled="managerSaving" @click="createField">
              {{ managerSaving ? 'Saving…' : 'Add field' }}
            </button>
          </div>

          <table v-if="definitions.length" class="ems-table">
            <thead>
              <tr><th>Label</th><th>Key</th><th>Type</th><th>Order</th><th>Active</th><th></th></tr>
            </thead>
            <tbody>
              <tr v-for="def in definitions" :key="def.number">
                <td class="ems-table__primary">{{ def.label }}<span v-if="def.required" class="ems-field__req">*</span></td>
                <td class="ems-table__muted">{{ def.key }}</td>
                <td>{{ def.type }}</td>
                <td>{{ def.display_order }}</td>
                <td>
                  <span class="ems-badge" :class="def.active ? 'ems-badge--ok' : 'ems-badge--muted'">
                    {{ def.active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button type="button" class="ems-link" @click="toggleActive(def)">
                    {{ def.active ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </EmsContentPanel>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import api from '@/config/api.js'
import EmsContentPanel from '@/main/ems/components/EmsContentPanel.vue'
import EmsField from '@/main/ems/components/EmsField.vue'

// ---- Organisation details ----
const form = reactive({ entity_number: '', name: '', phone: '', email: '', address: '', website: '', facebook: '', instagram: '', twitter: '', whatsapp: '', linkedin: '' })
const orgState = ref('loading')
const orgError = ref('')
const orgSaving = ref(false)
const orgNote = ref(null)

// ---- Custom fields ----
const definitions = ref([])
const values = reactive({})
const fieldsState = ref('loading')
const fieldsError = ref('')
const valuesSaving = ref(false)
const valuesNote = ref(null)
const showManage = ref(false)
const managerSaving = ref(false)
const managerNote = ref(null)
const newField = reactive({ label: '', key: '', type: 'text', description: '', required: false, display_order: 0, optionsCsv: '' })

const activeDefinitions = computed(() => definitions.value.filter((d) => d.active))
const fieldsDescription = computed(() => 'Fields defined by your organisation, stored on the server.')

function apiError(error, fallback) {
  return error?.response?.data?.message || fallback
}

function inputType(type) {
  if (type === 'number') return 'number'
  if (type === 'date') return 'date'
  if (type === 'email') return 'email'
  if (type === 'url') return 'url'
  return 'text'
}

function inputMode(type) {
  if (type === 'number') return 'numeric'
  if (type === 'email') return 'email'
  if (type === 'url') return 'url'
  return 'text'
}

function optionsOf(def) {
  try {
    return JSON.parse(def.options_json || '[]')
  } catch (error) {
    return []
  }
}

async function loadOrganisation() {
  orgState.value = 'loading'
  orgError.value = ''
  try {
    const response = await api.get('main/eos/entity/current')
    const entity = response?.data?.data
    if (!entity || !entity.number) {
      orgError.value = 'No current organisation is set for your account.'
      orgState.value = 'error'
      return
    }
    form.entity_number = entity.number
    for (const key of ['name', 'phone', 'email', 'address', 'website', 'facebook', 'instagram', 'twitter', 'whatsapp', 'linkedin']) {
      form[key] = entity[key] || ''
    }
    orgState.value = 'ready'
  } catch (error) {
    orgError.value = 'Could not load your organisation.'
    orgState.value = 'error'
  }
}

async function saveOrganisation() {
  orgNote.value = null
  orgSaving.value = true
  try {
    await api.post('main/eos/entity/update', { ...form })
    orgNote.value = { ok: true, text: 'Organisation saved.' }
    await loadOrganisation()
  } catch (error) {
    orgNote.value = { ok: false, text: apiError(error, 'Could not save the organisation (you may not have permission).') }
  } finally {
    orgSaving.value = false
  }
}

async function loadCustomFields() {
  fieldsState.value = 'loading'
  fieldsError.value = ''
  try {
    const response = await api.get('main/ems/organisation/custom-fields')
    definitions.value = response?.data?.data?.definitions || []
    const stored = response?.data?.data?.values || {}
    for (const def of definitions.value) {
      values[def.number] = stored[def.number] ?? def.default_value ?? (def.type === 'boolean' ? 'false' : '')
    }
    fieldsState.value = 'ready'
  } catch (error) {
    fieldsError.value = apiError(error, 'Could not load custom fields.')
    fieldsState.value = 'error'
  }
}

async function saveValues() {
  valuesNote.value = null
  valuesSaving.value = true
  try {
    const payload = {}
    for (const def of activeDefinitions.value) {
      payload[def.number] = values[def.number] ?? ''
    }
    await api.put('main/ems/organisation/custom-field-values', { values: payload })
    valuesNote.value = { ok: true, text: 'Custom field values saved.' }
    await loadCustomFields()
  } catch (error) {
    valuesNote.value = { ok: false, text: apiError(error, 'Could not save the custom fields.') }
  } finally {
    valuesSaving.value = false
  }
}

async function createField() {
  managerNote.value = null
  managerSaving.value = true
  try {
    const options = newField.type === 'select'
      ? newField.optionsCsv.split(',').map((s) => s.trim()).filter(Boolean)
      : []
    await api.post('main/ems/organisation/custom-fields', {
      label: newField.label,
      key: newField.key,
      type: newField.type,
      description: newField.description,
      required: newField.required,
      options,
      display_order: Number(newField.display_order) || 0,
      active: true,
    })
    managerNote.value = { ok: true, text: 'Custom field created.' }
    newField.label = ''
    newField.key = ''
    newField.type = 'text'
    newField.description = ''
    newField.required = false
    newField.optionsCsv = ''
    newField.display_order = 0
    await loadCustomFields()
  } catch (error) {
    managerNote.value = { ok: false, text: apiError(error, 'Could not create the custom field.') }
  } finally {
    managerSaving.value = false
  }
}

async function toggleActive(def) {
  managerNote.value = null
  try {
    await api.put(`main/ems/organisation/custom-fields/${def.number}`, {
      label: def.label,
      type: def.type,
      description: def.description,
      required: def.required,
      options: optionsOf(def),
      display_order: def.display_order,
      active: !def.active,
    })
    managerNote.value = { ok: true, text: def.active ? 'Field deactivated (values retained).' : 'Field activated.' }
    await loadCustomFields()
  } catch (error) {
    managerNote.value = { ok: false, text: apiError(error, 'Could not update the custom field.') }
  }
}

onMounted(() => {
  loadOrganisation()
  loadCustomFields()
})
</script>
