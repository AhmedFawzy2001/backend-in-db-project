// const express = require("express")
// const app = express()

// require('dotenv').config()

// app.use(express.json())


// const bookRouter = require('./routes/book.router')

// app.use("/api/v1/books", bookRouter)

// app.listen(process.env.PORT, () => console.log("Server is running on port 5000"))

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Database connection pool
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL + "?sslmode=require",
  })
  
  pool.connect((err) => {
      if (err) throw err
      console.log("Connect to PostgreSQL successfully!")
  })
  
// User Registration API
// app.post('/register', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert user data into the database
//         const query = `
//             INSERT INTO users (username, email, password)
//             VALUES ($1, $2, $3)
//             RETURNING id, username, email;
//         `;
//         const { rows } = await pool.query(query, [username, email, hashedPassword]);

//         res.status(201).json(rows[0]);
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });

// // User Login API
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Retrieve user from the database
//         const query = `
//             SELECT * FROM users
//             WHERE username = $1;
//         `;
//         const { rows } = await pool.query(query, [username]);
//         const user = rows[0];

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Compare hashed password with provided password
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }

//         res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });


// User Registration API
// app.post('/register', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert user data into the database
//         const query = `
//             INSERT INTO users (username, email, password)
//             VALUES ($1, $2, $3)
//             RETURNING id, username, email;
//         `;
//         const { rows } = await pool.query(query, [username, email, hashedPassword]);

//         const newUser = rows[0];
//         res.status(201).json({ user: newUser });
//     } catch (error) {
//         console.error('Error during registration:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });

// // User Login API
// app.post('/login', async (req, res) => {
//     try {
//         const { username, password } = req.body;

//         // Retrieve user from the database
//         const query = `
//             SELECT * FROM users
//             WHERE username = $1;
//         `;
//         const { rows } = await pool.query(query, [username]);
//         const user = rows[0];

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Compare hashed password with provided password
//         const passwordMatch = await bcrypt.compare(password, user.password);

//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }

//         res.status(200).json({ user: { id: user.id, username: user.username, email: user.email } });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ error: 'An internal server error occurred' });
//     }
// });


// User Registration API
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if email already exists
        const emailExistsQuery = `
            SELECT * FROM users
            WHERE email = $1;
        `;
        const emailExistsResult = await pool.query(emailExistsQuery, [email]);

        if (emailExistsResult.rows.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into the database
        const insertQuery = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, username, email;
        `;
        const { rows } = await pool.query(insertQuery, [username, email, hashedPassword]);

        const newUser = rows[0];
        res.status(201).json({ message: 'Registration successful', user: newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

// User Login API
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Retrieve user from the database
        const query = `
            SELECT * FROM users
            WHERE email = $1;
        `;
        const { rows } = await pool.query(query, [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare hashed password with provided password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);0
});

