# Coal City Jacuzzi & Plumbing Supplies — Specifications

## Part 1: Frontend Specs

### Component Architecture

```
App.js (Root)
├── ScrollToTop (utility component)
├── Navbar          props: { onQuoteClick }
├── Routes
│   ├── /         → Home      props: { onQuoteClick }
│   ├── /about    → About     props: none
│   ├── /gallery  → Gallery   props: { onQuoteClick }
│   └── /contact  → Contact   props: none
└── QuoteModal      props: { isOpen, onClose, preselectedProduct }
    └── Footer      props: none (rendered inside each page)
```

### State Management

**App-level state (lifted):**

| State              | Type    | Purpose                             |
|--------------------|---------|--------------------------------------|
| `quoteOpen`        | boolean | Controls QuoteModal visibility       |
| `preselectedProduct` | string | Pre-fills product dropdown in modal |

**Component-local state:**

| Component   | State           | Type    | Purpose                      |
|-------------|-----------------|---------|-------------------------------|
| Navbar      | `scrolled`      | boolean | Navbar style on scroll        |
| Navbar      | `mobileOpen`    | boolean | Mobile menu toggle            |
| Gallery     | `activeCategory`| string  | Product filter selection      |
| QuoteModal  | `formData`      | object  | Form field values             |
| QuoteModal  | `submitted`     | boolean | Success state                 |
| QuoteModal  | `sending`       | boolean | Loading state                 |
| QuoteModal  | `error`         | string  | Error message                 |
| Contact     | `formData`      | object  | Form field values             |
| Contact     | `submitted`     | boolean | Success state                 |
| Contact     | `sending`       | boolean | Loading state                 |
| Contact     | `error`         | string  | Error message                 |

State is managed with `useState` hooks. No external state library is used. Props are drilled from App to child components.

### Routing Structure

**Existing routes:**

| Path       | Component | Description                   |
|------------|-----------|-------------------------------|
| `/`        | Home      | Landing page with hero, categories, reasons, stats |
| `/about`   | About     | Company story, mission, values, team |
| `/gallery` | Gallery   | Product catalog with category filters |
| `/contact` | Contact   | Contact form, info, hours     |

**New routes (to be added):**

| Path              | Component       | Auth Required | Description                    |
|-------------------|-----------------|---------------|--------------------------------|
| `/login`          | Login           | No            | Customer & admin login         |
| `/register`       | Register        | No            | Customer registration          |
| `/profile`        | Profile         | Customer      | Customer account & quote history |
| `/admin`          | AdminDashboard  | Admin         | Dashboard overview             |
| `/admin/products` | AdminProducts   | Admin         | Product CRUD                   |
| `/admin/categories` | AdminCategories | Admin       | Category CRUD                  |
| `/admin/quotes`   | AdminQuotes     | Admin         | Quote request management       |
| `/admin/contacts` | AdminContacts   | Admin         | Contact message management     |
| `/admin/team`     | AdminTeam       | Admin         | Team member CRUD               |
| `/admin/settings` | AdminSettings   | Admin         | Company info & site settings   |

### Form Handling

**Pattern:** Controlled inputs with `useState` object.

```javascript
const [formData, setFormData] = useState({ name: '', email: '', ... });

const handleChange = (e) => {
  setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
```

**Validation:** Client-side required field checks before submission. Server-side validation to be added via API.

**Submission flow:**
1. Validate required fields
2. Set `sending = true`
3. Call API (currently EmailJS, will migrate to backend)
4. On success: set `submitted = true`
5. On error: set `error` message

### Third-Party Integrations

**EmailJS (`@emailjs/browser` v4.4.1)**
- Service ID: `service_r7apowi`
- Public Key: `o04vWLrNQSx1fQYXi`
- Template ID: `template_8f0kmzb` (shared for quotes and contacts)
- Template params: `{ name, email, title, message }`
- Will be replaced by backend email sending in Phase 5.

