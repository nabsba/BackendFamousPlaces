# Famous Place

**Famous Place** is an application that allows users to explore various famous places around the world. The platform provides a comprehensive guide to locations, offering detailed descriptions and useful information for each place. The backend supports both a Flutter mobile application and a React web application, ensuring a seamless and responsive user experience.

## Features

### 1. **Explore Famous Places**
   - Users can browse a collection of popular and iconic places from around the world.
   - For each place, detailed descriptions, images, and additional information are available.
   - Users can filter and search for places based on location, popularity, or name.

### 2. **Responsive Frontend**
   - **Flutter** is used to build the mobile application for a rich user experience on both Android and iOS platforms.
   - **React** is used for the web application, ensuring a responsive interface for desktop and mobile browsers.

### 3. **Backend API**
   - A robust backend is built with **Node.js** serving the frontend applications.
   - The API handles CRUD operations on places, including adding new locations, updating information, and deleting entries.

### 4. **User Authentication**
   - Users can securely sign in using **JWT (JSON Web Token)** authentication.
   - The system provides token-based authentication for both the mobile and web applications.

### 5. **Database Integration**
   - **PostgreSQL** is used as the primary relational database for storing data about famous places.
   - **Prisma ORM** is utilized for efficient database queries and schema management.

### 6. **Technologies Used**
   - **Frontend:**
     - **Flutter** for mobile development (cross-platform).
     - **React** for web development (with responsive design).
   - **Backend:**
     - **Node.js** for building the backend server.
     - **JWT** for secure authentication and session management.
     - **Prisma ORM** for interacting with PostgreSQL.
   - **Database:**
     - **PostgreSQL** for storing information about places, including location, descriptions, images, and more.
   - **Storage:**
     - **firebase** to store buckets and database.
   - **Tools:**
     - **TypeScript** for type safety and maintaining clean code.
     - **Linter** for ensuring code quality and enforcing consistent code style.

### 7. **User-Friendly Interface**
   - Simple and clean UI for both mobile and web applications.
   - Easy navigation for users to explore famous places and read about them.

### 8. **Security**
   - Secure user authentication with **JWT** to protect user data.
   - Role-based access to manage and display places based on user permissions.

## Installation

### Backend (Node.js)

1. **Needs**:

- **Firebase**: storage for retrieving images + instalation
- **Postgres**: local database "famous_place"

2. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repository/famous-place-backend.git
   cd famous-place-backend

3. **Init**:

- **.env**: create ".env" at the the root directory with the following variable
```PORT=4000
DATABASE_DEV="postgres://YourName:PASSWORD.@localhost:5432/famous_place"
JWT_SECRET_KEY=********************************=  // generate yours
NEXT_PUBLIC_DEVELOPMENT=true
```
- **Prisma**: 

```
yarn prismaInit
```

- **Run app**: 
```
yarn devts
```
 

