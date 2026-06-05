import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Neero Financial Platform API',
      version: '1.0.0',
      description:
        'API for Neero – a digital financial services platform enabling payments, transfers, Mobile Money operations, and international transactions.',
      contact: {
        name: 'Neero Support',
        email: 'support@neero.com',
      },
      license: {
        name: 'Proprietary',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3001}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.neero.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                message: { type: 'string' },
                code: { type: 'string' },
              },
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email', nullable: true },
            phone: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'COMPLIANCE', 'FINANCE', 'SUPPORT'] },
            status: {
              type: 'string',
              enum: ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'CLOSED'],
            },
            kycLevel: { type: 'string', enum: ['NONE', 'LEVEL_1', 'LEVEL_2', 'LEVEL_3'] },
            twoFAEnabled: { type: 'boolean' },
            emailVerified: { type: 'boolean' },
            phoneVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Wallet: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            currency: { type: 'string', example: 'XOF' },
            balance: { type: 'string', example: '150000.00000000' },
            frozenBalance: { type: 'string', example: '0.00000000' },
            status: { type: 'string', enum: ['ACTIVE', 'FROZEN', 'CLOSED'] },
            dailyLimit: { type: 'string' },
            monthlyLimit: { type: 'string' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            reference: { type: 'string' },
            amount: { type: 'string' },
            fee: { type: 'string' },
            currency: { type: 'string' },
            type: {
              type: 'string',
              enum: [
                'DEPOSIT',
                'WITHDRAWAL',
                'TRANSFER_IN',
                'TRANSFER_OUT',
                'PAYMENT',
                'REFUND',
                'FEE',
                'CURRENCY_CONVERSION',
              ],
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REVERSED'],
            },
            description: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication and authorization' },
      { name: 'Users', description: 'User profile management' },
      { name: 'KYC', description: 'Know Your Customer verification' },
      { name: 'Wallet', description: 'Wallet and balance management' },
      { name: 'Transactions', description: 'Transaction history' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Cards', description: 'Virtual and physical card management' },
      { name: 'Currency', description: 'Currency conversion and exchange rates' },
      { name: 'Notifications', description: 'User notifications' },
      { name: 'Support', description: 'Customer support tickets' },
      { name: 'Admin', description: 'Administrative operations' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
