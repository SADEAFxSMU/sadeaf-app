const fetch = require('node-fetch');
const CRUD_TREE_SERIALIZED = require('./crud_tree.json');

const DEBUG = true;
const OPERATIONS = ['select', 'insert', 'update', 'delete'];
const ROLES = new Set();

const HASURA_TABLES = [
  {
    "table": {
      "schema": "public",
      "name": "account"
    },
    "object_relationships": [
      {
        "name": "admin",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "admin"
            },
            "column_mapping": {
              "id": "account_id"
            }
          }
        }
      },
      {
        "name": "client",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "client"
            },
            "column_mapping": {
              "id": "account_id"
            }
          }
        }
      },
      {
        "name": "notification_setting",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "notification_setting"
            },
            "column_mapping": {
              "id": "account_id"
            }
          }
        }
      },
      {
        "name": "service_requestor",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "service_requestor"
            },
            "column_mapping": {
              "id": "account_id"
            }
          }
        }
      },
      {
        "name": "volunteer",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "volunteer"
            },
            "column_mapping": {
              "id": "account_id"
            }
          }
        }
      }
    ],
    "array_relationships": [
      {
        "name": "memberships",
        "using": {
          "foreign_key_constraint_on": {
            "column": "account_id",
            "table": {
              "schema": "public",
              "name": "membership"
            }
          }
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "_and": [
              {
                "service_requestor": {
                  "account_id": {
                    "_is_null": true
                  }
                }
              },
              {
                "volunteer": {
                  "account_id": {
                    "_is_null": true
                  }
                }
              },
              {
                "client": {
                  "service_requestor": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              },
              {
                "admin": {
                  "account_id": {
                    "_is_null": true
                  }
                }
              }
            ]
          },
          "columns": [
            "contact",
            "email",
            "name",
            "password",
            "username"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "contact",
            "created_at",
            "email",
            "id",
            "name",
            "updated_at",
            "username"
          ],
          "filter": {
            "id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "allow_aggregations": true
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "contact",
            "created_at",
            "email",
            "id",
            "name",
            "updated_at",
            "username"
          ],
          "filter": {
            "_or": [
              {
                "client": {
                  "service_requestor": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              },
              {
                "id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            ]
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "contact",
            "created_at",
            "email",
            "id",
            "name",
            "updated_at",
            "username"
          ],
          "filter": {}
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "contact",
            "email",
            "name",
            "password",
            "username"
          ],
          "filter": {
            "client": {
              "id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": {}
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "contact",
            "email",
            "name",
            "password",
            "username"
          ],
          "filter": {
            "_and": [
              {
                "service_requestor": {
                  "account_id": {
                    "_is_null": true
                  }
                }
              },
              {
                "volunteer": {
                  "account_id": {
                    "_is_null": true
                  }
                }
              },
              {
                "client": {
                  "service_requestor": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              },
              {
                "admin": {
                  "account_id": {
                    "_is_null": true
                  }
                }
              }
            ]
          },
          "check": null
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "contact",
            "email",
            "name",
            "password",
            "username"
          ],
          "filter": {
            "volunteer": {
              "id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "admin"
    },
    "object_relationships": [
      {
        "name": "account",
        "using": {
          "foreign_key_constraint_on": "account_id"
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "assignment"
    },
    "object_relationships": [
      {
        "name": "attendance",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "attendance"
            },
            "column_mapping": {
              "id": "assignment_id"
            }
          }
        }
      },
      {
        "name": "event",
        "using": {
          "foreign_key_constraint_on": "event_id"
        }
      },
      {
        "name": "volunteer",
        "using": {
          "foreign_key_constraint_on": "volunteer_id"
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "event": {
              "client": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          },
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "event_id",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt"
          ]
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "event": {
              "client": {
                "service_requestor": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          },
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "event_id",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "event_id",
            "id",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt",
            "status",
            "volunteer_id"
          ],
          "filter": {
            "event": {
              "client": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "event_id",
            "id",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt",
            "status",
            "volunteer_id"
          ],
          "filter": {
            "event": {
              "client": {
                "service_requestor": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "event_id",
            "honorarium_amount",
            "id",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt",
            "status",
            "volunteer_id"
          ],
          "filter": {},
          "allow_aggregations": true
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt"
          ],
          "filter": {
            "event": {
              "client": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          },
          "check": {}
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "id",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt"
          ],
          "filter": {
            "event": {
              "client": {
                "service_requestor": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          },
          "check": {}
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "address_line_one",
            "address_line_two",
            "end_dt",
            "id",
            "latitude",
            "longitude",
            "postal",
            "room_number",
            "start_dt"
          ],
          "filter": {
            "volunteer_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "check": {}
        }
      }
    ],
    "delete_permissions": [
      {
        "role": "client",
        "permission": {
          "filter": {
            "event": {
              "client": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "filter": {
            "event": {
              "client": {
                "service_requestor": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          }
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "attendance"
    },
    "object_relationships": [
      {
        "name": "assignment",
        "using": {
          "foreign_key_constraint_on": "assignment_id"
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "assignment": {
              "event": {
                "client": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          },
          "columns": [
            "attended",
            "dispute_comment",
            "has_dispute"
          ],
          "backend_only": false
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "assignment": {
              "event": {
                "client": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          },
          "columns": [
            "attended",
            "dispute_comment",
            "has_dispute"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "attended",
            "has_dispute",
            "assignment_id",
            "id",
            "dispute_comment"
          ],
          "filter": {
            "assignment": {
              "event": {
                "client": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "attended",
            "has_dispute",
            "assignment_id",
            "id",
            "dispute_comment"
          ],
          "filter": {
            "assignment": {
              "event": {
                "client": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "attended",
            "has_dispute",
            "assignment_id",
            "id",
            "dispute_comment"
          ],
          "filter": {
            "assignment": {
              "volunteer_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "attended",
            "dispute_comment",
            "has_dispute"
          ],
          "filter": {
            "assignment": {
              "event": {
                "client": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          },
          "check": null
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "attended",
            "dispute_comment",
            "has_dispute"
          ],
          "filter": {
            "assignment": {
              "event": {
                "client": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              }
            }
          },
          "check": null
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "client"
    },
    "object_relationships": [
      {
        "name": "account",
        "using": {
          "foreign_key_constraint_on": "account_id"
        }
      },
      {
        "name": "service_requestor",
        "using": {
          "foreign_key_constraint_on": "service_requestor_id"
        }
      }
    ],
    "array_relationships": [
      {
        "name": "events",
        "using": {
          "foreign_key_constraint_on": {
            "column": "client_id",
            "table": {
              "schema": "public",
              "name": "event"
            }
          }
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "account_id",
            "additional_notes",
            "designation",
            "id",
            "organisation",
            "preferred_comm_mode",
            "service_requestor_id"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "allow_aggregations": true
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "account_id",
            "additional_notes",
            "designation",
            "id",
            "organisation",
            "preferred_comm_mode",
            "service_requestor_id"
          ],
          "filter": {
            "service_requestor": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "account_id",
            "additional_notes",
            "designation",
            "id",
            "organisation",
            "preferred_comm_mode",
            "service_requestor_id"
          ],
          "filter": {}
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "additional_notes",
            "designation",
            "organisation",
            "preferred_comm_mode",
            "service_requestor_id"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "check": {}
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "additional_notes",
            "designation",
            "organisation",
            "preferred_comm_mode",
            "service_requestor_id"
          ],
          "filter": {
            "service_requestor": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "email_information"
    },
    "object_relationships": [
      {
        "name": "notification_setting",
        "using": {
          "foreign_key_constraint_on": "notification_setting_id"
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "columns": [
            "email_address"
          ],
          "backend_only": false
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "columns": [
            "email_address"
          ],
          "backend_only": false
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "check": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "columns": [
            "email_address"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "email_address",
            "id",
            "notification_setting_id"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "id",
            "notification_setting_id",
            "email_address"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "id",
            "notification_setting_id",
            "email_address"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "email_address"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "email_address"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "email_address"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "event"
    },
    "object_relationships": [
      {
        "name": "client",
        "using": {
          "foreign_key_constraint_on": "client_id"
        }
      },
      {
        "name": "interpretation_detail",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "interpretation_details"
            },
            "column_mapping": {
              "id": "event_id"
            }
          }
        }
      },
      {
        "name": "invoice",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "invoice"
            },
            "column_mapping": {
              "id": "event_id"
            }
          }
        }
      }
    ],
    "array_relationships": [
      {
        "name": "assignments",
        "using": {
          "foreign_key_constraint_on": {
            "column": "event_id",
            "table": {
              "schema": "public",
              "name": "assignment"
            }
          }
        }
      },
      {
        "name": "feedbacks",
        "using": {
          "foreign_key_constraint_on": {
            "column": "event_id",
            "table": {
              "schema": "public",
              "name": "feedback"
            }
          }
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "client": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "columns": [
            "name",
            "client_id",
            "description",
            "purpose",
            "quotation"
          ]
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "client": {
              "service_requestor": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          },
          "columns": [
            "name",
            "client_id",
            "description",
            "purpose",
            "quotation"
          ]
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": "*",
          "filter": {
            "client": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "allow_aggregations": true
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "client_id",
            "id",
            "quotation",
            "description",
            "created_at",
            "updated_at",
            "name",
            "purpose"
          ],
          "filter": {
            "client": {
              "service_requestor": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          },
          "allow_aggregations": true
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "client_id",
            "id",
            "quotation",
            "description",
            "created_at",
            "updated_at",
            "name",
            "purpose"
          ],
          "filter": {}
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "description",
            "name",
            "purpose",
            "quotation"
          ],
          "filter": {
            "client": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "client_id",
            "description",
            "name",
            "purpose"
          ],
          "filter": {
            "client": {
              "service_requestor": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          },
          "check": null
        }
      }
    ],
    "delete_permissions": [
      {
        "role": "client",
        "permission": {
          "filter": {
            "client": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "filter": {
            "client": {
              "service_requestor": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          }
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "feedback"
    },
    "object_relationships": [
      {
        "name": "event",
        "using": {
          "foreign_key_constraint_on": "event_id"
        }
      },
      {
        "name": "volunteer",
        "using": {
          "foreign_key_constraint_on": "volunteer_id"
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "_and": [
              {
                "event": {
                  "client": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              },
              {
                "volunteer": {
                  "assignments": {
                    "event": {
                      "client_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              }
            ]
          },
          "columns": [
            "confidentiality_privacy_preference",
            "event_id",
            "general_feedback",
            "live_comments",
            "live_information_understanding",
            "live_interaction",
            "notetaker_conduct",
            "notetaker_punctual",
            "post_session_comments",
            "post_session_interaction",
            "post_session_understanding",
            "training_privacy_preference",
            "volunteer_id"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "confidentiality_privacy_preference",
            "notetaker_punctual",
            "training_privacy_preference",
            "event_id",
            "id",
            "volunteer_id",
            "general_feedback",
            "live_comments",
            "post_session_comments",
            "created_at",
            "updated_at",
            "live_information_understanding",
            "live_interaction",
            "notetaker_conduct",
            "post_session_interaction",
            "post_session_understanding"
          ],
          "filter": {
            "event": {
              "client": {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            }
          }
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "confidentiality_privacy_preference",
            "general_feedback",
            "live_comments",
            "live_information_understanding",
            "live_interaction",
            "notetaker_conduct",
            "notetaker_punctual",
            "post_session_comments",
            "post_session_interaction",
            "post_session_understanding",
            "training_privacy_preference",
            "updated_at",
            "volunteer_id"
          ],
          "filter": {
            "_and": [
              {
                "event": {
                  "client": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              },
              {
                "volunteer": {
                  "assignments": {
                    "event": {
                      "client_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              }
            ]
          },
          "check": {}
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "interpretation_details"
    },
    "object_relationships": [
      {
        "name": "event",
        "using": {
          "foreign_key_constraint_on": "event_id"
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "allow_trainee_interpreters",
            "filming_interpreters",
            "event_id",
            "id",
            "number_of_deaf",
            "number_of_hearing",
            "sign_system"
          ],
          "filter": {}
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "allow_trainee_interpreters",
            "filming_interpreters",
            "event_id",
            "id",
            "number_of_deaf",
            "number_of_hearing",
            "sign_system"
          ],
          "filter": {}
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "allow_trainee_interpreters",
            "filming_interpreters",
            "event_id",
            "id",
            "number_of_deaf",
            "number_of_hearing",
            "sign_system"
          ],
          "filter": {}
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "invoice"
    },
    "object_relationships": [
      {
        "name": "event",
        "using": {
          "foreign_key_constraint_on": "event_id"
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "membership"
    },
    "object_relationships": [
      {
        "name": "account",
        "using": {
          "foreign_key_constraint_on": "account_id"
        }
      },
      {
        "name": "membership_type",
        "using": {
          "foreign_key_constraint_on": "membership_type_id"
        }
      }
    ],
    "array_relationships": [
      {
        "name": "membership_renewals",
        "using": {
          "foreign_key_constraint_on": {
            "column": "membership_id",
            "table": {
              "schema": "public",
              "name": "membership_renewals"
            }
          }
        }
      },
      {
        "name": "service_requestors",
        "using": {
          "foreign_key_constraint_on": {
            "column": "membership_id",
            "table": {
              "schema": "public",
              "name": "service_requestor"
            }
          }
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "columns": [
            "account_id"
          ],
          "backend_only": false
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "_or": [
              {
                "account": {
                  "client": {
                    "service_requestor": {
                      "account_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              },
              {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            ]
          },
          "columns": [
            "account_id",
            "membership_type_id"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "account_id",
            "id",
            "membership_type_id",
            "free_sessions_remaining",
            "created_at",
            "updated_at",
            "status"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "account_id",
            "id",
            "membership_type_id",
            "free_sessions_remaining",
            "created_at",
            "updated_at",
            "status"
          ],
          "filter": {
            "_or": [
              {
                "account": {
                  "client": {
                    "service_requestor": {
                      "account_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              },
              {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            ]
          }
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "membership_type_id"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "check": null
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "membership_type_id"
          ],
          "filter": {
            "_or": [
              {
                "account": {
                  "client": {
                    "service_requestor": {
                      "account_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              },
              {
                "account_id": {
                  "_eq": "X-Hasura-User-Id"
                }
              }
            ]
          },
          "check": null
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "membership_renewals"
    },
    "object_relationships": [
      {
        "name": "membership",
        "using": {
          "foreign_key_constraint_on": "membership_id"
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "created_at",
            "id",
            "membership_id"
          ],
          "filter": {
            "membership": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "id",
            "membership_id",
            "created_at"
          ],
          "filter": {
            "_or": [
              {
                "membership": {
                  "account": {
                    "service_requestor": {
                      "account_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              },
              {
                "membership": {
                  "account": {
                    "client": {
                      "service_requestor": {
                        "account_id": {
                          "_eq": "X-Hasura-User-Id"
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "membership_type"
    },
    "array_relationships": [
      {
        "name": "memberships",
        "using": {
          "foreign_key_constraint_on": {
            "column": "membership_type_id",
            "table": {
              "schema": "public",
              "name": "membership"
            }
          }
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "id",
            "name",
            "cost",
            "duration_in_days",
            "description"
          ],
          "filter": {}
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "duration_in_days",
            "id",
            "cost",
            "description",
            "name"
          ],
          "filter": {}
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "duration_in_days",
            "id",
            "cost",
            "description",
            "name"
          ],
          "filter": {}
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "notification_setting"
    },
    "object_relationships": [
      {
        "name": "account",
        "using": {
          "foreign_key_constraint_on": "account_id"
        }
      },
      {
        "name": "email_information",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "email_information"
            },
            "column_mapping": {
              "id": "notification_setting_id"
            }
          }
        }
      },
      {
        "name": "telegram_information",
        "using": {
          "manual_configuration": {
            "remote_table": {
              "schema": "public",
              "name": "telegram_information"
            },
            "column_mapping": {
              "id": "notification_setting_id"
            }
          }
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "set": {
            "account_id": "x-hasura-User-Id"
          },
          "columns": [
            "account_id"
          ],
          "backend_only": false
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "_or": [
              {
                "account": {
                  "client": {
                    "service_requestor": {
                      "account_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              },
              {
                "account": {
                  "service_requestor": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              }
            ]
          },
          "columns": [
            "account_id"
          ],
          "backend_only": false
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "check": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "set": {
            "account_id": "x-hasura-User-Id"
          },
          "columns": [
            "account_id"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "account_id",
            "id"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "account_id",
            "id"
          ],
          "filter": {
            "_or": [
              {
                "account": {
                  "client": {
                    "service_requestor": {
                      "account_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              },
              {
                "account": {
                  "service_requestor": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "id",
            "account_id"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          }
        }
      }
    ],
    "delete_permissions": [
      {
        "role": "client",
        "permission": {
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "filter": {
            "_or": [
              {
                "account": {
                  "client": {
                    "service_requestor": {
                      "account_id": {
                        "_eq": "X-Hasura-User-Id"
                      }
                    }
                  }
                }
              },
              {
                "account": {
                  "service_requestor": {
                    "account_id": {
                      "_eq": "X-Hasura-User-Id"
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          }
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "service_requestor"
    },
    "object_relationships": [
      {
        "name": "account",
        "using": {
          "foreign_key_constraint_on": "account_id"
        }
      },
      {
        "name": "membership",
        "using": {
          "foreign_key_constraint_on": "membership_id"
        }
      }
    ],
    "array_relationships": [
      {
        "name": "clients",
        "using": {
          "foreign_key_constraint_on": {
            "column": "service_requestor_id",
            "table": {
              "schema": "public",
              "name": "client"
            }
          }
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "account_id",
            "id",
            "membership_id",
            "organisation"
          ],
          "filter": {
            "clients": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "account_id",
            "id",
            "membership_id",
            "organisation"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          }
        }
      }
    ],
    "update_permissions": [
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "organisation"
          ],
          "filter": {
            "account_id": {
              "_eq": "X-Hasura-User-Id"
            }
          },
          "check": {}
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "telegram_information"
    },
    "object_relationships": [
      {
        "name": "notification_setting",
        "using": {
          "foreign_key_constraint_on": "notification_setting_id"
        }
      }
    ],
    "insert_permissions": [
      {
        "role": "client",
        "permission": {
          "check": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "columns": [
            "chat_id"
          ],
          "backend_only": false
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "check": {
            "_or": [
              {
                "notification_setting": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              },
              {
                "notification_setting": {
                  "account": {
                    "client": {
                      "service_requestor": {
                        "account_id": {
                          "_eq": "X-Hasura-User-Id"
                        }
                      }
                    }
                  }
                }
              }
            ]
          },
          "columns": [
            "chat_id"
          ],
          "backend_only": false
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "check": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "columns": [
            "chat_id"
          ],
          "backend_only": false
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "id",
            "chat_id",
            "notification_setting_id"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "id",
            "notification_setting_id",
            "chat_id"
          ],
          "filter": {
            "_or": [
              {
                "notification_setting": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              },
              {
                "notification_setting": {
                  "account": {
                    "client": {
                      "service_requestor": {
                        "account_id": {
                          "_eq": "X-Hasura-User-Id"
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "id",
            "notification_setting_id",
            "chat_id"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      }
    ],
    "update_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "chat_id"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "chat_id"
          ],
          "filter": {
            "_or": [
              {
                "notification_setting": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              },
              {
                "notification_setting": {
                  "account": {
                    "client": {
                      "service_requestor": {
                        "account_id": {
                          "_eq": "X-Hasura-User-Id"
                        }
                      }
                    }
                  }
                }
              }
            ]
          },
          "check": null
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "chat_id"
          ],
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          },
          "check": null
        }
      }
    ],
    "delete_permissions": [
      {
        "role": "client",
        "permission": {
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "filter": {
            "_or": [
              {
                "notification_setting": {
                  "account_id": {
                    "_eq": "X-Hasura-User-Id"
                  }
                }
              },
              {
                "notification_setting": {
                  "account": {
                    "client": {
                      "service_requestor": {
                        "account_id": {
                          "_eq": "X-Hasura-User-Id"
                        }
                      }
                    }
                  }
                }
              }
            ]
          }
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "filter": {
            "notification_setting": {
              "account_id": {
                "_eq": "X-Hasura-User-Id"
              }
            }
          }
        }
      }
    ]
  },
  {
    "table": {
      "schema": "public",
      "name": "volunteer"
    },
    "object_relationships": [
      {
        "name": "account",
        "using": {
          "foreign_key_constraint_on": "account_id"
        }
      }
    ],
    "array_relationships": [
      {
        "name": "assignments",
        "using": {
          "foreign_key_constraint_on": {
            "column": "volunteer_id",
            "table": {
              "schema": "public",
              "name": "assignment"
            }
          }
        }
      },
      {
        "name": "feedbacks",
        "using": {
          "foreign_key_constraint_on": {
            "column": "volunteer_id",
            "table": {
              "schema": "public",
              "name": "feedback"
            }
          }
        }
      }
    ],
    "select_permissions": [
      {
        "role": "client",
        "permission": {
          "columns": [
            "account_id"
          ],
          "filter": {}
        }
      },
      {
        "role": "service_requestor",
        "permission": {
          "columns": [
            "account_id"
          ],
          "filter": {}
        }
      },
      {
        "role": "volunteer",
        "permission": {
          "columns": [
            "account_id",
            "approval_status",
            "id"
          ],
          "filter": {}
        }
      }
    ]
  }
];
const DOMAIN_SCHEMA_NAMES = new Set(HASURA_TABLES.map(tableDef => tableDef.table.name));

class CrudTree {

  constructor(fromJson) {
    this.__graphqlSchemas = {};

    if (fromJson) {
      this.__crudTree = CRUD_TREE_SERIALIZED;
    } else {
      this.__crudTree = {};
    }
  }

  build = async () => {
    const schemas = await this.__getHasuraGraphQLDomainSchemas();

    schemas.forEach(this.registerGraphQLSchema);
    schemas.forEach(this.registerGraphQLSchemaRelations);
    this.addSchemasToCrudTree();
    schemas.forEach(this.addNestedObjectsToCrudTree);

    return this.__crudTree;
  }

  registerGraphQLSchema = (schema) => {
    const { name } = schema;

    if (!this.__graphqlSchemas[name])
      this.__graphqlSchemas[name] = {};

    if (!schema.fields) return;

    schema.fields.forEach(field => {
      const fieldName = field.name;
      let fieldType = field.type.name || field.type.ofType.name;

      if (fieldType) {
        fieldType = fieldType.toLowerCase();
      } else {
        return;
      }

      // Handle primitive types first - nested objects and arrays
      // (relationships) will be handled later
      switch (fieldType) {
        case 'bigint':
          fieldType = 'int';
        case 'float8':
          fieldType = 'float';
        case 'int':
        case 'float':
        case 'string':
        case 'boolean':
        case 'timestamp':
        case 'numeric':
          this.__graphqlSchemas[name][fieldName] = {
            name: fieldName,
            type: fieldType
          }
          break;
      }
    });
  }

  registerGraphQLSchemaRelations = (schema) => {
    schema.fields.forEach(field => {
      // Handle nested objects -> 1..1 relationship
      if (this.__isObjectField(field)) {
        this.__graphqlSchemas[schema.name][field.name] = {
          type: 'object',
          ref: field.name,
          name: field.name,
        }
      }

      // Handle nested arrays -> 1..N relationship
      if (this.__isArrayField(field)) {
        this.__graphqlSchemas[schema.name][field.name] = {
          type: 'array',
          ref: field.name.substr(0, field.name.length - 1),
          name: field.name,
        }
      }
    });
  }

  addSchemasToCrudTree = () => {
    HASURA_TABLES.forEach(schema => {
      const schemaName = schema.table.name;

      // Give admin permissions to do everything!
      OPERATIONS.forEach(operation => {
        this.addPermittedFields(schemaName, 'admin', operation, Object.values(this.__graphqlSchemas[schemaName]));
      })

      OPERATIONS.forEach(operation => {
        const permissions = schema[operation + '_permissions'];

        if (!permissions || permissions.length === 0) return;

        for (const permission of permissions) {
          const { role } = permission;

          ROLES.add(role);

          if (operation === 'delete') {
            this.addPermittedField(schemaName, role, operation);
          } else {
            if (permission.permission) {
              if (permission.permission.columns) {
                let columns = permission.permission.columns;
                if (columns === '*') {
                  columns = Object.values(this.__graphqlSchemas[schemaName]).map(field => field.name);
                }
                for (const fieldName of columns) {
                  this.addPermittedField(schemaName, role, operation, this.__graphqlSchemas[schemaName][fieldName]);
                }
              }
            }
          }
        }
      });
    });
  }

  addNestedObjectsToCrudTree = (schema) => {
    const parentSchemaRef = schema.name;
    log(`Adding nested objects and lists to '${parentSchemaRef}' schema`)
    schema.fields
      .filter(f =>
        this.__isNestedField(f) &&
        (DOMAIN_SCHEMA_NAMES.has(f.name) || DOMAIN_SCHEMA_NAMES.has(f.name.substr(0, f.name.length - 1)))
      )
      .forEach(field => {

        let schemaRef;
        let fieldType;
        if (this.__isArrayField(field)) {
          // Array relationships assumed to have plural form, end with 's'
          schemaRef = field.name.substr(0, field.name.length - 1);
          fieldType = 'array';
        } else {
          schemaRef = field.name;
          fieldType = 'object';
        }

        ROLES.forEach(role => {
          let schemaRolePermissions = this.__crudTree[parentSchemaRef][role];
          if (schemaRolePermissions) {
            OPERATIONS
              .filter(p => p !== 'delete')
              .forEach(operation => {
                const permittedFields = schemaRolePermissions[operation];
                if (permittedFields) {
                  permittedFields[schemaRef] = {
                    type: fieldType,
                    name: field.name,
                    ref: schemaRef,
                  }
                  log(`\t+ ${parentSchemaRef}.${role}.${operation}.${schemaRef}`);
                }
              });
          }
        });
    });
  }

  addPermittedFields = (schema, role, operation, fields) => {
    if (operation === 'delete') {
      this.addPermittedField(schema, role, operation);
    } else {
      fields.forEach(field => this.addPermittedField(schema, role, operation, field));
    }
  }

  addPermittedField = (schema, role, operation, field) => {
    let schemaRoles = this.__crudTree[schema];
    if (!schemaRoles) {
      schemaRoles = this.__crudTree[schema] = {};
    }
    let schemaRolePermissions = schemaRoles[role];
    if (!schemaRolePermissions) {
      schemaRolePermissions = schemaRoles[role] = {};
    }

    let fields = schemaRolePermissions[operation];
    if (operation === 'delete') {
      log(`+ ${schema}.${role}.${operation} = true`);
      schemaRolePermissions[operation] = true;
      return;
    }
    if (!fields) {
      fields = schemaRolePermissions[operation] = {};
    }
    fields[field.name] = field;
    log(`+ ${schema}.${role}.${operation}.${field.name} [${field.type}]`);
  }

  getRoleSchemaPermittedInsertFields = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'insert');
  }
  /**
   *
   * @param role
   * @param schema
   * @returns {null|{account: {admin: {select: {contact: {name: string, type: string}, created_at: {name: string, type: string}, email: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, password: {name: string, type: string}, role: {name: string, type: string}, updated_at: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, ref: string, name: string}, client: {type: string, ref: string, name: string}, memberships: {type: string, ref: string, name: string}, memberships_aggregate: {type: string, ref: string, name: string}, notification_setting: {type: string, ref: string, name: string}, service_requestor: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, insert: {contact: {name: string, type: string}, created_at: {name: string, type: string}, email: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, password: {name: string, type: string}, role: {name: string, type: string}, updated_at: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, ref: string, name: string}, client: {type: string, ref: string, name: string}, memberships: {type: string, ref: string, name: string}, memberships_aggregate: {type: string, ref: string, name: string}, notification_setting: {type: string, ref: string, name: string}, service_requestor: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, update: {contact: {name: string, type: string}, created_at: {name: string, type: string}, email: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, password: {name: string, type: string}, role: {name: string, type: string}, updated_at: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, ref: string, name: string}, client: {type: string, ref: string, name: string}, memberships: {type: string, ref: string, name: string}, memberships_aggregate: {type: string, ref: string, name: string}, notification_setting: {type: string, ref: string, name: string}, service_requestor: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {contact: {name: string, type: string}, created_at: {name: string, type: string}, email: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, updated_at: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}, notification_setting: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, update: {contact: {name: string, type: string}, email: {name: string, type: string}, name: {name: string, type: string}, password: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}, notification_setting: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}}, service_requestor: {select: {contact: {name: string, type: string}, created_at: {name: string, type: string}, email: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, updated_at: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}, notification_setting: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, insert: {contact: {name: string, type: string}, email: {name: string, type: string}, name: {name: string, type: string}, password: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}, notification_setting: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, update: {contact: {name: string, type: string}, email: {name: string, type: string}, name: {name: string, type: string}, password: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}, notification_setting: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}}, volunteer: {select: {contact: {name: string, type: string}, created_at: {name: string, type: string}, email: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, updated_at: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}, notification_setting: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, update: {contact: {name: string, type: string}, email: {name: string, type: string}, name: {name: string, type: string}, password: {name: string, type: string}, username: {name: string, type: string}, admin: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}, notification_setting: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}}}, admin: {admin: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}}, insert: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}}, update: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}}, delete: boolean}}, assignment: {admin: {select: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, honorarium_amount: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, status: {name: string, type: string}, volunteer_id: {name: string, type: string}, attendance: {type: string, ref: string, name: string}, event: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, insert: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, honorarium_amount: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, status: {name: string, type: string}, volunteer_id: {name: string, type: string}, attendance: {type: string, ref: string, name: string}, event: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, update: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, honorarium_amount: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, status: {name: string, type: string}, volunteer_id: {name: string, type: string}, attendance: {type: string, ref: string, name: string}, event: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, status: {name: string, type: string}, volunteer_id: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, insert: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, update: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, delete: boolean}, service_requestor: {select: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, status: {name: string, type: string}, volunteer_id: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, insert: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, update: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, delete: boolean}, volunteer: {select: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, event_id: {name: string, type: string}, honorarium_amount: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, status: {name: string, type: string}, volunteer_id: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, update: {address_line_one: {name: string, type: string}, address_line_two: {name: string, type: string}, end_dt: {name: string, type: string}, id: {name: string, type: string}, latitude: {name: string, type: string}, longitude: {name: string, type: string}, postal: {name: string, type: string}, room_number: {name: string, type: string}, start_dt: {name: string, type: string}, attendance: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}}}, attendance: {admin: {select: {assignment_id: {name: string, type: string}, attended: {name: string, type: string}, dispute_comment: {name: string, type: string}, has_dispute: {name: string, type: string}, id: {name: string, type: string}, assignment: {type: string, ref: string, name: string}}, insert: {assignment_id: {name: string, type: string}, attended: {name: string, type: string}, dispute_comment: {name: string, type: string}, has_dispute: {name: string, type: string}, id: {name: string, type: string}, assignment: {type: string, ref: string, name: string}}, update: {assignment_id: {name: string, type: string}, attended: {name: string, type: string}, dispute_comment: {name: string, type: string}, has_dispute: {name: string, type: string}, id: {name: string, type: string}, assignment: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {attended: {name: string, type: string}, has_dispute: {name: string, type: string}, assignment_id: {name: string, type: string}, id: {name: string, type: string}, dispute_comment: {name: string, type: string}, assignment: {type: string, name: string, ref: string}}, insert: {attended: {name: string, type: string}, dispute_comment: {name: string, type: string}, has_dispute: {name: string, type: string}, assignment: {type: string, name: string, ref: string}}, update: {attended: {name: string, type: string}, dispute_comment: {name: string, type: string}, has_dispute: {name: string, type: string}, assignment: {type: string, name: string, ref: string}}}, service_requestor: {select: {attended: {name: string, type: string}, has_dispute: {name: string, type: string}, assignment_id: {name: string, type: string}, id: {name: string, type: string}, dispute_comment: {name: string, type: string}, assignment: {type: string, name: string, ref: string}}, insert: {attended: {name: string, type: string}, dispute_comment: {name: string, type: string}, has_dispute: {name: string, type: string}, assignment: {type: string, name: string, ref: string}}, update: {attended: {name: string, type: string}, dispute_comment: {name: string, type: string}, has_dispute: {name: string, type: string}, assignment: {type: string, name: string, ref: string}}}, volunteer: {select: {attended: {name: string, type: string}, has_dispute: {name: string, type: string}, assignment_id: {name: string, type: string}, id: {name: string, type: string}, dispute_comment: {name: string, type: string}, assignment: {type: string, name: string, ref: string}}}}, client: {admin: {select: {account_id: {name: string, type: string}, additional_notes: {name: string, type: string}, designation: {name: string, type: string}, id: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, ref: string, name: string}, events: {type: string, ref: string, name: string}, events_aggregate: {type: string, ref: string, name: string}, service_requestor: {type: string, ref: string, name: string}}, insert: {account_id: {name: string, type: string}, additional_notes: {name: string, type: string}, designation: {name: string, type: string}, id: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, ref: string, name: string}, events: {type: string, ref: string, name: string}, events_aggregate: {type: string, ref: string, name: string}, service_requestor: {type: string, ref: string, name: string}}, update: {account_id: {name: string, type: string}, additional_notes: {name: string, type: string}, designation: {name: string, type: string}, id: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, ref: string, name: string}, events: {type: string, ref: string, name: string}, events_aggregate: {type: string, ref: string, name: string}, service_requestor: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {account_id: {name: string, type: string}, additional_notes: {name: string, type: string}, designation: {name: string, type: string}, id: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}, update: {additional_notes: {name: string, type: string}, designation: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}}, service_requestor: {select: {account_id: {name: string, type: string}, additional_notes: {name: string, type: string}, designation: {name: string, type: string}, id: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}, update: {additional_notes: {name: string, type: string}, designation: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}}, volunteer: {select: {account_id: {name: string, type: string}, additional_notes: {name: string, type: string}, designation: {name: string, type: string}, id: {name: string, type: string}, organisation: {name: string, type: string}, preferred_comm_mode: {name: string, type: string}, service_requestor_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, event: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}}}, email_information: {admin: {select: {email_address: {name: string, type: string}, id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, ref: string, name: string}}, insert: {email_address: {name: string, type: string}, id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, ref: string, name: string}}, update: {email_address: {name: string, type: string}, id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {email_address: {name: string, type: string}, id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, insert: {email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, update: {email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}}, service_requestor: {select: {id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, insert: {email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, update: {email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}}, volunteer: {select: {id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, insert: {email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, update: {email_address: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}}}, event: {admin: {select: {client_id: {name: string, type: string}, created_at: {name: string, type: string}, description: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, quotation: {name: string, type: string}, updated_at: {name: string, type: string}, assignments: {type: string, ref: string, name: string}, assignments_aggregate: {type: string, ref: string, name: string}, client: {type: string, ref: string, name: string}, feedbacks: {type: string, ref: string, name: string}, feedbacks_aggregate: {type: string, ref: string, name: string}, interpretation_detail: {type: string, ref: string, name: string}, invoice: {type: string, ref: string, name: string}}, insert: {client_id: {name: string, type: string}, created_at: {name: string, type: string}, description: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, quotation: {name: string, type: string}, updated_at: {name: string, type: string}, assignments: {type: string, ref: string, name: string}, assignments_aggregate: {type: string, ref: string, name: string}, client: {type: string, ref: string, name: string}, feedbacks: {type: string, ref: string, name: string}, feedbacks_aggregate: {type: string, ref: string, name: string}, interpretation_detail: {type: string, ref: string, name: string}, invoice: {type: string, ref: string, name: string}}, update: {client_id: {name: string, type: string}, created_at: {name: string, type: string}, description: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, quotation: {name: string, type: string}, updated_at: {name: string, type: string}, assignments: {type: string, ref: string, name: string}, assignments_aggregate: {type: string, ref: string, name: string}, client: {type: string, ref: string, name: string}, feedbacks: {type: string, ref: string, name: string}, feedbacks_aggregate: {type: string, ref: string, name: string}, interpretation_detail: {type: string, ref: string, name: string}, invoice: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {client_id: {name: string, type: string}, created_at: {name: string, type: string}, description: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, quotation: {name: string, type: string}, updated_at: {name: string, type: string}, assignments: {type: string, ref: string, name: string}, assignments_aggregate: {type: string, ref: string, name: string}, client: {type: string, name: string, ref: string}, feedbacks: {type: string, ref: string, name: string}, feedbacks_aggregate: {type: string, ref: string, name: string}, interpretation_detail: {type: string, ref: string, name: string}, invoice: {type: string, name: string, ref: string}, assignment: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}}, insert: {name: {name: string, type: string}, client_id: {name: string, type: string}, description: {name: string, type: string}, purpose: {name: string, type: string}, quotation: {name: string, type: string}, assignment: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}, invoice: {type: string, name: string, ref: string}}, update: {description: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, quotation: {name: string, type: string}, assignment: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}, invoice: {type: string, name: string, ref: string}}, delete: boolean}, service_requestor: {select: {client_id: {name: string, type: string}, id: {name: string, type: string}, quotation: {name: string, type: string}, description: {name: string, type: string}, created_at: {name: string, type: string}, updated_at: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, assignment: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}, invoice: {type: string, name: string, ref: string}}, insert: {name: {name: string, type: string}, client_id: {name: string, type: string}, description: {name: string, type: string}, purpose: {name: string, type: string}, quotation: {name: string, type: string}, assignment: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}, invoice: {type: string, name: string, ref: string}}, update: {client_id: {name: string, type: string}, description: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, assignment: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}, invoice: {type: string, name: string, ref: string}}, delete: boolean}, volunteer: {select: {client_id: {name: string, type: string}, id: {name: string, type: string}, quotation: {name: string, type: string}, description: {name: string, type: string}, created_at: {name: string, type: string}, updated_at: {name: string, type: string}, name: {name: string, type: string}, purpose: {name: string, type: string}, assignment: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}, invoice: {type: string, name: string, ref: string}}}}, feedback: {admin: {select: {confidentiality_privacy_preference: {name: string, type: string}, created_at: {name: string, type: string}, event_id: {name: string, type: string}, general_feedback: {name: string, type: string}, id: {name: string, type: string}, live_comments: {name: string, type: string}, live_information_understanding: {name: string, type: string}, live_interaction: {name: string, type: string}, notetaker_conduct: {name: string, type: string}, notetaker_punctual: {name: string, type: string}, post_session_comments: {name: string, type: string}, post_session_interaction: {name: string, type: string}, post_session_understanding: {name: string, type: string}, training_privacy_preference: {name: string, type: string}, updated_at: {name: string, type: string}, volunteer_id: {name: string, type: string}, event: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, insert: {confidentiality_privacy_preference: {name: string, type: string}, created_at: {name: string, type: string}, event_id: {name: string, type: string}, general_feedback: {name: string, type: string}, id: {name: string, type: string}, live_comments: {name: string, type: string}, live_information_understanding: {name: string, type: string}, live_interaction: {name: string, type: string}, notetaker_conduct: {name: string, type: string}, notetaker_punctual: {name: string, type: string}, post_session_comments: {name: string, type: string}, post_session_interaction: {name: string, type: string}, post_session_understanding: {name: string, type: string}, training_privacy_preference: {name: string, type: string}, updated_at: {name: string, type: string}, volunteer_id: {name: string, type: string}, event: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, update: {confidentiality_privacy_preference: {name: string, type: string}, created_at: {name: string, type: string}, event_id: {name: string, type: string}, general_feedback: {name: string, type: string}, id: {name: string, type: string}, live_comments: {name: string, type: string}, live_information_understanding: {name: string, type: string}, live_interaction: {name: string, type: string}, notetaker_conduct: {name: string, type: string}, notetaker_punctual: {name: string, type: string}, post_session_comments: {name: string, type: string}, post_session_interaction: {name: string, type: string}, post_session_understanding: {name: string, type: string}, training_privacy_preference: {name: string, type: string}, updated_at: {name: string, type: string}, volunteer_id: {name: string, type: string}, event: {type: string, ref: string, name: string}, volunteer: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {confidentiality_privacy_preference: {name: string, type: string}, notetaker_punctual: {name: string, type: string}, training_privacy_preference: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, volunteer_id: {name: string, type: string}, general_feedback: {name: string, type: string}, live_comments: {name: string, type: string}, post_session_comments: {name: string, type: string}, created_at: {name: string, type: string}, updated_at: {name: string, type: string}, live_information_understanding: {name: string, type: string}, live_interaction: {name: string, type: string}, notetaker_conduct: {name: string, type: string}, post_session_interaction: {name: string, type: string}, post_session_understanding: {name: string, type: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, insert: {confidentiality_privacy_preference: {name: string, type: string}, event_id: {name: string, type: string}, general_feedback: {name: string, type: string}, live_comments: {name: string, type: string}, live_information_understanding: {name: string, type: string}, live_interaction: {name: string, type: string}, notetaker_conduct: {name: string, type: string}, notetaker_punctual: {name: string, type: string}, post_session_comments: {name: string, type: string}, post_session_interaction: {name: string, type: string}, post_session_understanding: {name: string, type: string}, training_privacy_preference: {name: string, type: string}, volunteer_id: {name: string, type: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}, update: {confidentiality_privacy_preference: {name: string, type: string}, general_feedback: {name: string, type: string}, live_comments: {name: string, type: string}, live_information_understanding: {name: string, type: string}, live_interaction: {name: string, type: string}, notetaker_conduct: {name: string, type: string}, notetaker_punctual: {name: string, type: string}, post_session_comments: {name: string, type: string}, post_session_interaction: {name: string, type: string}, post_session_understanding: {name: string, type: string}, training_privacy_preference: {name: string, type: string}, updated_at: {name: string, type: string}, volunteer_id: {name: string, type: string}, event: {type: string, name: string, ref: string}, volunteer: {type: string, name: string, ref: string}}}}, interpretation_details: {admin: {select: {allow_trainee_interpreters: {name: string, type: string}, event_id: {name: string, type: string}, filming_interpreters: {name: string, type: string}, id: {name: string, type: string}, number_of_deaf: {name: string, type: string}, number_of_hearing: {name: string, type: string}, sign_system: {name: string, type: string}, event: {type: string, ref: string, name: string}}, insert: {allow_trainee_interpreters: {name: string, type: string}, event_id: {name: string, type: string}, filming_interpreters: {name: string, type: string}, id: {name: string, type: string}, number_of_deaf: {name: string, type: string}, number_of_hearing: {name: string, type: string}, sign_system: {name: string, type: string}, event: {type: string, ref: string, name: string}}, update: {allow_trainee_interpreters: {name: string, type: string}, event_id: {name: string, type: string}, filming_interpreters: {name: string, type: string}, id: {name: string, type: string}, number_of_deaf: {name: string, type: string}, number_of_hearing: {name: string, type: string}, sign_system: {name: string, type: string}, event: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {allow_trainee_interpreters: {name: string, type: string}, filming_interpreters: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, number_of_deaf: {name: string, type: string}, number_of_hearing: {name: string, type: string}, sign_system: {name: string, type: string}, event: {type: string, name: string, ref: string}}}, service_requestor: {select: {allow_trainee_interpreters: {name: string, type: string}, filming_interpreters: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, number_of_deaf: {name: string, type: string}, number_of_hearing: {name: string, type: string}, sign_system: {name: string, type: string}, event: {type: string, name: string, ref: string}}}, volunteer: {select: {allow_trainee_interpreters: {name: string, type: string}, filming_interpreters: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, number_of_deaf: {name: string, type: string}, number_of_hearing: {name: string, type: string}, sign_system: {name: string, type: string}, event: {type: string, name: string, ref: string}}}}, invoice: {admin: {select: {amount: {name: string, type: string}, created_at: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, updated_at: {name: string, type: string}, event: {type: string, ref: string, name: string}}, insert: {amount: {name: string, type: string}, created_at: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, updated_at: {name: string, type: string}, event: {type: string, ref: string, name: string}}, update: {amount: {name: string, type: string}, created_at: {name: string, type: string}, event_id: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, updated_at: {name: string, type: string}, event: {type: string, ref: string, name: string}}, delete: boolean}}, membership: {admin: {select: {account_id: {name: string, type: string}, created_at: {name: string, type: string}, free_sessions_remaining: {name: string, type: string}, id: {name: string, type: string}, membership_type_id: {name: string, type: string}, status: {name: string, type: string}, updated_at: {name: string, type: string}, account: {type: string, ref: string, name: string}, membership_renewals: {type: string, ref: string, name: string}, membership_renewals_aggregate: {type: string, ref: string, name: string}, membership_type: {type: string, ref: string, name: string}, service_requestors: {type: string, ref: string, name: string}, service_requestors_aggregate: {type: string, ref: string, name: string}}, insert: {account_id: {name: string, type: string}, created_at: {name: string, type: string}, free_sessions_remaining: {name: string, type: string}, id: {name: string, type: string}, membership_type_id: {name: string, type: string}, status: {name: string, type: string}, updated_at: {name: string, type: string}, account: {type: string, ref: string, name: string}, membership_renewals: {type: string, ref: string, name: string}, membership_renewals_aggregate: {type: string, ref: string, name: string}, membership_type: {type: string, ref: string, name: string}, service_requestors: {type: string, ref: string, name: string}, service_requestors_aggregate: {type: string, ref: string, name: string}}, update: {account_id: {name: string, type: string}, created_at: {name: string, type: string}, free_sessions_remaining: {name: string, type: string}, id: {name: string, type: string}, membership_type_id: {name: string, type: string}, status: {name: string, type: string}, updated_at: {name: string, type: string}, account: {type: string, ref: string, name: string}, membership_renewals: {type: string, ref: string, name: string}, membership_renewals_aggregate: {type: string, ref: string, name: string}, membership_type: {type: string, ref: string, name: string}, service_requestors: {type: string, ref: string, name: string}, service_requestors_aggregate: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, membership_type_id: {name: string, type: string}, free_sessions_remaining: {name: string, type: string}, created_at: {name: string, type: string}, updated_at: {name: string, type: string}, status: {name: string, type: string}, account: {type: string, name: string, ref: string}, membership_renewal: {type: string, name: string, ref: string}, membership_type: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}, insert: {account_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, membership_renewal: {type: string, name: string, ref: string}, membership_type: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}, update: {membership_type_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, membership_renewal: {type: string, name: string, ref: string}, membership_type: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}}, service_requestor: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, membership_type_id: {name: string, type: string}, free_sessions_remaining: {name: string, type: string}, created_at: {name: string, type: string}, updated_at: {name: string, type: string}, status: {name: string, type: string}, account: {type: string, name: string, ref: string}, membership_renewal: {type: string, name: string, ref: string}, membership_type: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}, insert: {account_id: {name: string, type: string}, membership_type_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, membership_renewal: {type: string, name: string, ref: string}, membership_type: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}, update: {membership_type_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, membership_renewal: {type: string, name: string, ref: string}, membership_type: {type: string, name: string, ref: string}, service_requestor: {type: string, name: string, ref: string}}}}, membership_renewals: {admin: {select: {created_at: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, membership: {type: string, ref: string, name: string}}, insert: {created_at: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, membership: {type: string, ref: string, name: string}}, update: {created_at: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, membership: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {created_at: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, membership: {type: string, name: string, ref: string}}}, service_requestor: {select: {id: {name: string, type: string}, membership_id: {name: string, type: string}, created_at: {name: string, type: string}, membership: {type: string, name: string, ref: string}}}}, membership_type: {admin: {select: {cost: {name: string, type: string}, description: {name: string, type: string}, duration_in_days: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, memberships: {type: string, ref: string, name: string}, memberships_aggregate: {type: string, ref: string, name: string}}, insert: {cost: {name: string, type: string}, description: {name: string, type: string}, duration_in_days: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, memberships: {type: string, ref: string, name: string}, memberships_aggregate: {type: string, ref: string, name: string}}, update: {cost: {name: string, type: string}, description: {name: string, type: string}, duration_in_days: {name: string, type: string}, id: {name: string, type: string}, name: {name: string, type: string}, memberships: {type: string, ref: string, name: string}, memberships_aggregate: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {id: {name: string, type: string}, name: {name: string, type: string}, cost: {name: string, type: string}, duration_in_days: {name: string, type: string}, description: {name: string, type: string}, membership: {type: string, name: string, ref: string}}}, service_requestor: {select: {duration_in_days: {name: string, type: string}, id: {name: string, type: string}, cost: {name: string, type: string}, description: {name: string, type: string}, name: {name: string, type: string}, membership: {type: string, name: string, ref: string}}}, volunteer: {select: {duration_in_days: {name: string, type: string}, id: {name: string, type: string}, cost: {name: string, type: string}, description: {name: string, type: string}, name: {name: string, type: string}, membership: {type: string, name: string, ref: string}}}}, notification_setting: {admin: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}, email_information: {type: string, ref: string, name: string}, telegram_information: {type: string, ref: string, name: string}}, insert: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}, email_information: {type: string, ref: string, name: string}, telegram_information: {type: string, ref: string, name: string}}, update: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}, email_information: {type: string, ref: string, name: string}, telegram_information: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, name: string, ref: string}, email_information: {type: string, name: string, ref: string}, telegram_information: {type: string, name: string, ref: string}}, insert: {account_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, email_information: {type: string, name: string, ref: string}, telegram_information: {type: string, name: string, ref: string}}, delete: boolean}, service_requestor: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, name: string, ref: string}, email_information: {type: string, name: string, ref: string}, telegram_information: {type: string, name: string, ref: string}}, insert: {account_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, email_information: {type: string, name: string, ref: string}, telegram_information: {type: string, name: string, ref: string}}, delete: boolean}, volunteer: {select: {id: {name: string, type: string}, account_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, email_information: {type: string, name: string, ref: string}, telegram_information: {type: string, name: string, ref: string}}, insert: {account_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, email_information: {type: string, name: string, ref: string}, telegram_information: {type: string, name: string, ref: string}}, delete: boolean}}, service_requestor: {admin: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, organisation: {name: string, type: string}, account: {type: string, ref: string, name: string}, clients: {type: string, ref: string, name: string}, clients_aggregate: {type: string, ref: string, name: string}, membership: {type: string, ref: string, name: string}}, insert: {account_id: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, organisation: {name: string, type: string}, account: {type: string, ref: string, name: string}, clients: {type: string, ref: string, name: string}, clients_aggregate: {type: string, ref: string, name: string}, membership: {type: string, ref: string, name: string}}, update: {account_id: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, organisation: {name: string, type: string}, account: {type: string, ref: string, name: string}, clients: {type: string, ref: string, name: string}, clients_aggregate: {type: string, ref: string, name: string}, membership: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, organisation: {name: string, type: string}, account: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}}}, service_requestor: {select: {account_id: {name: string, type: string}, id: {name: string, type: string}, membership_id: {name: string, type: string}, organisation: {name: string, type: string}, account: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}}, update: {organisation: {name: string, type: string}, account: {type: string, name: string, ref: string}, client: {type: string, name: string, ref: string}, membership: {type: string, name: string, ref: string}}}}, telegram_information: {admin: {select: {chat_id: {name: string, type: string}, id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, ref: string, name: string}}, insert: {chat_id: {name: string, type: string}, id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, ref: string, name: string}}, update: {chat_id: {name: string, type: string}, id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {id: {name: string, type: string}, chat_id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, insert: {chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, update: {chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, delete: boolean}, service_requestor: {select: {id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, insert: {chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, update: {chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, delete: boolean}, volunteer: {select: {id: {name: string, type: string}, notification_setting_id: {name: string, type: string}, chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, insert: {chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, update: {chat_id: {name: string, type: string}, notification_setting: {type: string, name: string, ref: string}}, delete: boolean}}, volunteer: {admin: {select: {account_id: {name: string, type: string}, approval_status: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}, assignments: {type: string, ref: string, name: string}, assignments_aggregate: {type: string, ref: string, name: string}, feedbacks: {type: string, ref: string, name: string}, feedbacks_aggregate: {type: string, ref: string, name: string}}, insert: {account_id: {name: string, type: string}, approval_status: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}, assignments: {type: string, ref: string, name: string}, assignments_aggregate: {type: string, ref: string, name: string}, feedbacks: {type: string, ref: string, name: string}, feedbacks_aggregate: {type: string, ref: string, name: string}}, update: {account_id: {name: string, type: string}, approval_status: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, ref: string, name: string}, assignments: {type: string, ref: string, name: string}, assignments_aggregate: {type: string, ref: string, name: string}, feedbacks: {type: string, ref: string, name: string}, feedbacks_aggregate: {type: string, ref: string, name: string}}, delete: boolean}, client: {select: {account_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, assignment: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}}}, service_requestor: {select: {account_id: {name: string, type: string}, account: {type: string, name: string, ref: string}, assignment: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}}}, volunteer: {select: {account_id: {name: string, type: string}, approval_status: {name: string, type: string}, id: {name: string, type: string}, account: {type: string, name: string, ref: string}, assignment: {type: string, name: string, ref: string}, feedback: {type: string, name: string, ref: string}}}}}|{}}
   */
  getRoleSchemaPermittedSelectFields = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'select');
  }
  getRoleSchemaPermittedUpdateFields = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'update');
  }
  isRolePermittedToDeleteForSchema = ({ role, schema }) => {
    return this.__getSubTree(schema, role, 'delete') === true;
  }

  __getSubTree = (...nodes) => {
    if (!nodes || nodes.length === 0) {
      return null;
    }
    let root = this.__crudTree;
    for (const node of nodes) {
      let next = root[node];
      if (!next) {
        return null;
      }
      else {
        root = root[node];
      }
    }
    return root;
  }

  async __getHasuraGraphQLDomainSchemas() {
    let data = await fetch("http://localhost:8080/v1/graphql", {
      "body": "{\"query\":\"{\\n  __schema {\\n    types {\\n      name\\n      fields {\\n        name\\n        type {\\n          name\\n          kind\\n          ofType {\\n            name\\n            kind\\n          }\\n        }\\n      }\\n    } \\n  }\\n}\",\"variables\":null}",
      "method": "POST",
    })
    data = (await data.json()).data;
    return data.__schema.types.filter(type => DOMAIN_SCHEMA_NAMES.has(type.name));
  }

  __isArrayField = (field) => {
    return field.type.ofType && field.type.ofType.kind === 'LIST';
  }

  __isObjectField = (field) => {
    return (
      field.type.kind === 'OBJECT' ||
      (field.type.ofType && field.type.ofType.kind === 'OBJECT')
    );
  }

  __isNestedField = (field) => {
    return this.__isArrayField(field) || this.__isObjectField(field);
  }
}

function json(x) {
  return JSON.stringify(x, null, 2);
}

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

// new CrudTree()
//   .build()
//   .then(tree =>
//     fs.writeFileSync('crud_tree.json', json(tree))
//   );

module.exports = CrudTree;
