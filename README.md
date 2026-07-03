# 🌾 AgriRent Pro

A full-stack agricultural equipment rental platform that connects **farmers** with **equipment owners**, making it easy to rent machinery such as tractors, harvesters, rotavators, and seed drills.

The platform helps farmers access affordable equipment while allowing owners to earn additional income by renting out idle machinery.

---

# 🚀 Features

## 👨‍🌾 Farmer

* Register & Login
* Browse available equipment
* Search and filter by category, location, and price
* View equipment details
* Book equipment
* Track booking status
* Cancel bookings
* View booking history
* Rate and review equipment

## 🚜 Equipment Owner

* Register & Login
* Add new equipment
* Upload equipment images
* Edit or delete listings
* View booking requests
* Approve or reject bookings
* Manage equipment availability
* View earnings dashboard

## 👨‍💼 Admin

* Manage users
* Manage equipment
* Manage bookings
* Monitor platform activity
* View analytics
* Generate reports

---

# 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

### Backend

* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* bcrypt

### Database

* PostgreSQL

### Image Storage

* Cloudinary

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: Neon PostgreSQL

---

# 📂 Project Structure

```text
AgriRent-Pro/
│
├── backend/
│   ├── app/
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── main.py
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── App.jsx
│
├── database/
│
└── README.md
```

---

# 🗄 Database Tables

* Users
* Equipment
* Bookings
* Payments
* Reviews

---

# 🔄 Application Workflow

```text
Owner Registers
      │
      ▼
Adds Equipment
      │
      ▼
Equipment Available
      │
      ▼
Farmer Searches Equipment
      │
      ▼
Farmer Books Equipment
      │
      ▼
Owner Approves Booking
      │
      ▼
Payment Completed
      │
      ▼
Equipment Delivered
      │
      ▼
Equipment Returned
      │
      ▼
Review & Rating
```

---

# 🔐 Authentication

* JWT Authentication
* Password Hashing using bcrypt
* Role-Based Access Control (RBAC)

Roles:

* Farmer
* Equipment Owner
* Admin

---

# 📡 REST API

### Authentication

```
POST /auth/register
POST /auth/login
```

### Equipment

```
GET    /equipment
GET    /equipment/{id}
POST   /equipment
PUT    /equipment/{id}
DELETE /equipment/{id}
```

### Bookings

```
POST   /bookings
GET    /bookings
PUT    /bookings/{id}
DELETE /bookings/{id}
```

### Payments

```
POST   /payments
GET    /payments
```

### Reviews

```
POST   /reviews
GET    /reviews
```

### Admin

```
GET /admin/dashboard
GET /admin/reports
```

---

# ⭐ Future Enhancements

* AI equipment recommendations
* Weather forecast integration
* Google Maps location support
* Live availability calendar
* Real-time notifications
* Online payment gateway
* PDF invoice generation
* Maintenance reminders
* Equipment insurance module
* Mobile application

---

# 📸 Screenshots

Add screenshots here after completing the project.

```
Home Page

Equipment Listing

Equipment Details

Farmer Dashboard

Owner Dashboard

Admin Dashboard
```

---

# 🤝 Contributing

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Rohit**

Backend Developer | FastAPI | React | PostgreSQL

GitHub: https://github.com/your-username
