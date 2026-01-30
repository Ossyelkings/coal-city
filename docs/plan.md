# Coal City Jacuzzi & Plumbing Supplies — Implementation Plan

## Phase 1: Project Setup

### 1.1 Initialize Express Server
- Create `server/` directory alongside existing `coal-city/src/`
- Run `npm init` inside `server/`
- Install dependencies:
  ```
  express mongoose dotenv cors helmet express-rate-limit
  express-validator bcryptjs jsonwebtoken multer nodemailer
  ```
- Install dev dependencies: `nodemon`
- Create `server.js` entry point with Express app
- Add scripts: `"dev": "nodemon server.js"`, `"start": "node server.js"`

### 1.2 Configure MongoDB
- Create `server/config/db.js` — Mongoose connection with retry logic
- Set up `.env` with `MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`
- Create `.env.example` as a template (no secrets)
- Add `.env` to `.gitignore`

### 1.3 Set Up Middleware Stack
- CORS (allow frontend origin)
- `express.json()` body parser
- Helmet for security headers
- Rate limiter (general + auth-specific)
- Global error handler in `server/middleware/errorHandler.js`
- Static file serving for `/uploads`

### 1.4 Folder Structure
- Create all directories: `config/`, `middleware/`, `models/`, `routes/`, `controllers/`, `utils/`, `seeds/`, `uploads/`

**Deliverable:** Express server starts on `PORT`, connects to MongoDB, responds to health check at `GET /api/health`.

---

## Phase 2: Database Models & Seed Data

### 2.1 Create Mongoose Models
- `models/User.js` — with pre-save hook for password hashing
- `models/Product.js` — with text index on name + description
- `models/Category.js` — with pre-save slug generation
- `models/Quote.js` — with timestamps
- `models/ContactMessage.js` — with timestamps
- `models/TeamMember.js` — with order field
- `models/CompanyInfo.js` — singleton pattern (findOne or create)

### 2.2 Create Seed Script
- `seeds/seed.js` — populates database with existing hardcoded data:
  - 6 categories (from Home.js `categories` array)
  - 18 products (from Gallery.js `products` array)
  - 4 team members (from About.js `team` array)
  - 1 company info document (from Contact.js and Footer.js data)
  - 1 admin user (default credentials, to be changed on first login)
- Add script: `"seed": "node seeds/seed.js"`
- Seed script should be idempotent (clear + re-insert)

**Deliverable:** Running `npm run seed` populates all collections. Data matches existing frontend hardcoded data.

---

## Phase 3: Authentication System

### 3.1 Auth Utilities
- `utils/tokenUtils.js` — Generate access token (15min) and refresh token (7d)
- Password hashing in User model pre-save hook (bcrypt, 12 rounds)
- `User.comparePassword()` instance method

### 3.2 Auth Middleware
- `middleware/auth.js` — Verify JWT from `Authorization: Bearer <token>`, attach `req.user`
- `middleware/admin.js` — Check `req.user.role === 'admin'`, return 403 if not

### 3.3 Auth Routes & Controller
- `POST /api/auth/register` — Create customer account, return tokens
- `POST /api/auth/login` — Validate credentials, return tokens
- `POST /api/auth/logout` — Clear refresh token
- `POST /api/auth/refresh` — Issue new access token from valid refresh token
- `GET /api/auth/profile` — Return current user (auth required)
- `PUT /api/auth/profile` — Update name, email, phone (auth required)

### 3.4 Validation Rules
- Registration: name required, valid email, password min 8 chars
- Login: email + password required
- Profile update: valid email if provided

**Deliverable:** Auth endpoints work. Admin can log in. Customers can register/login. JWT flow is functional.

---

## Phase 4: API Endpoints (CRUD)

### 4.1 Products API
- `routes/products.js` + `controllers/productController.js`
- Public: list (with category filter, search, pagination), get by ID
- Admin: create, update, delete
- Populate category reference on read

### 4.2 Categories API
- `routes/categories.js` + `controllers/categoryController.js`
- Public: list all, get by ID/slug
- Admin: create, update, delete
- Auto-generate slug from name

### 4.3 Quotes API
- `routes/quotes.js` + `controllers/quoteController.js`
- Public: submit quote (with email notification)
- Admin: list all (paginated, filterable by status), get by ID, update status
- User: list own quotes (`GET /api/quotes/my`)

### 4.4 Contact Messages API
- `routes/contacts.js` + `controllers/contactController.js`
- Public: submit message (with email notification)
- Admin: list all (paginated, filterable by status), get by ID, update status

### 4.5 Team API
- `routes/team.js` + `controllers/teamController.js`
- Public: list all (ordered by `order` field)
- Admin: create, update, delete

### 4.6 Company Info API
- `routes/company.js` + `controllers/companyController.js`
- Public: get company info
- Admin: update company info

### 4.7 File Upload API
- `routes/upload.js` + `controllers/uploadController.js`
- Admin only: upload image via multer
- Validate file type (JPEG, PNG, WebP) and size (max 5MB)
- Return URL path to uploaded file

### 4.8 Email Utility
- `utils/sendEmail.js` — Nodemailer transporter configured from env vars
- Send notification emails on quote/contact submissions
- Send confirmation emails to customers

**Deliverable:** All CRUD endpoints functional. Tested with API client (Postman/Insomnia).

---

## Phase 5: Frontend Integration

### 5.1 API Client Setup
- Create `src/services/api.js` — Axios instance with base URL, interceptors for auth tokens
- Token refresh interceptor: auto-refresh expired access tokens
- Create service modules:
  - `src/services/productService.js`
  - `src/services/categoryService.js`
  - `src/services/quoteService.js`
  - `src/services/contactService.js`
  - `src/services/teamService.js`
  - `src/services/companyService.js`
  - `src/services/authService.js`

