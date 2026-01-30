require('./setup');
const crypto = require('crypto');
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

jest.mock('../utils/sendEmail', () => jest.fn().mockResolvedValue(undefined));

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

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      sendEmail.mockClear();
      await User.create(testUser);
    });

    it('should return success and send email for existing user', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email })
        .expect(200);

      expect(res.body.message).toMatch(/reset link/i);
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: testUser.email,
          subject: expect.stringContaining('Password Reset'),
        })
      );

      // Verify token was stored on user
      const user = await User.findOne({ email: testUser.email });
      expect(user.passwordResetToken).toBeDefined();
      expect(user.passwordResetExpires).toBeDefined();
      expect(new Date(user.passwordResetExpires).getTime()).toBeGreaterThan(Date.now());
    });

    it('should return success for non-existent email (no leak)', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nobody@example.com' })
        .expect(200);

      expect(res.body.message).toMatch(/reset link/i);
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('should reject invalid email format', async () => {
      await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'not-an-email' })
        .expect(422);
    });
  });

  describe('POST /api/auth/reset-password/:token', () => {
    let rawToken;

    beforeEach(async () => {
      const user = await User.create(testUser);

      rawToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');
      user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
      await user.save();
    });

    it('should reset password with valid token', async () => {
      const newPassword = 'newpassword123';
      const res = await request(app)
        .post(`/api/auth/reset-password/${rawToken}`)
        .send({ password: newPassword })
        .expect(200);

      expect(res.body.message).toMatch(/reset successfully/i);

      // Verify reset fields are cleared
      const user = await User.findOne({ email: testUser.email });
      expect(user.passwordResetToken).toBeUndefined();
      expect(user.passwordResetExpires).toBeUndefined();

      // Verify new password works for login
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: newPassword })
        .expect(200);

      expect(loginRes.body.accessToken).toBeDefined();
    });

    it('should reject invalid token', async () => {
      await request(app)
        .post('/api/auth/reset-password/invalidtoken')
        .send({ password: 'newpassword123' })
        .expect(400);
    });

    it('should reject expired token', async () => {
      // Set token expiry to the past
      const user = await User.findOne({ email: testUser.email });
      user.passwordResetExpires = Date.now() - 1000;
      await user.save();

      await request(app)
        .post(`/api/auth/reset-password/${rawToken}`)
        .send({ password: 'newpassword123' })
        .expect(400);
    });

    it('should reject password shorter than 8 characters', async () => {
      await request(app)
        .post(`/api/auth/reset-password/${rawToken}`)
        .send({ password: 'short' })
        .expect(422);
    });
  });
});
