# BeautyStore

E-commerce Backend

## Description

This is the backend service for an e-commerce application built with TypeScript. It provides various functionalities such as user management, product management, order processing, and more.

## Installation Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd ecommerce/backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To start the server, run:
```bash
npm start
```

## API Endpoints

### User Module
- **Register User**: `POST /api/users/register`
- **Login User**: `POST /api/users/login`
- **Get User Profile**: `GET /api/users/profile`

### Product Module
- **Get All Products**: `GET /api/products`
- **Get Product by ID**: `GET /api/products/:id`
- **Create Product**: `POST /api/products`

### Order Module
- **Create Order**: `POST /api/orders`
- **Get Order by ID**: `GET /api/orders/:id`

### Banner Module
- **Get All Banners**: `GET /api/banners`
- **Create Banner**: `POST /api/banners`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## File Structure

```
ecommerce/
├── backend/
│   ├── .gitignore
│   ├── eslint.config.mjs
│   ├── package-lock.json
│   ├── package.json
│   ├── prettierrc.json
│   ├── readme.md
│   ├── tsconfig.json
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── config/
│   │   │   └── index.ts
│   │   ├── error/
│   │   │   ├── appError.ts
│   │   │   └── mailError.ts
│   │   ├── interface/
│   │   │   ├── errorInterface.ts
│   │   │   └── sharedInterface.ts
│   │   ├── middleware/
│   │   │   ├── globalErrorHandler.ts
│   │   │   └── notFound.ts
│   │   ├── module/
│   │   │   ├── address/
│   │   │   │   ├── address.interface.ts
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.services.ts
│   │   │   │   └── user.validation.ts
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.route.ts
│   │   │   │   └── auth.services.ts
│   │   │   ├── banner/
│   │   │   │   ├── banner.controller.ts
│   │   │   │   ├── banner.interface.ts
│   │   │   │   ├── banner.model.ts
│   │   │   │   ├── banner.route.ts
│   │   │   │   ├── banner.services.ts
│   │   │   │   └── banner.validation.ts
│   │   │   ├── order/
│   │   │   │   ├── order.controller.ts
│   │   │   │   ├── order.interface.ts
│   │   │   │   ├── order.model.ts
│   │   │   │   ├── order.route.ts
│   │   │   │   ├── order.services.ts
│   │   │   │   └── order.validation.ts
│   │   │   ├── product/
│   │   │   │   ├── product.controller.ts
│   │   │   │   ├── product.interface.ts
│   │   │   │   ├── product.model.ts
│   │   │   │   ├── product.route.ts
│   │   │   │   ├── product.services.ts
│   │   │   │   └── product.validation.ts
│   │   │   ├── user/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.interface.ts
│   │   │   │   ├── user.model.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.services.ts
│   │   │   │   ├── user.validation.ts
│   │   │   │   └── user.zod.validation.ts
│   │   │   ├── router/
│   │   │   │   └── index.ts
│   │   │   └── utils/
│   │   │       ├── catchAsync.ts
│   │   │       ├── generateOtp.ts
│   │   │       ├── generateToken.ts
│   │   │       ├── getEnvVar.ts
│   │   │       └── sendEmail.ts
└── ...
```

## License

This project is licensed under the MIT License.
