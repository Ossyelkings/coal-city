require('./setup');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+234 800 000 0000',
    password: 'password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.role).toBe('customer');
      expect(res.body.user.password).toBeUndefined();
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await User.create(testUser);
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(res.body.error).toBeDefined();
    });

    it('should reject missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'a@b.com' })
        .expect(422);

      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await User.create(testUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should reject wrong password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: 'wrongpass' })
        .expect(401);
    });

    it('should reject non-existent email', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'password123' })
        .expect(401);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should issue new tokens with valid refresh token', async () => {
      // Register to get tokens
      const regRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const res = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: regRes.body.refreshToken })
        .expect(200);

      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });

    it('should reject missing refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({});

      // Controller returns 400, validation middleware returns 422
      expect([400, 422]).toContain(res.status);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should return profile for authenticated user', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${regRes.body.accessToken}`)
        .expect(200);

      expect(res.body.name).toBe(testUser.name);
      expect(res.body.email).toBe(testUser.email);
      expect(res.body.password).toBeUndefined();
    });

    it('should reject unauthenticated request', async () => {
      await request(app)
        .get('/api/auth/profile')
        .expect(401);
    });
  });

  describe('PUT /api/auth/profile', () => {
    it('should update profile fields', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const res = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${regRes.body.accessToken}`)
        .send({ name: 'Updated Name', phone: '+234 900 000 0000' })
        .expect(200);

      expect(res.body.name).toBe('Updated Name');
      expect(res.body.phone).toBe('+234 900 000 0000');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout and clear refresh token', async () => {
      const regRes = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${regRes.body.accessToken}`)
        .expect(200);

      // Old refresh token should no longer work
      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: regRes.body.refreshToken })
        .expect(401);
    });
  });
});
