import axios from 'axios'

// EMS Developer Test Console — developer-only API helper.
//
// HARD CONSTRAINT (H1 Q-1): the console MUST NEVER send a `User-Number` header.
// The shared Education client (src/config/api.js) injects a legacy `user-number`
// header; therefore the console deliberately does NOT reuse it and instead uses
// this dedicated axios instance which sends only `Authorization: Bearer <token>`.
//
// This file is developer-only and must not be imported by Education code.

const baseURL = `${import.meta.env.VITE_APP_BASE_URL}`

const devHttp = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Defence-in-depth: strip any identity header variant before the request leaves
// the console, so a `User-Number` header can never be transmitted even if a
// caller mistakenly sets one.
const FORBIDDEN_IDENTITY_HEADERS = ['user-number', 'User-Number', 'user_number', 'User_number']
devHttp.interceptors.request.use((config) => {
  const headers = config.headers || {}
  for (const name of FORBIDDEN_IDENTITY_HEADERS) {
    if (headers[name] !== undefined && headers[name] !== null) {
      delete headers[name]
    }
  }
  config.headers = headers
  return config
})

// Recursively mask obvious secrets for display in the inspector. Never render
// raw tokens, passwords or secrets. Includes `licence_key`: the opaque licence
// key is returned only at issue/replace and must not persist in the inspector.
const SENSITIVE_KEY = /(token|password|secret|authorization|licence_key)/i
export function maskSensitive(value) {
  if (Array.isArray(value)) {
    return value.map((item) => maskSensitive(item))
  }
  if (value && typeof value === 'object') {
    const out = {}
    for (const [key, item] of Object.entries(value)) {
      out[key] = SENSITIVE_KEY.test(key) ? '***masked***' : maskSensitive(item)
    }
    return out
  }
  return value
}

// Send one request and return a structured result for the response inspector.
// `token` is the active developer session token (never a password).
export async function sendRequest({ token, method = 'GET', url, data, params } = {}) {
  const started = typeof performance !== 'undefined' ? performance.now() : Date.now()
  const headers = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const config = { method, url, headers }
  if (params !== undefined) config.params = params
  if (data !== undefined) config.data = data

  try {
    const response = await devHttp.request(config)
    return {
      ok: true,
      status: response.status,
      method,
      url,
      durationMs: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - started),
      body: response.data,
    }
  } catch (error) {
    const response = error.response
    return {
      ok: false,
      status: response ? response.status : 0,
      method,
      url,
      durationMs: Math.round((typeof performance !== 'undefined' ? performance.now() : Date.now()) - started),
      body: response ? response.data : null,
      error: response ? null : (error.message || 'Network error'),
    }
  }
}

// Authenticate a developer test session. Returns the structured result whose
// `body` (on success) contains { message, token, data }.
export function login(email, password) {
  return sendRequest({ method: 'POST', url: '/auth/login', data: { email, password } })
}

// Read the authenticated user's current active entity (organisation context).
export function fetchCurrentEntity(token) {
  return sendRequest({ token, method: 'GET', url: '/main/eos/entity/current' })
}

export { devHttp, baseURL }
