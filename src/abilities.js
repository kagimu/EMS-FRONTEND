import { defineAbility } from '@casl/ability'

// The login flow stores abilities as { action, resource }. Some older records
// use { action, subject }. Normalise both and default to "all" only when no
// subject was supplied.
function normalizeRules(permissions) {
  if (!Array.isArray(permissions)) {
    return []
  }

  return permissions
    .filter((permission) => permission && permission.action)
    .map((permission) => ({
      action: permission.action,
      subject: permission.subject || permission.resource || 'all',
    }))
}

function readStoredAbilities() {
  try {
    return JSON.parse(localStorage.getItem('abilities') || '[]')
  } catch (error) {
    return []
  }
}

// Built once at startup from the stored session, then kept in sync by
// updateAbilities() after sign-in / profile restore.
const ability = defineAbility((can) => {
  for (const rule of normalizeRules(readStoredAbilities())) {
    can(rule.action, rule.subject)
  }
})

// Replace the live rules. The @casl/vue plugin makes the ability reactive, so
// every $can / useAbility() check updates without a page reload.
export function updateAbilities(permissions) {
  ability.update(normalizeRules(permissions))
}

export default ability
