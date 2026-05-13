# EduCADD Backend API Documentation

## Authentication Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "fullName": "John Doe",
  "phoneNumber": "9876543210"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "data": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "John Doe",
    "role": "student"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

When SMTP is configured, every successful registration also sends a notification email to `mk.consultants13@gmail.com` or the address configured in `PRIMARY_CONTACT_EMAIL`.

---

### 2. Login User
**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "John Doe",
    "role": "student"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get User Profile
**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response (200):**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "John Doe",
    "phoneNumber": "9876543210",
    "role": "student",
    "isActive": true,
    "createdAt": "2024-04-24T10:00:00.000Z",
    "updatedAt": "2024-04-24T10:00:00.000Z"
  }
}
```

---

### 4. Update User Profile
**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "9876543210"
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": "uuid",
    "email": "student@example.com",
    "fullName": "Jane Doe",
    "phoneNumber": "9876543210",
    "role": "student"
  }
}
```

---

### 5. Change Password
**POST** `/api/auth/change-password`

**Headers:**
```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Request Body:**
```json
{
  "oldPassword": "securePassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

---

## Leads Endpoints

### 1. Create Lead
**POST** `/api/leads`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "9876543210",
  "email": "john@example.com",
  "selectedCourse": "Mechanical CAD"
}
```

**Response (201):**
```json
{
  "message": "Lead created successfully",
  "data": {
    "id": "uuid",
    "fullName": "John Doe",
    "phoneNumber": "9876543210",
    "email": "john@example.com",
    "selectedCourse": "Mechanical CAD",
    "status": "New"
  }
}
```

When SMTP is configured, every new lead also sends a notification email to `mk.consultants13@gmail.com` or the address configured in `PRIMARY_CONTACT_EMAIL`.

---

### 2. Get All Leads
**GET** `/api/leads`

**Response (200):**
```json
{
  "count": 10,
  "data": [...]
}
```

---

### 3. Get Lead by ID
**GET** `/api/leads/:id`

**Response (200):**
```json
{
  "data": {...}
}
```

---

### 4. Update Lead
**PUT** `/api/leads/:id`

**Request Body:**
```json
{
  "status": "Interested"
}
```

**Response (200):**
```json
{
  "message": "Lead updated successfully",
  "data": {...}
}
```

---

### 5. Delete Lead
**DELETE** `/api/leads/:id`

**Response (200):**
```json
{
  "message": "Lead deleted successfully",
  "data": {...}
}
```

---

### 6. Filter Leads by Status
**GET** `/api/leads/filter/status/:status`

**Response (200):**
```json
{
  "count": 5,
  "data": [...]
}
```

---

### 7. Filter Leads by Course
**GET** `/api/leads/filter/course/:course`

**Response (200):**
```json
{
  "count": 3,
  "data": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication failed",
  "message": "Invalid email or password"
}
```

### 409 Conflict
```json
{
  "error": "User already exists",
  "message": "An account with this email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Registration failed",
  "message": "Error details"
}
```

---

## How to Use JWT Token

1. **Register or Login** to get an `accessToken`
2. **Include the token** in the Authorization header as:
   ```
   Authorization: Bearer <accessToken>
   ```
3. **The token expires** in 7 days by default (set by `JWT_EXPIRE`)
4. **Get a new token** by logging in again

---

## Security Notes

- Passwords are hashed using **bcrypt** with 10 salt rounds
- JWT tokens are signed with a secret key in `.env`
- Never expose `JWT_SECRET` in public repositories
- Use HTTPS in production
- Implement rate limiting for auth endpoints in production
