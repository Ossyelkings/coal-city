require('./setup');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Quote = require('../models/Quote');
const ContactMessage = require('../models/ContactMessage');

let emailCounter = 0;

// Helper to create admin user and return token (generates token directly)
async function getAdminToken() {
  emailCounter++;
  const admin = await User.create({
    name: 'Admin',
    email: `admin${emailCounter}@example.com`,
    phone: '+234 800 000 0000',
    password: 'password123',
    role: 'admin',
  });
  return jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
}

// Helper to create customer user and return { token, userId }
async function getCustomerToken() {
  emailCounter++;
  const user = await User.create({
    name: 'Customer',
    email: `customer${emailCounter}@example.com`,
    phone: '+234 800 000 0001',
    password: 'password123',
    role: 'customer',
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  return { token, userId: user._id };
}

// ─── CATEGORIES ──────────────────────────────────────────────

describe('Categories API', () => {
  let adminToken;

  beforeEach(async () => {
    adminToken = await getAdminToken();
  });

  describe('GET /api/categories', () => {
    it('should return all categories (public)', async () => {
      await Category.create([
        { name: 'Jacuzzis', slug: 'jacuzzis', order: 1 },
        { name: 'Bathtubs', slug: 'bathtubs', order: 2 },
      ]);

      const res = await request(app)
        .get('/api/categories')
        .expect(200);

      expect(res.body).toHaveLength(2);
      expect(res.body[0].name).toBe('Jacuzzis');
    });
  });

  describe('GET /api/categories/:id', () => {
    it('should return a category by id', async () => {
      const cat = await Category.create({ name: 'Sinks', slug: 'sinks' });

      const res = await request(app)
        .get(`/api/categories/${cat._id}`)
        .expect(200);

      expect(res.body.name).toBe('Sinks');
    });

    it('should return a category by slug', async () => {
      await Category.create({ name: 'Water Closets', slug: 'water-closets' });

      const res = await request(app)
        .get('/api/categories/water-closets')
        .expect(200);

      expect(res.body.name).toBe('Water Closets');
    });

    it('should return 404 for non-existent category', async () => {
      await request(app)
        .get('/api/categories/000000000000000000000000')
        .expect(404);
    });
  });

  describe('POST /api/categories', () => {
    it('should create a category (admin)', async () => {
      const res = await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Pipes & Fittings', description: 'All pipe products' })
        .expect(201);

      expect(res.body.name).toBe('Pipes & Fittings');
      expect(res.body.slug).toBe('pipes-and-fittings');
    });

    it('should reject unauthenticated request', async () => {
      await request(app)
        .post('/api/categories')
        .send({ name: 'Valves' })
        .expect(401);
    });

    it('should reject non-admin user', async () => {
      const { token } = await getCustomerToken();

      await request(app)
        .post('/api/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Valves' })
        .expect(403);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category (admin)', async () => {
      const cat = await Category.create({ name: 'Old Name', slug: 'old-name' });

      const res = await request(app)
        .put(`/api/categories/${cat._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'New Name' })
        .expect(200);

      expect(res.body.name).toBe('New Name');
    });

    it('should return 404 for non-existent category', async () => {
      await request(app)
        .put('/api/categories/000000000000000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('should delete a category (admin)', async () => {
      const cat = await Category.create({ name: 'ToDelete', slug: 'to-delete' });

      await request(app)
        .delete(`/api/categories/${cat._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const found = await Category.findById(cat._id);
      expect(found).toBeNull();
    });
  });
});

// ─── PRODUCTS ────────────────────────────────────────────────

describe('Products API', () => {
  let adminToken;
  let category;

  beforeEach(async () => {
    adminToken = await getAdminToken();
    category = await Category.create({ name: 'Jacuzzis', slug: 'jacuzzis' });
  });

  describe('GET /api/products', () => {
    it('should return paginated products (public)', async () => {
      await Product.create([
        { name: 'Product 1', category: category._id, description: 'Desc 1' },
        { name: 'Product 2', category: category._id, description: 'Desc 2' },
      ]);

      const res = await request(app)
        .get('/api/products')
        .expect(200);

      expect(res.body.products).toHaveLength(2);
      expect(res.body.total).toBe(2);
      expect(res.body.page).toBe(1);
    });

    it('should filter by category', async () => {
      const cat2 = await Category.create({ name: 'Sinks', slug: 'sinks' });
      await Product.create([
        { name: 'Jacuzzi 1', category: category._id, description: 'Desc' },
        { name: 'Sink 1', category: cat2._id, description: 'Desc' },
      ]);

      const res = await request(app)
        .get(`/api/products?category=${category._id}`)
        .expect(200);

      expect(res.body.products).toHaveLength(1);
      expect(res.body.products[0].name).toBe('Jacuzzi 1');
    });

    it('should support pagination', async () => {
      const products = [];
      for (let i = 1; i <= 5; i++) {
        products.push({ name: `Product ${i}`, category: category._id, description: `Desc ${i}` });
      }
      await Product.create(products);

      const res = await request(app)
        .get('/api/products?page=2&limit=2')
        .expect(200);

      expect(res.body.products).toHaveLength(2);
      expect(res.body.totalPages).toBe(3);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a product by id', async () => {
      const prod = await Product.create({
        name: 'Luxury Jacuzzi',
        category: category._id,
        description: 'A fine jacuzzi',
      });

      const res = await request(app)
        .get(`/api/products/${prod._id}`)
        .expect(200);

      expect(res.body.name).toBe('Luxury Jacuzzi');
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/api/products/000000000000000000000000')
        .expect(404);
    });
  });

  describe('POST /api/products', () => {
    it('should create a product (admin)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Jacuzzi',
          category: category._id.toString(),
          description: 'Brand new',
          price: 500000,
          featured: true,
        })
        .expect(201);

      expect(res.body.name).toBe('New Jacuzzi');
      expect(res.body.featured).toBe(true);
    });

    it('should reject unauthenticated request', async () => {
      await request(app)
        .post('/api/products')
        .send({ name: 'Test', category: category._id.toString(), description: 'Test' })
        .expect(401);
    });

    it('should reject non-admin user', async () => {
      const { token } = await getCustomerToken();

      await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Test', category: category._id.toString(), description: 'Test' })
        .expect(403);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product (admin)', async () => {
      const prod = await Product.create({
        name: 'Old Name',
        category: category._id,
        description: 'Old desc',
      });

      const res = await request(app)
        .put(`/api/products/${prod._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Updated Name', category: category._id.toString(), description: 'New desc' })
        .expect(200);

      expect(res.body.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product (admin)', async () => {
      const prod = await Product.create({
        name: 'Delete Me',
        category: category._id,
        description: 'Bye',
      });

      await request(app)
        .delete(`/api/products/${prod._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const found = await Product.findById(prod._id);
      expect(found).toBeNull();
    });
  });
});

// ─── QUOTES ──────────────────────────────────────────────────

describe('Quotes API', () => {
  const quoteData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 800 111 1111',
    product: 'Luxury Jacuzzi',
    message: 'Interested in purchase',
  };

  describe('POST /api/quotes', () => {
    it('should submit a quote (public)', async () => {
      const res = await request(app)
        .post('/api/quotes')
        .send(quoteData)
        .expect(201);

      expect(res.body.name).toBe(quoteData.name);
      expect(res.body.status).toBe('new');
    });

    it('should associate quote with logged-in user', async () => {
      const { token } = await getCustomerToken();

      const res = await request(app)
        .post('/api/quotes')
        .set('Authorization', `Bearer ${token}`)
        .send(quoteData)
        .expect(201);

      expect(res.body.user).toBeDefined();
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/quotes')
        .send({ name: 'John' });

      expect([400, 422]).toContain(res.status);
    });
  });

  describe('GET /api/quotes/my', () => {
    it('should return quotes for authenticated customer', async () => {
      const { token, userId } = await getCustomerToken();

      await Quote.create({ ...quoteData, user: userId });
      await Quote.create({ ...quoteData, email: 'other@example.com' }); // no user

      const res = await request(app)
        .get('/api/quotes/my')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
    });

    it('should reject unauthenticated request', async () => {
      await request(app)
        .get('/api/quotes/my')
        .expect(401);
    });
  });

  describe('GET /api/quotes (admin)', () => {
    it('should return paginated quotes for admin', async () => {
      const adminToken = await getAdminToken();
      await Quote.create([quoteData, { ...quoteData, email: 'other@example.com' }]);

      const res = await request(app)
        .get('/api/quotes')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.quotes).toHaveLength(2);
      expect(res.body.total).toBe(2);
    });

    it('should filter by status', async () => {
      const adminToken = await getAdminToken();
      await Quote.create([
        { ...quoteData, status: 'new' },
        { ...quoteData, email: 'a@b.com', status: 'reviewed' },
      ]);

      const res = await request(app)
        .get('/api/quotes?status=new')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.quotes).toHaveLength(1);
    });

    it('should reject non-admin user', async () => {
      const { token } = await getCustomerToken();

      await request(app)
        .get('/api/quotes')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('PUT /api/quotes/:id/status (admin)', () => {
    it('should update quote status', async () => {
      const adminToken = await getAdminToken();
      const quote = await Quote.create(quoteData);

      const res = await request(app)
        .put(`/api/quotes/${quote._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'reviewed', notes: 'Reviewed by admin' })
        .expect(200);

      expect(res.body.status).toBe('reviewed');
      expect(res.body.notes).toBe('Reviewed by admin');
    });

    it('should reject invalid status', async () => {
      const adminToken = await getAdminToken();
      const quote = await Quote.create(quoteData);

      const res = await request(app)
        .put(`/api/quotes/${quote._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'invalid_status' });

      expect([400, 422]).toContain(res.status);
    });
  });
});

// ─── CONTACTS ────────────────────────────────────────────────

describe('Contacts API', () => {
  const contactData = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '+234 800 222 2222',
    subject: 'Product Inquiry',
    message: 'I want to know more about your jacuzzis.',
  };

  describe('POST /api/contacts', () => {
    it('should submit a contact message (public)', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send(contactData)
        .expect(201);

      expect(res.body.name).toBe(contactData.name);
      expect(res.body.status).toBe('new');
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/contacts')
        .send({ name: 'Jane' });

      expect([400, 422]).toContain(res.status);
    });
  });

  describe('GET /api/contacts (admin)', () => {
    it('should return paginated contacts for admin', async () => {
      const adminToken = await getAdminToken();
      await ContactMessage.create([
        contactData,
        { ...contactData, email: 'other@example.com' },
      ]);

      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.messages).toHaveLength(2);
      expect(res.body.total).toBe(2);
    });

    it('should filter by status', async () => {
      const adminToken = await getAdminToken();
      await ContactMessage.create([
        { ...contactData, status: 'new' },
        { ...contactData, email: 'a@b.com', status: 'read' },
      ]);

      const res = await request(app)
        .get('/api/contacts?status=new')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.messages).toHaveLength(1);
    });

    it('should reject non-admin user', async () => {
      const { token } = await getCustomerToken();

      await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('GET /api/contacts/:id (admin)', () => {
    it('should return a single contact message', async () => {
      const adminToken = await getAdminToken();
      const msg = await ContactMessage.create(contactData);

      const res = await request(app)
        .get(`/api/contacts/${msg._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.name).toBe(contactData.name);
    });

    it('should return 404 for non-existent message', async () => {
      const adminToken = await getAdminToken();

      await request(app)
        .get('/api/contacts/000000000000000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('PUT /api/contacts/:id/status (admin)', () => {
    it('should update contact status', async () => {
      const adminToken = await getAdminToken();
      const msg = await ContactMessage.create(contactData);

      const res = await request(app)
        .put(`/api/contacts/${msg._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'read', notes: 'Acknowledged' })
        .expect(200);

      expect(res.body.status).toBe('read');
      expect(res.body.notes).toBe('Acknowledged');
    });

    it('should reject invalid status', async () => {
      const adminToken = await getAdminToken();
      const msg = await ContactMessage.create(contactData);

      const res = await request(app)
        .put(`/api/contacts/${msg._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'bad_status' });

      expect([400, 422]).toContain(res.status);
    });
  });
});
