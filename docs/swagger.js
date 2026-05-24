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
  ],
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./modules/auth/*.js', './modules/users/*.js', './modules/roles/*.js'],
};

module.exports = swaggerJsdoc(swaggerOptions);
