export default {
  "meta": {
    "name": "reporting",
    "version": "1.0.0",
    "description": "Auto-generated reporting module"
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
    "invoices": {
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
        "date"
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
        "edit",
        "delete"
      ],
      "bulkActions": [
        "delete"
      ]
    },
    "paymentmethods": {
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
        "name"
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
        "edit",
        "delete"
      ],
      "bulkActions": [
        "delete"
      ]
    },
    "projects": {
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
        "name"
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
        "edit",
        "delete"
      ],
      "bulkActions": [
        "delete"
      ]
    },
    "suppliers": {
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
        "name"
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
        "edit",
        "delete"
      ],
      "bulkActions": [
        "delete"
      ]
    }
  }
}