### 5.2 Replace Hardcoded Data
- **Home.js:** Fetch categories from API, fetch company stats from company info
- **Gallery.js:** Fetch products and categories from API, filter client-side or via API query
- **About.js:** Fetch team members and company info from API
- **Contact.js:** Submit form to `/api/contacts` instead of EmailJS, fetch company info for display
- **Footer.js:** Fetch company info for contact details and social links

### 5.3 Update Quote Modal
- Submit to `/api/quotes` instead of EmailJS
- If user is logged in, pre-fill name/email/phone from profile
- Associate quote with user account if logged in

### 5.4 Add Loading & Error States
- Loading skeletons for data-fetching sections
- Error boundaries / error messages for failed API calls
- Retry logic for transient failures

### 5.5 Install Axios
- `npm install axios` in the frontend

**Deliverable:** Frontend renders data from API. No hardcoded data remains. Forms submit to backend.

---

## Phase 6: Admin Dashboard

### 6.1 Admin Layout
- Create `src/components/admin/AdminLayout.js` — sidebar + content area
- Sidebar navigation: Dashboard, Products, Categories, Quotes, Contacts, Team, Settings
- Responsive: collapsible sidebar on mobile
- Style consistent with design system (navy + gold theme)

### 6.2 Dashboard Overview Page
- `src/pages/admin/Dashboard.js`
- Stats cards: total products, new quotes (today/week), new contacts, total users
- Recent quotes list (latest 5)
- Recent contacts list (latest 5)

### 6.3 Products Management
- `src/pages/admin/Products.js` — table with search, category filter, pagination
- `src/pages/admin/ProductForm.js` — create/edit form with image upload
- Delete confirmation modal

### 6.4 Categories Management
- `src/pages/admin/Categories.js` — list with drag-to-reorder (or order field)
- `src/pages/admin/CategoryForm.js` — create/edit form

### 6.5 Quote Management
- `src/pages/admin/Quotes.js` — table with status filter, date sort
- Status update dropdown (new → reviewed → contacted → quoted → closed)
- Expandable row to view full details + add admin notes

### 6.6 Contact Management
- `src/pages/admin/Contacts.js` — table with status filter
- Status update (new → read → replied → archived)
- View message detail + admin notes

### 6.7 Team Management
- `src/pages/admin/Team.js` — card grid with add/edit/delete
- Image upload for team member photos

### 6.8 Company Settings
- `src/pages/admin/Settings.js` — form to edit company info
- Sections: general info, contact details, social links, business hours, stats

**Deliverable:** Admin can manage all resources through the dashboard. Protected behind admin auth.

---

## Phase 7: Customer Authentication

### 7.1 Auth Context
- Create `src/context/AuthContext.js` — React context for auth state
- Provider wraps the app, exposes: `user`, `login()`, `logout()`, `register()`, `isAdmin`
- Persist token in `localStorage`, validate on app load

### 7.2 Auth Pages
- `src/pages/Login.js` — email/password form, link to register
- `src/pages/Register.js` — name/email/phone/password form, link to login
- Style consistent with existing design system

### 7.3 Protected Routes
- Create `src/components/ProtectedRoute.js` — redirect to login if not authenticated
- Create `src/components/AdminRoute.js` — redirect to home if not admin
- Wrap admin routes with AdminRoute
- Wrap profile route with ProtectedRoute

### 7.4 Customer Profile
- `src/pages/Profile.js` — view/edit name, email, phone
- Quote history: list of submitted quotes with statuses
- Change password form

### 7.5 Navbar Updates
- Show Login/Register links when logged out
- Show user name + dropdown (Profile, Logout) when logged in
- Show Admin Dashboard link for admin users

**Deliverable:** Customers can register, login, view profile and quote history. Admins see admin link in nav.

---

## Phase 8: Testing & Deployment

### 8.1 Backend Testing
- Unit tests for models (validation, methods)
- Integration tests for API endpoints (using supertest + in-memory MongoDB)
- Auth flow tests (register, login, refresh, protected routes)
- Test seed script

### 8.2 Frontend Testing
- Component tests for key components (React Testing Library)
- Integration tests for auth flow
- Form submission tests

### 8.3 Security Hardening
- Input sanitization (prevent NoSQL injection)
- XSS protection (helmet, input escaping)
- CSRF considerations for non-SPA clients
- Rate limiting on auth endpoints
- Secure cookie options for tokens (if using cookies)
- File upload validation (type, size, malware scanning consideration)

### 8.4 Deployment Preparation
- Environment-specific configs (development, production)
- Build frontend: `npm run build`
- Serve frontend build from Express in production (or separate hosting)
- MongoDB Atlas for production database
- Configure domain, SSL/TLS
- Set up PM2 or similar process manager
- Configure CORS for production domain

### 8.5 Post-Deployment
- Create initial admin account via seed script or registration endpoint
- Verify all endpoints work in production
- Monitor error logs
- Set up database backups

**Deliverable:** Application deployed and running in production with all features functional.

---

## Phase Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (Models & Seeds)
        └── Phase 3 (Auth)
              └── Phase 4 (API Endpoints)
                    ├── Phase 5 (Frontend Integration)
                    │     └── Phase 7 (Customer Auth)
                    └── Phase 6 (Admin Dashboard)
                          └── Phase 7 (Customer Auth)
                                └── Phase 8 (Testing & Deployment)
```

Each phase builds on the previous. Phases 5 and 6 can be worked on in parallel once Phase 4 is complete.
