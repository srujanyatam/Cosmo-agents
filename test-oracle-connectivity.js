const { testConnection, deployToOracle } = require('./src/utils/databaseUtils.ts');

// Test Oracle connection
async function testOracleConnection() {
  console.log('🧪 Testing Oracle Database Connectivity...\n');
  
  // Test connection parameters (you'll need to replace these with real values)
  const testConnection = {
    type: 'oracle',
    host: 'localhost',
    port: 1521,
    username: 'test_user',
    password: 'test_password',
    database: 'ORCL',
    serviceName: null
  };

  try {
    console.log('1. Testing Oracle Connection...');
    const connectionResult = await testConnection(testConnection);
    
    if (connectionResult.success) {
      console.log('✅ Connection successful!');
      console.log(`   Message: ${connectionResult.message}`);
      if (connectionResult.details?.version) {
        console.log(`   Oracle Version: ${connectionResult.details.version}`);
      }
    } else {
      console.log('❌ Connection failed');
      console.log(`   Error: ${connectionResult.message}`);
      if (connectionResult.details?.suggestion) {
        console.log(`   Suggestion: ${connectionResult.details.suggestion}`);
      }
    }
    
    console.log('\n2. Testing Oracle Deployment...');
    const testSQL = `
      CREATE TABLE test_migration (
        id NUMBER PRIMARY KEY,
        name VARCHAR2(100),
        created_date DATE DEFAULT SYSDATE
      );
      
      INSERT INTO test_migration (id, name) VALUES (1, 'Test Record');
    `;
    
    const deployResult = await deployToOracle(testConnection, testSQL, 'test_migration.sql');
    
    if (deployResult.success) {
      console.log('✅ Deployment successful!');
      console.log(`   Message: ${deployResult.message}`);
    } else {
      console.log('❌ Deployment failed');
      console.log(`   Error: ${deployResult.message}`);
      if (deployResult.details) {
        console.log('   Details:', JSON.stringify(deployResult.details, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testOracleConnection(); 