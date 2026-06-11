const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HR System API',
    version: '1.0.0',
    description:
      'Production-grade API documentation for authentication and user management endpoints.',
  },
  servers: [
    {
      url: 'http://localhost:8009/',
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error',
          },
          message: {
            type: 'string',
            example: 'Invalid request payload',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '681a3c7ac9ab39d812345678',
          },
          firstName: {
            type: 'string',
            example: 'Yassen',
          },
          lastName: {
            type: 'string',
            example: 'Mohamed',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'yassen@test.com',
          },
          phone: {
            type: 'string',
            nullable: true,
            example: '01234567890',
          },
          role: {
            type: 'string',
            description: 'Role name resolved from the Roles collection',
            example: 'admin',
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'active',
          },
          shiftId: {
            type: 'string',
            nullable: true,
            example: null,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-06T17:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-05-06T17:31:00.000Z',
          },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['identifier', 'password'],
        properties: {
          identifier: {
            type: 'string',
            example: 'admin@gmail.com',
          },
          password: {
            type: 'string',
            example: 'admin123',
          },
        },
      },
      LoginResponseData: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      RefreshTokenResponseData: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['oldPassword', 'newPassword'],
        properties: {
          oldPassword: {
            type: 'string',
            example: 'old123',
          },
          newPassword: {
            type: 'string',
            minLength: 6,
            example: 'new123456',
          },
        },
      },
      LogoutRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
      SuccessMessageResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          message: {
            type: 'string',
            example: 'Operation completed successfully',
          },
        },
      },
      SuccessResponseWithUser: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/User',
          },
        },
      },
      SuccessResponseWithUsers: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
      Role: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '6820ab17c9ab39d812345678',
          },
          name: {
            type: 'string',
            example: 'teamlead',
          },
          permissions: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['users.read', 'attendance.history'],
          },
          isSystem: {
            type: 'boolean',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      SuccessResponseWithRole: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/Role',
          },
        },
      },
      SuccessResponseWithRoles: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Role',
            },
          },
        },
      },
      CreateRoleRequest: {
        type: 'object',
        required: ['name', 'permissions'],
        properties: {
          name: {
            type: 'string',
            example: 'teamlead',
          },
          permissions: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['users.read', 'attendance.history'],
          },
        },
      },
      UpdateRoleRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'supervisor',
          },
          permissions: {
            type: 'array',
            items: {
              type: 'string',
            },
            example: ['users.read'],
          },
        },
      },
      CreateUserRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'email', 'password'],
        properties: {
          firstName: {
            type: 'string',
            example: 'Yassen',
          },
          lastName: {
            type: 'string',
            example: 'Mohamed',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'yassen@test.com',
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'password123',
          },
          phone: {
            type: 'string',
            example: '01234567890',
          },
          role: {
            type: 'string',
            description: 'Role name resolved from the Roles collection',
            example: 'employee',
          },
          shiftId: {
            type: 'string',
            nullable: true,
            example: null,
          },
        },
      },
      UpdateUserRequest: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            example: 'Yassen',
          },
          lastName: {
            type: 'string',
            example: 'Mohamed',
          },
          phone: {
            type: 'string',
            example: '01234567890',
          },
          role: {
            type: 'string',
            description: 'Role name resolved from the Roles collection',
            example: 'employee',
          },
          shiftId: {
            type: 'string',
            nullable: true,
            description: 'Shift MongoDB ObjectId. Pass null to unassign.',
            example: '6820ab17c9ab39d812345679',
          },
        },
      },
      UpdateUserStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'inactive',
          },
        },
      },
      Shift: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '6820ab17c9ab39d812345679',
          },
          name: {
            type: 'string',
            example: 'Morning Shift',
          },
          startTime: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
            example: '09:00',
          },
          endTime: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
            example: '17:00',
          },
          workingDays: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            },
            example: ['mon', 'tue', 'wed', 'thu', 'fri'],
          },
          breakDuration: {
            type: 'integer',
            minimum: 0,
            example: 60,
          },
          gracePeriod: {
            type: 'integer',
            minimum: 0,
            example: 15,
          },
          isNightShift: {
            type: 'boolean',
            example: false,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'active',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      SuccessResponseWithShift: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/Shift',
          },
        },
      },
      SuccessResponseWithShifts: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Shift',
            },
          },
        },
      },
      CreateShiftRequest: {
        type: 'object',
        required: ['name', 'startTime', 'endTime', 'workingDays'],
        properties: {
          name: {
            type: 'string',
            example: 'Morning Shift',
          },
          startTime: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
            example: '09:00',
          },
          endTime: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
            example: '17:00',
          },
          workingDays: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            },
            example: ['mon', 'tue', 'wed', 'thu', 'fri'],
          },
          breakDuration: {
            type: 'integer',
            minimum: 0,
            example: 60,
          },
          gracePeriod: {
            type: 'integer',
            minimum: 0,
            example: 15,
          },
          isNightShift: {
            type: 'boolean',
            example: false,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'active',
          },
        },
      },
      UpdateShiftRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Evening Shift',
          },
          startTime: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
            example: '14:00',
          },
          endTime: {
            type: 'string',
            pattern: '^([01]\\d|2[0-3]):[0-5]\\d$',
            example: '22:00',
          },
          workingDays: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
            },
            example: ['mon', 'tue', 'wed', 'thu', 'fri'],
          },
          breakDuration: {
            type: 'integer',
            minimum: 0,
            example: 45,
          },
          gracePeriod: {
            type: 'integer',
            minimum: 0,
            example: 10,
          },
          isNightShift: {
            type: 'boolean',
            example: false,
          },
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'active',
          },
        },
      },
      UpdateShiftStatusRequest: {
        type: 'object',
        required: ['status'],
        properties: {
          status: {
            type: 'string',
            enum: ['active', 'inactive'],
            example: 'inactive',
          },
        },
      },
      Office: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '6820ab17c9ab39d812345680',
          },
          name: {
            type: 'string',
            example: 'Head Office',
          },
          lat: {
            type: 'number',
            example: 30.0444,
          },
          lng: {
            type: 'number',
            example: 31.2357,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      Attendance: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '6820ab17c9ab39d812345681',
          },
          userId: {
            type: 'string',
            example: '681a3c7ac9ab39d812345678',
          },
          date: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-11T00:00:00.000Z',
          },
          checkInTime: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-06-11T09:00:00.000Z',
          },
          checkOutTime: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-06-11T17:00:00.000Z',
          },
          checkInLat: {
            type: 'number',
            nullable: true,
            example: 30.0444,
          },
          checkInLng: {
            type: 'number',
            nullable: true,
            example: 31.2357,
          },
          checkOutLat: {
            type: 'number',
            nullable: true,
            example: 30.0445,
          },
          checkOutLng: {
            type: 'number',
            nullable: true,
            example: 31.2358,
          },
          locationType: {
            type: 'string',
            enum: ['office', 'remote'],
            nullable: true,
            example: 'office',
          },
          officeId: {
            type: 'string',
            nullable: true,
            example: '6820ab17c9ab39d812345680',
          },
          officeName: {
            type: 'string',
            nullable: true,
            example: 'Head Office',
          },
          totalWorkMinutes: {
            type: 'integer',
            minimum: 0,
            example: 480,
          },
          status: {
            type: 'string',
            enum: ['present', 'late', 'absent'],
            example: 'present',
          },
          earlyCheckout: {
            type: 'boolean',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      CreateOfficeRequest: {
        type: 'object',
        required: ['name', 'lat', 'lng'],
        properties: {
          name: {
            type: 'string',
            example: 'Head Office',
          },
          lat: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            example: 30.0444,
          },
          lng: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            example: 31.2357,
          },
        },
      },
      CheckInRequest: {
        type: 'object',
        required: ['lat', 'lng'],
        properties: {
          lat: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            example: 30.0444,
          },
          lng: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            example: 31.2357,
          },
        },
      },
      CheckOutRequest: {
        type: 'object',
        required: ['lat', 'lng'],
        properties: {
          lat: {
            type: 'number',
            minimum: -90,
            maximum: 90,
            example: 30.0444,
          },
          lng: {
            type: 'number',
            minimum: -180,
            maximum: 180,
            example: 31.2357,
          },
        },
      },
      SuccessResponseWithOffice: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/Office',
          },
        },
      },
      SuccessResponseWithOffices: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Office',
            },
          },
        },
      },
      SuccessResponseWithAttendance: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/Attendance',
          },
        },
      },
      SuccessResponseWithAttendanceNullable: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            oneOf: [
              { $ref: '#/components/schemas/Attendance' },
              { type: 'null' },
            ],
            nullable: true,
          },
        },
      },
      AttendanceSummary: {
        type: 'object',
        properties: {
          totalDays: {
            type: 'integer',
            example: 20,
          },
          presentDays: {
            type: 'integer',
            example: 15,
          },
          lateDays: {
            type: 'integer',
            example: 3,
          },
          absentDays: {
            type: 'integer',
            example: 2,
          },
          totalWorkMinutes: {
            type: 'integer',
            example: 9600,
          },
          averageWorkMinutes: {
            type: 'integer',
            example: 480,
          },
        },
      },
      MonthlyAttendanceSummary: {
        allOf: [
          { $ref: '#/components/schemas/AttendanceSummary' },
          {
            type: 'object',
            properties: {
              month: {
                type: 'integer',
                example: 6,
              },
              year: {
                type: 'integer',
                example: 2026,
              },
            },
          },
        ],
      },
      AttendanceHistoryResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Attendance',
            },
          },
          page: {
            type: 'integer',
            example: 1,
          },
          limit: {
            type: 'integer',
            example: 10,
          },
          total: {
            type: 'integer',
            example: 42,
          },
          totalPages: {
            type: 'integer',
            example: 5,
          },
        },
      },
      AttendanceLogsResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/Attendance',
            },
          },
          page: {
            type: 'integer',
            example: 1,
          },
          limit: {
            type: 'integer',
            example: 10,
          },
          total: {
            type: 'integer',
            example: 120,
          },
          totalPages: {
            type: 'integer',
            example: 12,
          },
        },
      },
      BreakType: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '6820ab17c9ab39d812345682',
          },
          name: {
            type: 'string',
            example: 'Lunch',
          },
          durationMinutes: {
            type: 'integer',
            minimum: 1,
            example: 60,
          },
          isActive: {
            type: 'boolean',
            example: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-11T10:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-11T10:00:00.000Z',
          },
        },
      },
      CreateBreakTypeRequest: {
        type: 'object',
        required: ['name', 'durationMinutes'],
        properties: {
          name: {
            type: 'string',
            example: 'Lunch',
          },
          durationMinutes: {
            type: 'integer',
            minimum: 1,
            example: 60,
          },
        },
      },
      UpdateBreakTypeRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'Lunch Break',
          },
          durationMinutes: {
            type: 'integer',
            minimum: 1,
            example: 75,
          },
        },
        description: 'At least one field is required',
      },
      SuccessResponseWithBreakType: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/BreakType',
          },
        },
      },
      SuccessResponseWithBreakTypes: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/BreakType',
            },
          },
        },
      },
      Break: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '6820ab17c9ab39d812345683',
          },
          userId: {
            type: 'string',
            example: '681a3c7ac9ab39d812345678',
          },
          attendanceId: {
            type: 'string',
            example: '6820ab17c9ab39d812345681',
          },
          breakTypeId: {
            type: 'string',
            example: '6820ab17c9ab39d812345682',
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-11T12:00:00.000Z',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-06-11T12:30:00.000Z',
          },
          durationMinutes: {
            type: 'integer',
            minimum: 0,
            example: 30,
          },
          allowedMinutes: {
            type: 'integer',
            minimum: 0,
            example: 30,
          },
          exceed: {
            type: 'integer',
            minimum: 0,
            example: 0,
          },
          status: {
            type: 'string',
            enum: ['active', 'completed'],
            example: 'completed',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      BreakLog: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '6820ab17c9ab39d812345683',
          },
          userId: {
            type: 'string',
            example: '681a3c7ac9ab39d812345678',
          },
          attendanceId: {
            type: 'string',
            example: '6820ab17c9ab39d812345681',
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            example: '2026-06-11T12:00:00.000Z',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: '2026-06-11T12:30:00.000Z',
          },
          durationMinutes: {
            type: 'integer',
            minimum: 0,
            example: 30,
          },
          allowedMinutes: {
            type: 'integer',
            minimum: 0,
            example: 30,
          },
          exceed: {
            type: 'integer',
            minimum: 0,
            example: 5,
          },
          isExceeded: {
            type: 'boolean',
            example: true,
          },
          status: {
            type: 'string',
            enum: ['active', 'completed'],
            example: 'completed',
          },
          breakType: {
            $ref: '#/components/schemas/BreakType',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      BreakTodayResponse: {
        type: 'object',
        properties: {
          totalBreaks: {
            type: 'integer',
            example: 2,
          },
          totalMinutes: {
            type: 'integer',
            example: 45,
          },
          exceededBreaks: {
            type: 'integer',
            example: 1,
          },
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/BreakLog',
            },
          },
        },
      },
      BreakHistoryResponse: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/BreakLog',
            },
          },
          page: {
            type: 'integer',
            example: 1,
          },
          limit: {
            type: 'integer',
            example: 10,
          },
          total: {
            type: 'integer',
            example: 42,
          },
          totalPages: {
            type: 'integer',
            example: 5,
          },
        },
      },
      BreakSummaryResponse: {
        type: 'object',
        properties: {
          totalBreaks: {
            type: 'integer',
            example: 12,
          },
          totalMinutes: {
            type: 'integer',
            example: 360,
          },
          averageMinutes: {
            type: 'integer',
            example: 30,
          },
          exceededBreaks: {
            type: 'integer',
            example: 3,
          },
          exceededPercentage: {
            type: 'number',
            example: 25,
          },
        },
      },
      StartBreakRequest: {
        type: 'object',
        required: ['breakTypeId'],
        properties: {
          breakTypeId: {
            type: 'string',
            example: '6820ab17c9ab39d812345682',
          },
        },
      },
      SuccessResponseWithBreak: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/Break',
          },
        },
      },
      SuccessResponseWithBreakLog: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/BreakLog',
          },
        },
      },
      SuccessResponseWithBreakToday: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/BreakTodayResponse',
          },
        },
      },
      SuccessResponseWithBreakHistory: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/BreakHistoryResponse',
          },
        },
      },
      SuccessResponseWithBreakSummary: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/BreakSummaryResponse',
          },
        },
      },
      SuccessResponseWithAttendanceSummary: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/AttendanceSummary',
          },
        },
      },
      SuccessResponseWithMonthlyAttendanceSummary: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/MonthlyAttendanceSummary',
          },
        },
      },
      SuccessResponseWithAttendanceHistory: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/AttendanceHistoryResponse',
          },
        },
      },
      SuccessResponseWithAttendanceLogs: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'success',
          },
          data: {
            $ref: '#/components/schemas/AttendanceLogsResponse',
          },
        },
      },
    },
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
            examples: {
              badRequest: {
                value: {
                  status: 'error',
                  message: 'Validation failed',
                },
              },
            },
          },
        },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
            examples: {
              unauthorized: {
                value: {
                  status: 'error',
                  message: 'Unauthorized',
                },
              },
            },
          },
        },
      },
      Forbidden: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
            examples: {
              forbidden: {
                value: {
                  status: 'error',
                  message: 'Forbidden',
                },
              },
            },
          },
        },
      },
      NotFound: {
        description: 'Not Found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
            examples: {
              notFound: {
                value: {
                  status: 'error',
                  message: 'Resource not found',
                },
              },
            },
          },
        },
      },
      Conflict: {
        description: 'Conflict',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ApiError',
            },
            examples: {
              conflict: {
                value: {
                  status: 'error',
                  message: 'Email already exists',
                },
              },
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  tags: [
    {
      name: 'Auth',
      description: 'Authentication and token management',
    },
    {
      name: 'Users',
      description: 'User lifecycle and administration',
    },
    {
      name: 'Roles',
      description: 'Roles lifecycle and permission management',
    },
    {
      name: 'Shifts',
      description: 'Shift schedule management',
    },
    {
      name: 'Attendance',
      description: 'Attendance check-in, check-out, and office location management',
    },
    {
      name: 'Break Types',
      description: 'Break types configuration and management',
    },
    {
      name: 'Breaks',
      description: 'Employee break start and end actions',
    },
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    './modules/auth/*.js',
    './modules/users/*.js',
    './modules/roles/*.js',
    './modules/shifts/*.js',
    './modules/attendance/*.js',
    './modules/break-types/*.js',
    './modules/breaks/*.js',
  ],
};

module.exports = swaggerJsdoc(swaggerOptions);
