Reddit Backend Project

This project is a simple backend for a Reddit-like application. It uses Node.js, Express, and PostgreSQL to manage users, subreddits, and threads.

How to Install Dependencies

To install all the required dependencies, run the following command in the project directory: npm install

This will install all the necessary Node.js modules, such as express, pg, and others.

How to Run the Server

To run the server, use the following command: node index.js

The server will start and listen on port 3000 by default. You can access the API at:http://localhost:3000

How to Configure PostgreSQL Credentials

To connect the application to your PostgreSQL database, update the database configuration in the code. 

Look for the following section in your index.js or database configuration file:

const pool = new Pool({

  user: 'postgres',       // PostgreSQL username
  host: 'localhost',      // Database host
  database: 'my_reddit_db', // Database name
  password: 'your_password', // PostgreSQL password
  port: 5432,             // PostgreSQL port (default is 5432)
});

How to Run the Seed Script

To populate the database with sample data (users, subreddits, and threads), run the seed script:

1)Ensure your PostgreSQL database is running and the credentials are correctly configured.

2)Run the following command: node seed.js

This script will:

-Delete existing data from the users, subreddits, and threads tables (if any).
-Insert sample users, subreddits, and threads.
-Update user subscriptions for demonstration purposes.
-After running the script, you can verify the data in your database using a PostgreSQL client (e.g., psql or pgAdmin).

Testing the API

Once the server is running and the database is seeded, you can test the API endpoints using tools like Postman or cURL. Here are some example endpoints:

GET /users – Retrieve all users.

GET /subreddits – Retrieve all subreddits.

POST /threads – Create a new thread.

PUT /users/:user_id – Update a user's information.

DELETE /subreddits/:subreddit_id – Delete a subreddit.
