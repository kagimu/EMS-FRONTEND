// Real, permission-gated EMS sections. Each maps to an existing backend
// endpoint (backend/api/routes/Routes.go). Nothing is shown that has no
// endpoint, and the backend enforces permissions regardless of the UI.
export const emsSections = {
  'ems-organisation': {
    title: 'Organisation units',
    description: 'The structure of your organisation.',
    icon: 'bi bi-diagram-3',
    endpoint: '/main/ems/organisation-units',
    countNoun: 'unit',
    columns: [
      { key: 'name', label: 'Name', primary: true },
      { key: 'code', label: 'Code' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date' },
    ],
    searchKeys: ['name', 'code', 'number'],
  },
  'ems-stakeholders': {
    title: 'Stakeholders',
    description: 'Owners and other stakeholders of your organisation.',
    icon: 'bi bi-people',
    endpoint: '/main/ems/stakeholders',
    countNoun: 'stakeholder',
    manageTab: 'people',
    columns: [
      { key: 'user_number', label: 'User', primary: true },
      { key: 'stakeholder_type', label: 'Type', type: 'status' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date' },
    ],
    searchKeys: ['user_number', 'stakeholder_type', 'status'],
  },
  'ems-workflows': {
    title: 'Workflow requests',
    description: 'Approval requests and workflow items raised in your organisation.',
    icon: 'bi bi-diagram-2',
    endpoint: '/main/ems/approvals',
    countNoun: 'request',
    manageTab: 'approvals',
    columns: [
      { key: 'title', label: 'Title', primary: true },
      { key: 'decision_type', label: 'Decision' },
      { key: 'status', label: 'Status', type: 'status' },
      { key: 'created_at', label: 'Created', type: 'date' },
    ],
    searchKeys: ['title', 'decision_type', 'status', 'number'],
  },
  'ems-notifications': {
    title: 'Notifications',
    description: 'In-app notifications addressed to you.',
    icon: 'bi bi-bell',
    endpoint: '/main/ems/notifications',
    countNoun: 'notification',
    columns: [
      { key: 'title', label: 'Title', primary: true },
      { key: 'type', label: 'Type' },
      { key: 'created_at', label: 'Received', type: 'date' },
      { key: 'read_at', label: 'Read', type: 'read' },
    ],
    searchKeys: ['title', 'type', 'body'],
  },
  'ems-audit': {
    title: 'Audit log',
    description: 'Cross-cutting audit facts for your organisation.',
    icon: 'bi bi-clipboard-data',
    endpoint: '/main/ems/audit',
    countNoun: 'entry',
    columns: [
      { key: 'action', label: 'Action', primary: true },
      { key: 'actor_user_number', label: 'Actor' },
      { key: 'resource_type', label: 'Resource' },
      { key: 'created_at', label: 'When', type: 'date' },
    ],
    searchKeys: ['action', 'actor_user_number', 'resource_type'],
  },
  'ems-licensing': {
    title: 'Licence status',
    description: 'Your organisation’s current EMS licence.',
    icon: 'bi bi-patch-check',
    endpoint: '/main/ems/licence',
    single: true,
  },
}
