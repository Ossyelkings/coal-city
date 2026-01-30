require('./setup');
const User = require('../models/User');
const Category = require('../models/Category');

describe('User Model', () => {
  it('should hash password before saving', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(user.password).not.toBe('password123');
    expect(user.password.startsWith('$2')).toBe(true);
  });

  it('should compare passwords correctly', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const valid = await user.comparePassword('password123');
    const invalid = await user.comparePassword('wrongpassword');

    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });

  it('should strip password and refreshToken from JSON', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      refreshToken: 'some-token',
    });

    const json = user.toJSON();
    expect(json.password).toBeUndefined();
    expect(json.refreshToken).toBeUndefined();
    expect(json.name).toBe('Test User');
    expect(json.email).toBe('test@example.com');
  });

  it('should default role to customer', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    expect(user.role).toBe('customer');
  });

  it('should require name, email, password', async () => {
    await expect(User.create({})).rejects.toThrow();
    await expect(User.create({ name: 'Test' })).rejects.toThrow();
    await expect(User.create({ name: 'Test', email: 'a@b.com' })).rejects.toThrow();
  });

  it('should enforce unique email', async () => {
    await User.create({
      name: 'User 1',
      email: 'dup@example.com',
      password: 'password123',
    });

    await expect(
      User.create({
        name: 'User 2',
        email: 'dup@example.com',
        password: 'password456',
      })
    ).rejects.toThrow();
  });

  it('should not rehash password if not modified', async () => {
    const user = await User.create({
      name: 'Test',
      email: 'norehash@example.com',
      password: 'password123',
    });

    const originalHash = user.password;
    user.name = 'Updated Name';
    await user.save();

    expect(user.password).toBe(originalHash);
  });
});

describe('Category Model', () => {
  it('should auto-generate slug from name', async () => {
    const cat = await Category.create({ name: 'Pipes & Fittings' });
    expect(cat.slug).toBe('pipes-and-fittings');
  });

  it('should require name', async () => {
    await expect(Category.create({})).rejects.toThrow();
  });

  it('should enforce unique name', async () => {
    await Category.create({ name: 'Jacuzzis' });
    await expect(Category.create({ name: 'Jacuzzis' })).rejects.toThrow();
  });
});
