const express = require('express');
const path = require('path');
const cors = require('cors');
const oracledb = require('oracledb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Oracle connection pool
let pool;

async function initializeOracle() {
  try {
    pool = await oracledb.createPool({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1
    });
    console.log('Oracle connection pool created');
  } catch (err) {
    console.error('Error creating Oracle connection pool:', err);
  }
}

// API Routes
app.post('/api/oracle-test-connection', async (req, res) => {
  try {
    const { user, password, connectionString } = req.body;
    
    let connection;
    try {
      connection = await oracledb.getConnection({
        user,
        password,
        connectString: connectionString
      });
      
      const result = await connection.execute('SELECT 1 FROM DUAL');
      await connection.close();
      
      res.json({ success: true, message: 'Connection successful' });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: 'Connection failed', 
        error: err.message 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
});

app.post('/api/oracle-deploy', async (req, res) => {
  try {
    const { user, password, connectionString, sqlScript } = req.body;
    
    let connection;
    try {
      connection = await oracledb.getConnection({
        user,
        password,
        connectString: connectionString
      });
      
      // Execute the SQL script
      const result = await connection.execute(sqlScript);
      await connection.commit();
      await connection.close();
      
      res.json({ 
        success: true, 
        message: 'Deployment successful',
        result: result
      });
    } catch (err) {
      res.status(400).json({ 
        success: false, 
        message: 'Deployment failed', 
        error: err.message 
      });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: err.message 
    });
  }
});

app.post('/api/ai-explain', async (req, res) => {
  try {
    const { code, model } = req.body;
    
    // Implement AI explanation logic here
    // This would integrate with your AI service (Gemini, OpenAI, etc.)
    
    res.json({ 
      success: true, 
      explanation: 'AI explanation would go here',
      model: model || 'default'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'AI service error', 
      error: err.message 
    });
  }
});

app.post('/api/ai-rewrite', async (req, res) => {
  try {
    const { code, instructions, model } = req.body;
    
    // Implement AI rewrite logic here
    // This would integrate with your AI service
    
    res.json({ 
      success: true, 
      rewrittenCode: 'Rewritten code would go here',
      model: model || 'default'
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'AI service error', 
      error: err.message 
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
async function startServer() {
  await initializeOracle();
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(console.error); 