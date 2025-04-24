require('dotenv').config();
const express = require('express');
const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

app.use(express.json());

// Helper function to authenticate user using JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).send('Access Denied');
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
};

// Route for user registration
app.post('/register', async (req, res) => {
    const { email, password, name, language } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await drizzle
            .table('users')
            .insert({ email, password: hashedPassword, name, language });
        res.status(201).send(result);
    } catch (error) {
        res.status(400).send('Error in registration');
    }
});

// Route for user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await drizzle
            .table('users')
            .select('*')
            .where('email', '=', email)
            .first();
        if (!user) return res.status(400).send('User not found');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials');
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
        res.status(200).send({ token });
    } catch (error) {
        res.status(400).send('Error in login');
    }
});

// Route to create a new group
app.post('/groups', authenticateToken, async (req, res) => {
    const { restaurant_id, time, expected_members, food_preference, spoken_language, budget } = req.body;
    try {
        const group = await drizzle
            .table('groups')
            .insert({
                creator_id: req.user.id,
                restaurant_id,
                time,
                expected_members,
                food_preference,
                spoken_language,
                budget,
                status: 'ongoing'
            });
        res.status(201).send(group);
    } catch (error) {
        res.status(400).send('Error in creating group');
    }
});

// Route to join a group
app.post('/groups/:groupId/join', authenticateToken, async (req, res) => {
    const groupId = req.params.groupId;
    try {
        const group = await drizzle
            .table('groups')
            .select('*')
            .where('id', '=', groupId)
            .first();
        if (!group) return res.status(404).send('Group not found');
        // Logic to join group (e.g., update member list)
        res.status(200).send('Joined group');
    } catch (error) {
        res.status(400).send('Error joining group');
    }
});

// Route to get restaurant details
app.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await drizzle.table('restaurants').select('*');
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(400).send('Error fetching restaurants');
    }
});

app.get('/', (req, res) => {
    res.send('Backend is running.');
  });

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
