const express = require('express');
const pool = require('./db');  

const app = express();
const port = 3000;


app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true });
});

// GET /users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /users/:user_id
app.get('/users/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /users
app.post('/users', async (req, res) => {
  const { username, email, subscribed_subreddits } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, subscribed_subreddits)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [username, email, subscribed_subreddits || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /users/:user_id
app.put('/users/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const { username, email, subscribed_subreddits } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
         SET username = $1,
             email = $2,
             subscribed_subreddits = $3,
             updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [username, email, subscribed_subreddits || [], userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /users/:user_id
app.delete('/users/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /subreddits
app.get('/subreddits', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subreddits');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /subreddits/:subreddit_id
app.get('/subreddits/:subreddit_id', async (req, res) => {
  const subredditId = parseInt(req.params.subreddit_id, 10);
  try {
    const result = await pool.query('SELECT * FROM subreddits WHERE id = $1', [subredditId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subreddit not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /subreddits
app.post('/subreddits', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO subreddits (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /subscribe/:user_id/:subreddit_id
app.post('/subscribe/:user_id/:subreddit_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const subredditId = parseInt(req.params.subreddit_id, 10);

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const subredditResult = await pool.query('SELECT * FROM subreddits WHERE id = $1', [subredditId]);
    if (subredditResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subreddit not found' });
    }

    let currentSubscriptions = userResult.rows[0].subscribed_subreddits || [];

    if (currentSubscriptions.includes(subredditId)) {
      return res.status(400).json({ error: 'Already subscribed' });
    }

    currentSubscriptions.push(subredditId);

    const updateResult = await pool.query(
      `UPDATE users SET subscribed_subreddits = $1 WHERE id = $2 RETURNING *`,
      [currentSubscriptions, userId]
    );

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error("Database Error: ", error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
