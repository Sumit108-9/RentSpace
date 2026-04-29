# Furniture Rental API Documentation

## Updated Features
- **Date-based rental system** (replaced rental_months with start_date/end_date)
- **EMI/Installment payment system** (Full vs Installment payment types)

## Order Management API

### POST /api/orders - Create Order
**Request Body:**
```json
{
  "orderItems": [
    {
      "productId": "69d60d123f99fda7c74cce99",
      "quantity": 1
    }
  ],
  "shippingAddress": {
    "street": "123 Test Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India"
  },
  "contactInfo": {
    "name": "Sumit",
    "email": "sumit@gmail.com",
    "phone": "9876543210"
  },
  "paymentMethod": "card",
  "paymentType": "Installment",
  "rentalStartDate": "2026-04-08T00:00:00.000Z",
  "rentalEndDate": "2026-10-08T00:00:00.000Z",
  "couponCode": "RENT10"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "69d62782c92109e100a9ed8f",
    "user": "69d6257fec6d91238c05a92c",
    "orderItems": [
      {
        "product": "69d60d123f99fda7c74cce99",
        "name": "Premium Leather Sofa - 3 Seater",
        "image": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
        "monthlyRent": 1299,
        "rentalDuration": 6,
        "quantity": 1,
        "startDate": "2026-04-08T00:00:00.000Z",
        "endDate": "2026-10-08T00:00:00.000Z"
      }
    ],
    "paymentType": "Installment",
    "rentalStatus": "Active",
    "totalAmount": 12990,
    "createdAt": "2026-04-08T10:30:00.000Z"
  }
}
```

### GET /api/orders/:id - Get Order by ID
**Response:**
```json
{
  "success": true,
  "order": {
    "_id": "69d62782c92109e100a9ed8f",
    "paymentType": "Installment",
    "rentalStatus": "Active",
    "rentalStartDate": "2026-04-08T00:00:00.000Z",
    "rentalEndDate": "2026-10-08T00:00:00.000Z",
    "totalAmount": 12990
  },
  "installments": [
    {
      "_id": "69d62782c92109e100a9ed90",
      "installmentNumber": 1,
      "amount": 4330,
      "dueDate": "2026-05-08T00:00:00.000Z",
      "status": "Pending"
    },
    {
      "_id": "69d62782c92109e100a9ed91",
      "installmentNumber": 2,
      "amount": 4330,
      "dueDate": "2026-06-08T00:00:00.000Z",
      "status": "Pending"
    },
    {
      "_id": "69d62782c92109e100a9ed92",
      "installmentNumber": 3,
      "amount": 4330,
      "dueDate": "2026-07-08T00:00:00.000Z",
      "status": "Pending"
    }
  ]
}
```

### GET /api/orders/user/:userId - Get Orders by User
**Query Parameters:** `page`, `limit`, `status`, `paymentType`

**Response:**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "69d62782c92109e100a9ed8f",
      "paymentType": "Installment",
      "rentalStatus": "Active",
      "totalAmount": 12990,
      "orderStatus": "pending",
      "createdAt": "2026-04-08T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

## Installment Management API

### GET /api/installments/order/:orderId - Get Installments for Order
**Response:**
```json
{
  "success": true,
  "installments": [
    {
      "_id": "69d62782c92109e100a9ed90",
      "installmentNumber": 1,
      "amount": 4330,
      "dueDate": "2026-05-08T00:00:00.000Z",
      "status": "Pending",
      "createdAt": "2026-04-08T10:30:00.000Z"
    }
  ]
}
```

### GET /api/installments/user/:userId - Get User's Pending Installments
**Response:**
```json
{
  "success": true,
  "installments": [
    {
      "_id": "69d62782c92109e100a9ed90",
      "installmentNumber": 1,
      "amount": 4330,
      "dueDate": "2026-05-08T00:00:00.000Z",
      "status": "Pending",
      "order": {
        "_id": "69d62782c92109e100a9ed8f",
        "totalAmount": 12990,
        "orderStatus": "pending"
      }
    }
  ]
}
```

### PUT /api/installments/pay/:installmentId - Pay Installment
**Request Body:**
```json
{
  "paymentMethod": "card",
  "paymentId": "pay_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Installment paid successfully",
  "installment": {
    "_id": "69d62782c92109e100a9ed90",
    "installmentNumber": 1,
    "amount": 4330,
    "dueDate": "2026-05-08T00:00:00.000Z",
    "status": "Paid",
    "paidDate": "2026-04-08T10:35:00.000Z",
    "paymentMethod": "card",
    "paymentId": "pay_123456789"
  }
}
```

### GET /api/installments/stats - Get Installment Statistics (Admin Only)
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalInstallments": 3,
    "pendingInstallments": 2,
    "paidInstallments": 1,
    "overdueInstallments": 0,
    "totalPendingAmount": 8660
  }
}
```

## Business Logic

### Date Calculations
- **Rental Duration**: Calculated from start_date to end_date (in months)
- **Validation**: 
  - End date must be after start date
  - Start date cannot be in the past
  - Maximum rental period: 24 months

### EMI Payment System
- **Installments**: Split into 3 equal parts by default
- **Due Dates**: Monthly from rental start date
- **Status Tracking**: Pending, Paid, Overdue
- **Auto-overdue**: Installments automatically marked as overdue if past due date

### Payment Types
- **Full**: Complete payment upfront, no installments created
- **Installment**: Payment split into 3 monthly installments

## Frontend Integration

### Checkout Page Updates
```javascript
// Replace rental_months input with date pickers
const [rentalStartDate, setRentalStartDate] = useState('');
const [rentalEndDate, setRentalEndDate] = useState('');
const [paymentType, setPaymentType] = useState('Full');

// Order creation request
const orderData = {
  orderItems: cartItems,
  shippingAddress,
  contactInfo,
  paymentMethod,
  paymentType, // 'Full' or 'Installment'
  rentalStartDate,
  rentalEndDate
};
```

### Order Summary Display
```javascript
// Show rental duration and payment breakdown
const rentalMonths = calculateMonthsBetween(startDate, endDate);
const emiAmount = paymentType === 'Installment' ? totalAmount / 3 : 0;
```

### Installments UI
```javascript
// Display installment list with Pay Now buttons
installments.map(installment => (
  <div key={installment._id}>
    <span>Installment {installment.installmentNumber}</span>
    <span>Amount: {installment.amount}</span>
    <span>Due: {formatDate(installment.dueDate)}</span>
    <span>Status: {installment.status}</span>
    {installment.status === 'Pending' && (
      <button onClick={() => payInstallment(installment._id)}>
        Pay Now
      </button>
    )}
  </div>
))
```

## Database Schema Changes

### Order Model Updates
```javascript
// Added fields
startDate: Date,
endDate: Date,
paymentType: String, // 'Full' or 'Installment'
rentalStatus: String, // 'Active', 'Completed', 'Cancelled'
```

### New Installment Model
```javascript
{
  order: ObjectId,
  installmentNumber: Number,
  amount: Number,
  dueDate: Date,
  status: String, // 'Pending', 'Paid', 'Overdue'
  paidDate: Date,
  paymentMethod: String,
  paymentId: String
}
```

## Error Handling
All endpoints include comprehensive error handling:
- Validation errors return 400 with detailed messages
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500 with error details (development mode only)

## Security
- All endpoints require authentication
- Users can only access their own data (admin has full access)
- Input validation on all endpoints
- Passwords are hashed using bcrypt