**Unsplash**
- Product, team, and hero images are loaded from `images.unsplash.com` URLs
- Images use query parameters for sizing (e.g., `?w=800&q=80`)
- Will be replaced with uploaded images stored on the server

---

## Part 2: Backend Specs (Node.js + Express)

### Technology Stack

| Layer        | Technology                        |
|-------------|-----------------------------------|
| Runtime     | Node.js (LTS)                     |
| Framework   | Express.js                        |
| Database    | MongoDB with Mongoose ODM         |
| Auth        | JWT (access + refresh tokens)     |
| Passwords   | bcrypt                            |
| Validation  | express-validator                  |
| File Upload | multer                            |
| Email       | Nodemailer (replaces EmailJS)     |
| CORS        | cors middleware                   |
| Rate Limit  | express-rate-limit                |
| Environment | dotenv                            |

### Folder Structure

```
server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── email.js           # Nodemailer transporter
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── admin.js           # Admin role check
│   ├── validate.js        # Validation error handler
│   ├── upload.js          # Multer config
│   ├── rateLimiter.js     # Rate limiting
│   └── errorHandler.js    # Global error handler
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Category.js
│   ├── Quote.js
│   ├── ContactMessage.js
│   ├── TeamMember.js
│   └── CompanyInfo.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── categories.js
│   ├── quotes.js
│   ├── contacts.js
│   ├── team.js
│   ├── company.js
│   └── upload.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── categoryController.js
│   ├── quoteController.js
│   ├── contactController.js
│   ├── teamController.js
│   ├── companyController.js
│   └── uploadController.js
├── utils/
│   ├── sendEmail.js
│   └── tokenUtils.js
├── seeds/
│   └── seed.js            # Initial data seeder
├── uploads/               # Uploaded images
├── .env
├── .env.example
├── server.js              # Entry point
└── package.json
```

### API Endpoints

#### Authentication — `/api/auth`

| Method | Endpoint            | Auth     | Description                    |
|--------|---------------------|----------|--------------------------------|
| POST   | `/register`         | None     | Register customer account      |
| POST   | `/login`            | None     | Login (returns JWT pair)       |
| POST   | `/logout`           | User     | Invalidate refresh token       |
| POST   | `/refresh`          | None     | Refresh access token           |
| GET    | `/profile`          | User     | Get current user profile       |
| PUT    | `/profile`          | User     | Update current user profile    |

**Register request body:**
```json
{
  "name": "string (required)",
  "email": "string (required, unique)",
  "phone": "string",
  "password": "string (required, min 8 chars)"
}
```

**Login request body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Login response:**
```json
{
  "user": { "id", "name", "email", "role" },
  "accessToken": "string (15min expiry)",
  "refreshToken": "string (7d expiry)"
}
```

#### Products — `/api/products`

| Method | Endpoint      | Auth   | Description                |
|--------|---------------|--------|----------------------------|
| GET    | `/`           | None   | List all products (with filters) |
| GET    | `/:id`        | None   | Get single product         |
| POST   | `/`           | Admin  | Create product             |
| PUT    | `/:id`        | Admin  | Update product             |
| DELETE | `/:id`        | Admin  | Delete product             |

**Query parameters (GET /):**
- `category` — Filter by category slug
- `search` — Search by name/description
- `page` / `limit` — Pagination (default: page=1, limit=20)

**Product request body:**
```json
{
  "name": "string (required)",
  "category": "ObjectId (required, ref: Category)",
  "description": "string (required)",
  "image": "string (URL or uploaded path)",
  "price": "number",
  "inStock": "boolean (default: true)",
  "featured": "boolean (default: false)",
  "specifications": "object (key-value pairs)"
}
```

#### Categories — `/api/categories`

