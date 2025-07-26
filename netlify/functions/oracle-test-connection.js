const oracledb = require('oracledb');

// Oracle database connection test function
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
    const { connection } = JSON.parse(event.body);
    
    if (!connection) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing connection details' })
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
      // Test connection with timeout
      const connectionPromise = oracledb.getConnection({
        user: username,
        password: password,
        connectString: connectionString
      });

      // Set a 10-second timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout')), 10000);
      });

      connection = await Promise.race([connectionPromise, timeoutPromise]);

      // Test a simple query to verify the connection works
      const testResult = await connection.execute('SELECT 1 as test_value FROM DUAL', [], {
        outFormat: oracledb.OUT_FORMAT_OBJECT
      });

      // Get database version and other info
      const versionResult = await connection.execute(
        'SELECT version, instance_name FROM v$instance', 
        [], 
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      result.success = true;
      result.message = 'Connection successful!';
      result.details = {
        version: versionResult.rows?.[0]?.VERSION || 'Unknown',
        instanceName: versionResult.rows?.[0]?.INSTANCE_NAME || 'Unknown',
        testQuery: testResult.rows?.[0]?.TEST_VALUE === 1 ? 'Passed' : 'Failed'
      };

    } catch (dbError) {
      result.success = false;
      result.message = 'Connection failed';
      result.details = {
        error: dbError.message,
        errorCode: dbError.errorNum || 'Unknown',
        suggestion: getConnectionSuggestion(dbError)
      };
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
    console.error('Connection test error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Connection test failed',
        error: error.message
      })
    };
  }
};

// Helper function to provide connection suggestions
function getConnectionSuggestion(error) {
  const errorMessage = error.message.toLowerCase();
  
  if (errorMessage.includes('ora-12541')) {
    return 'TNS listener not found. Check if the Oracle service is running and the port is correct.';
  } else if (errorMessage.includes('ora-12514')) {
    return 'Service name not found. Verify the database/service name is correct.';
  } else if (errorMessage.includes('ora-01017')) {
    return 'Invalid username or password. Please check your credentials.';
  } else if (errorMessage.includes('ora-12505')) {
    return 'TNS listener does not currently know of SID given in connect descriptor.';
  } else if (errorMessage.includes('timeout')) {
    return 'Connection timeout. Check if the database is accessible from this network.';
  } else if (errorMessage.includes('network')) {
    return 'Network error. Check if the host and port are correct and accessible.';
  }
  
  return 'Please verify your connection parameters and try again.';
} 