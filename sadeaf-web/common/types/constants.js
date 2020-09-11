export const ASSIGNMENT_STATUSES = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  COMPLETE: 'COMPLETE',
  CANCELLED: 'CANCELLED',
  URGENT: 'URGENT',
  UNKNOWN: 'UNKNOWN',
}

export const ASSIGNMENT_STATUS_COLORS = {
  [ASSIGNMENT_STATUSES.PENDING]: '#f1b65d',
  [ASSIGNMENT_STATUSES.MATCHED]: '#65adff',
  [ASSIGNMENT_STATUSES.COMPLETE]: '#59cb7a',
  [ASSIGNMENT_STATUSES.CANCELLED]: '#ee5d5d',
  [ASSIGNMENT_STATUSES.URGENT]: '#fa4c4c',
  [ASSIGNMENT_STATUSES.UNKNOWN]: '#b34ef3',
}

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
]