| Method | Endpoint      | Auth   | Description            |
|--------|---------------|--------|------------------------|
| GET    | `/`           | None   | List all categories    |
| GET    | `/:id`        | None   | Get single category    |
| POST   | `/`           | Admin  | Create category        |
| PUT    | `/:id`        | Admin  | Update category        |
| DELETE | `/:id`        | Admin  | Delete category        |

**Category request body:**
```json
{
  "name": "string (required)",
  "slug": "string (auto-generated from name)",
  "description": "string",
  "image": "string",
  "icon": "string (emoji or icon identifier)",
  "order": "number (display order)"
}
```

#### Quotes — `/api/quotes`

| Method | Endpoint         | Auth   | Description                 |
|--------|------------------|--------|-----------------------------|
| POST   | `/`              | None   | Submit a quote request      |
| GET    | `/`              | Admin  | List all quotes (paginated) |
| GET    | `/:id`           | Admin  | Get single quote            |
| PUT    | `/:id/status`    | Admin  | Update quote status         |
| GET    | `/my`            | User   | Get current user's quotes   |

**Quote request body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (required)",
  "product": "string (required)",
  "message": "string"
}
```

**Quote statuses:** `new` | `reviewed` | `contacted` | `quoted` | `closed`

#### Contact Messages — `/api/contacts`

| Method | Endpoint         | Auth   | Description                   |
|--------|------------------|--------|-------------------------------|
| POST   | `/`              | None   | Submit contact message        |
| GET    | `/`              | Admin  | List all messages (paginated) |
| GET    | `/:id`           | Admin  | Get single message            |
| PUT    | `/:id/status`    | Admin  | Update message status         |

**Contact request body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string",
  "subject": "string (required)",
  "message": "string (required)"
}
```

**Contact statuses:** `new` | `read` | `replied` | `archived`

#### Team Members — `/api/team`

| Method | Endpoint      | Auth   | Description            |
|--------|---------------|--------|------------------------|
| GET    | `/`           | None   | List all team members  |
| POST   | `/`           | Admin  | Add team member        |
| PUT    | `/:id`        | Admin  | Update team member     |
| DELETE | `/:id`        | Admin  | Remove team member     |

**Team member request body:**
```json
{
  "name": "string (required)",
  "role": "string (required)",
  "image": "string",
  "bio": "string",
  "order": "number (display order)"
}
```

#### Company Info — `/api/company`

| Method | Endpoint      | Auth   | Description            |
|--------|---------------|--------|------------------------|
| GET    | `/`           | None   | Get company info       |
| PUT    | `/`           | Admin  | Update company info    |

**Company info body:**
```json
{
  "name": "string",
  "tagline": "string",
  "description": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "whatsapp": "string",
  "foundedYear": "number",
  "socialLinks": {
    "facebook": "string",
    "instagram": "string",
    "twitter": "string"
  },
  "businessHours": [
    { "day": "string", "time": "string" }
  ],
  "stats": {
    "products": "string",
    "clients": "string",
    "years": "string"
  }
}
```

#### File Upload — `/api/upload`

| Method | Endpoint      | Auth   | Description            |
|--------|---------------|--------|------------------------|
| POST   | `/`           | Admin  | Upload image file      |

**Request:** `multipart/form-data` with `image` field.

**Response:**
```json
{
  "url": "/uploads/filename.jpg",
  "filename": "string"
}
```

**Constraints:** Max 5MB, JPEG/PNG/WebP only.

### Middleware

| Middleware       | Purpose                                                  |
|------------------|----------------------------------------------------------|
| `auth`           | Verify JWT access token, attach `req.user`               |
| `admin`          | Check `req.user.role === 'admin'` (used after `auth`)    |
| `validate`       | Run `express-validator` checks, return 422 on errors     |
| `upload`         | Multer config for image uploads (disk storage)           |
| `rateLimiter`    | Rate limit: 100 req/15min general, 10 req/15min for auth |
| `errorHandler`   | Global error handler — formats error responses           |

### Error Response Format

