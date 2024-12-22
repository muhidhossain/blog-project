## Instructions to Run the Project Locally

### Clone the Project

```
git clone https://github.com/muhidhossain/blog-project.git
```

### Navigate to the Project Directory

```
cd blog-project
```

### Install Dependencies

```
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```
NODE_ENV=development
PORT=5005
DATABASE_URL=mongodb+srv://<userName>:<password>@cluster0.nutr3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
BCRYPT_SALT_ROUNDS=<rounds>
JWT_ACCESS_SECRET=<secret>
JWT_REFRESH_SECRET=<secret>
JWT_ACCESS_EXPIRES_IN=<duration>
JWT_REFRESH_EXPIRES_IN=<duration>

```

### Run the Project

Use the following commands to run the project:

- To run the project in development mode:

  ```
  npm run start:dev
  ```

- To build the project for production:

  ```
  npm run build
  ```

- To run the production server:
  ```
  npm run start
  ```

## Product Routes

```
Base URL: http://localhost:<PORT>/api
```
