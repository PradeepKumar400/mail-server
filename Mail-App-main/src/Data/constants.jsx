export const SIDEBAR_ITEMS = [
  {
    name: 'Inbox',
    icon: '📥',
    path: '/inbox',
    count: 0
  },
  {
    name: 'Starred',
    icon: '⭐',
    path: '/starred',
    count: 0
  },
  {
    name: 'Sent',
    icon: '📤',
    path: '/sent',
    count: 0
  },
  {
    name: 'Draft',
    icon: '📝',
    path: '/draft',
    count: 0
  },
  {
    name: 'Archive',
    icon: '🗄️',
    path: '/archive',
    count: 0
  },
  {
    name: 'Spam',
    icon: '🚫',
    path: '/spam',
    count: 0
  },
  {
    name: 'Trash',
    icon: '🗑️',
    path: '/trash',
    count: 0
  },
  {
    name: 'All Mail',
    icon: '📧',
    path: '/allmail',
    count: 0
  }
];

export const EMAIL_CATEGORIES = {
  PRIMARY: 'primary',
  SOCIAL: 'social',
  PROMOTIONS: 'promotions',
  UPDATES: 'updates'
};

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login'
  },
  MAIL: {
    SEND: '/api/mail/send',
    INBOX: '/api/mail/inbox',
    EMAIL: '/api/mail/email'
  },
  EMAILS: {
    CREATE: '/api/emails/create',
    LIST: '/api/emails/list',
    SET_PRIMARY: '/api/emails/:id/set-primary'
  },
  BUSINESS: {
    REGISTER: '/api/business/register',
    DOMAINS: '/api/business/domains',
    VERIFY: '/api/business/domain/:id/verify'
  }
};