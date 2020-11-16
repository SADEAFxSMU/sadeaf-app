export const ASSIGNMENT_STATUSES = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  COMPLETE: 'COMPLETE',
  CANCELLED: 'CANCELLED',
  URGENT: 'URGENT',
  UNKNOWN: 'UNKNOWN',
  OPTED_IN: 'OPTED_IN',
  OPTED_OUT: 'OPTED_OUT',
};

export const ASSIGNMENT_STATUS_COLORS = {
  [ASSIGNMENT_STATUSES.PENDING]: '#f1b65d',
  [ASSIGNMENT_STATUSES.MATCHED]: '#65adff',
  [ASSIGNMENT_STATUSES.COMPLETE]: '#59cb7a',
  [ASSIGNMENT_STATUSES.CANCELLED]: '#ee5d5d',
  [ASSIGNMENT_STATUSES.URGENT]: '#fa4c4c',
  [ASSIGNMENT_STATUSES.UNKNOWN]: '#b34ef3',
  [ASSIGNMENT_STATUSES.OPTED_IN]: '#f1b65d',
  [ASSIGNMENT_STATUSES.OPTED_OUT]: '#ee5d5d',
};

export const EVENT_PURPOSE_OPTIONS = [
  'Conference/Dialogue/Forum/Seminar/Rally',
  'Counselling',
  'Course / Workshop',
  'Deaf Awareness Program / Sign Language Courses',
  'Discussion/Meeting',
  'Employment Related',
  'Events (Exhibition/Excursion/Field Trip)',
  'Lectures/Tutorial/Practical Lab',
  'Legal',
  'Media',
  'Medical',
  'Personal/Social',
  'Police',
  'Religious',
  'ROM/ROMM',
  'Tours',
  'Others',
];

export const EVENT_CATEGORY_OPTIONS = [
  'Technology',
  'Lifeskills',
  'Engineering',
  'Design',
  'Science',
  'Business/Finance',
  'Social Science',
  'Others',
];
export const EVENT_CATEGORY_OPTIONS_DEFAULT = 'Others';

export const EVENT_EDUCATION_OPTIONS = ['University', 'Polytechnic', 'ITE', 'Others', 'NA'];
export const EVENT_EDUCATION_OPTIONS_DEFAULT = 'NA';

export const ROLES = {
  admin: 'admin',
  client: 'client',
  volunteer: 'volunteer',
  service_requestor: 'service_requestor',
};

export const ROLE_EL_TAG_TYPES = {
  [ROLES.admin]: 'primary',
  [ROLES.client]: 'danger',
  [ROLES.volunteer]: 'success',
  [ROLES.service_requestor]: 'danger',
};

export const ROLE_PROFILE_PAGE_MAPPING = {
  [ROLES.admin]: '/admin',
  [ROLES.volunteer]: '/volunteer',
  [ROLES.service_requestor]: '/org',
  [ROLES.client]: '/client',
};

export const RATING_KEYS = [
  'notetaker_conduct',
  'notetaker_punctual',
  'post_session_understanding',
  'live_information_understanding',
  'live_interaction',
];

export const PREFERRED_COMM_MODES = {
  SIGN_LANGUAGE: 'Sign Language',
  SPEECH: 'Speech',
};

export const CLIENT_CHARGE_PER_HOUR = 40;
