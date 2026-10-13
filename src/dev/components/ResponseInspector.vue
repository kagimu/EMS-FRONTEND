<template>
  <section class="dc-panel">
    <div class="dc-panel__title">
      <h2>Response Inspector ({{ inspector.records.length }}/{{ inspector.limit }})</h2>
      <button class="dc-btn" type="button" :disabled="!inspector.records.length" @click="inspector.clear()">
        Clear
      </button>
    </div>

    <p v-if="!inspector.records.length" class="dc-muted dc-small">
      No requests recorded yet. Every console request is logged here with its real status and body.
    </p>

    <template v-else>
      <table class="dc-table">
        <thead>
          <tr>
            <th>time</th>
            <th>actor</th>
            <th>request</th>
            <th>status</th>
            <th>ms</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in inspector.records" :key="record.id">
            <td class="dc-small">{{ record.at }}</td>
            <td class="dc-small">{{ record.actor || '—' }}</td>
            <td class="dc-small"><code>{{ record.method }} {{ record.url }}</code></td>
            <td :class="record.ok ? 'dc-ok' : 'dc-error'">{{ record.status || 'ERR' }}</td>
            <td class="dc-small">{{ record.durationMs == null ? '—' : record.durationMs }}</td>
          </tr>
        </tbody>
      </table>

      <details class="dc-detail">
        <summary class="dc-small">Last response body (secrets masked)</summary>
        <pre class="dc-path">{{ pretty(inspector.records[0].body) }}</pre>
      </details>
    </template>
  </section>
</template>

<script setup>
import { maskSensitive } from '@/dev/api/devApi.js'
import { useDevInspectorStore } from '@/dev/store/devInspector.js'

const inspector = useDevInspectorStore()

// Never render raw tokens/passwords/secrets: every body is masked before display.
function pretty(body) {
  if (body === null || body === undefined) {
    return '—'
  }
  try {
    return JSON.stringify(maskSensitive(body), null, 2)
  } catch (error) {
    return String(body)
  }
}
</script>

<style scoped>
.dc-panel {
  margin-top: 16px;
}
.dc-detail {
  margin-top: 8px;
}
.dc-detail summary {
  cursor: pointer;
}
.dc-path {
  background: #0f172a;
  color: #d7e3ff;
  border-radius: 6px;
  padding: 10px;
  overflow: auto;
  max-height: 320px;
  font-size: 12px;
  margin: 8px 0 0;
}
</style>
