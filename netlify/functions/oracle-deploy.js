const oracledb = require('oracledb');

// Oracle database deployment function
exports.handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { connection, code, fileName } = JSON.parse(event.body);
    
    if (!connection || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing connection details or code' })
      };
    }

    // Validate connection parameters
    const { host, port, username, password, database, serviceName } = connection;
    
    if (!host || !port || !username || !password || (!database && !serviceName)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required connection parameters' })
      };
    }

    // Build connection string
    const connectionString = serviceName 
      ? `${host}:${port}/${serviceName}`
      : `${host}:${port}/${database}`;

    let connection;
    let result = { success: false, message: '', details: {} };

    try {
      // Establish connection
      connection = await oracledb.getConnection({
        user: username,
        password: password,
        connectString: connectionString
      });

      // Execute the SQL code
      const sqlStatements = parseSQLStatements(code);
      
      for (let i = 0; i < sqlStatements.length; i++) {
        const statement = sqlStatements[i].trim();
        if (statement) {
          try {
            const executeResult = await connection.execute(statement, [], {
              autoCommit: true,
              outFormat: oracledb.OUT_FORMAT_OBJECT
            });
            
            result.details[`statement_${i + 1}`] = {
              success: true,
              rowsAffected: executeResult.rowsAffected || 0,
              statement: statement.substring(0, 100) + (statement.length > 100 ? '...' : '')
            };
          } catch (stmtError) {
            result.details[`statement_${i + 1}`] = {
              success: false,
              error: stmtError.message,
              statement: statement.substring(0, 100) + (statement.length > 100 ? '...' : '')
            };
            // Continue with other statements even if one fails
          }
        }
      }

      // Check if any statements failed
      const failedStatements = Object.values(result.details).filter(detail => !detail.success);
      
      if (failedStatements.length === 0) {
        result.success = true;
        result.message = `Successfully deployed ${fileName} to Oracle database`;
      } else {
        result.success = false;
        result.message = `Deployment completed with ${failedStatements.length} errors`;
      }

    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError) {
          console.error('Error closing connection:', closeError);
        }
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('Oracle deployment error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Database deployment failed',
        error: error.message
      })
    };
  }
};

// Helper function to parse SQL statements
function parseSQLStatements(code) {
  // Split by semicolon and filter out empty statements
  const statements = code.split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
  
  return statements;
} 