export default {
  "meta": {
    "name": "admin",
    "version": "1.0.0",
    "description": "Auto-generated admin module"
  },
  "features": {
    "authentication": false,
    "authorization": false,
    "audit": false,
    "export": true
  },
  "entities": {
    "profile": {
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
        "first_name",
        "middle_name",
        "last_name",
        "email_address",
        "phone_number",
        "profile_picture"
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
    "mailsettings": {
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
        "smtp_server",
        "smtp_username",
        "smtp_password",
        "email_encryption"
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
