export default {
  "meta": {
    "name": "iam",
    "version": "1.0.0",
    "description": "Auto-generated iam module"
  },
  "features": {
    "authentication": false,
    "authorization": false,
    "audit": false,
    "export": true
  },
  "ui": {
    "useModal": true,
    "modalSize": "lg"
  },
  "entities": {
    "login": {
      "pagination": {
        "default": 20,
        "options": [
          10,
          20,
          50,
          100
        ]
      },
      "filters": [
        "username",
        "password"
      ],
      "sort": {
        "default": "created_at",
        "allowed": [
          "id",
          "created_at",
          "updated_at"
        ]
      },
      "actions": [
        "create"
      ],
      "bulkActions": []
    },
    "resetpasswordrequest": {
      "pagination": {
        "default": 20,
        "options": [
          10,
          20,
          50,
          100
        ]
      },
      "filters": [
        "username"
      ],
      "sort": {
        "default": "created_at",
        "allowed": [
          "id",
          "created_at",
          "updated_at"
        ]
      },
      "actions": [
        "view"
      ],
      "bulkActions": []
    },
    "resetpassword": {
      "pagination": {
        "default": 20,
        "options": [
          10,
          20,
          50,
          100
        ]
      },
      "filters": [
        "password",
        "confirmPassword"
      ],
      "sort": {
        "default": "created_at",
        "allowed": [
          "id",
          "created_at",
          "updated_at"
        ]
      },
      "actions": [
        "view"
      ],
      "bulkActions": []
    },
    "roles": {
      "pagination": {
        "default": 20,
        "options": [
          10,
          20,
          50,
          100
        ]
      },
      "filters": [
        "name",
        "description",
        "ruleName"
      ],
      "sort": {
        "default": "created_at",
        "allowed": [
          "id",
          "created_at",
          "updated_at"
        ]
      },
      "actions": [
        "view",
        "create",
        "edit",
        "delete"
      ],
      "bulkActions": [
        "delete"
      ]
    },
    "permissions": {
      "pagination": {
        "default": 20,
        "options": [
          10,
          20,
          50,
          100
        ]
      },
      "filters": [
        "name",
        "description",
        "ruleName"
      ],
      "sort": {
        "default": "created_at",
        "allowed": [
          "id",
          "created_at",
          "updated_at"
        ]
      },
      "actions": [
        "view",
        "edit"
      ],
      "bulkActions": []
    },
    "groups": {
      "pagination": {
        "default": 20,
        "options": [
          10,
          20,
          50,
          100
        ]
      },
      "filters": [
        "name",
        "description",
        "ruleName"
      ],
      "sort": {
        "default": "created_at",
        "allowed": [
          "id",
          "created_at",
          "updated_at"
        ]
      },
      "actions": [
        "view",
        "create",
        "edit",
        "delete"
      ],
      "bulkActions": [
        "delete"
      ]
    },
    "users": {
      "pagination": {
        "default": 20,
        "options": [
          10,
          20,
          50,
          100
        ]
      },
      "filters": [
        "username",
        "email",
        "status"
      ],
      "sort": {
        "default": "created_at",
        "allowed": [
          "user_id",
          "username",
          "created_at",
          "updated_at"
        ]
      },
      "actions": [
        "view"
      ],
      "bulkActions": []
    }
  }
}
