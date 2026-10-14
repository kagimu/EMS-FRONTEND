import api from '@/config/api.js'

// Normalised EMS client-plane reads. Every endpoint is permission-gated by the
// backend; failures are classified so pages can show honest states instead of
// inventing data.

export function listFrom(body) {
  if (!body) return []
  if (Array.isArray(body)) return body
  if (Array.isArray(body.data)) return body.data
  return []
}

export function totalFrom(body, list) {
  return typeof body?.total === 'number' ? body.total : list.length
}

function classify(error) {
  const status = error?.response?.status
  if (status === 401) return 'Not signed in'
  if (status === 403) return 'You do not have access'
  if (status === 404) return 'Not available'
  return 'Unavailable'
}

// Fetch a list endpoint. Always resolves to { available, list, total, reason }.
export async function fetchList(url, params) {
  try {
    const response = await api.get(url, { params })
    const list = listFrom(response.data)
    return { available: true, list, total: totalFrom(response.data, list), reason: '' }
  } catch (error) {
    return { available: false, list: [], total: null, reason: classify(error) }
  }
}

// Fetch a single-object endpoint (e.g. licence status).
export async function fetchObject(url, params) {
  try {
    const response = await api.get(url, { params })
    return { available: true, object: response.data?.data ?? response.data ?? null, reason: '' }
  } catch (error) {
    return { available: false, object: null, reason: classify(error) }
  }
}