```json
{
  "error": {
    "message": "Human-readable error description",
    "code": "VALIDATION_ERROR | AUTH_ERROR | NOT_FOUND | SERVER_ERROR",
    "details": []
  }
}
```

### Email Integration

Replace EmailJS with Nodemailer on the backend:

- **Quote submissions** — Send confirmation to customer, notification to admin
- **Contact form** — Send acknowledgment to sender, forward to admin
- **Admin notifications** — New quote/contact alerts

---

## Part 3: Database Schema (MongoDB / Mongoose)

### User

```javascript
{
  name:         { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true },
  phone:        { type: String, trim: true },
  password:     { type: String, required: true, minlength: 8 },  // bcrypt hashed
  role:         { type: String, enum: ['customer', 'admin'], default: 'customer' },
  refreshToken: { type: String },
  createdAt:    { type: Date, default: Date.now },
  updatedAt:    { type: Date, default: Date.now }
}
// Indexes: { email: 1 } (unique)
```

### Product

```javascript
{
  name:           { type: String, required: true, trim: true },
  category:       { type: ObjectId, ref: 'Category', required: true },
  description:    { type: String, required: true },
  image:          { type: String },  // URL or upload path
  price:          { type: Number },
  inStock:        { type: Boolean, default: true },
  featured:       { type: Boolean, default: false },
  specifications: { type: Map, of: String },  // flexible key-value
  createdAt:      { type: Date, default: Date.now },
  updatedAt:      { type: Date, default: Date.now }
}
// Indexes: { category: 1 }, { name: 'text', description: 'text' }
```

### Category

```javascript
{
  name:        { type: String, required: true, trim: true, unique: true },
  slug:        { type: String, required: true, unique: true },
  description: { type: String },
  image:       { type: String },
  icon:        { type: String },   // emoji or identifier
  order:       { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
}
// Indexes: { slug: 1 } (unique), { order: 1 }
```

### Quote

```javascript
{
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true },
  phone:     { type: String, required: true },
  product:   { type: String, required: true },
  message:   { type: String },
  status:    { type: String, enum: ['new','reviewed','contacted','quoted','closed'], default: 'new' },
  user:      { type: ObjectId, ref: 'User' },  // optional, if logged in
  notes:     { type: String },  // admin internal notes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
// Indexes: { status: 1 }, { createdAt: -1 }, { email: 1 }
```

### ContactMessage

```javascript
{
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, lowercase: true },
  phone:     { type: String },
  subject:   { type: String, required: true },
  message:   { type: String, required: true },
  status:    { type: String, enum: ['new','read','replied','archived'], default: 'new' },
  notes:     { type: String },  // admin internal notes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
// Indexes: { status: 1 }, { createdAt: -1 }
```

### TeamMember

```javascript
{
  name:      { type: String, required: true, trim: true },
  role:      { type: String, required: true },
  image:     { type: String },
  bio:       { type: String },
  order:     { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
// Indexes: { order: 1 }
```

### CompanyInfo

```javascript
{
  name:         { type: String, default: 'Coal City Jacuzzi & Plumbing Supplies' },
  tagline:      { type: String },
  description:  { type: String },
  address:      { type: String },
  phone:        { type: String },
  email:        { type: String },
  whatsapp:     { type: String },
  foundedYear:  { type: Number },
  socialLinks:  {
    facebook:  { type: String },
    instagram: { type: String },
    twitter:   { type: String }
  },
  businessHours: [{
    day:  { type: String },
    time: { type: String }
  }],
  stats: {
    products: { type: String },
    clients:  { type: String },
    years:    { type: String }
  },
  updatedAt: { type: Date, default: Date.now }
}
// Singleton document — only one record exists
```

### Relationships Diagram

```
User (1) ──── (many) Quote
Category (1) ──── (many) Product
CompanyInfo ──── singleton
TeamMember ──── standalone collection
ContactMessage ──── standalone collection
```
