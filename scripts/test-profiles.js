const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testProfilesTable() {
  console.log('Testing profiles table...');
  
  try {
    // Test 1: Check if table exists
    console.log('\n1. Checking if profiles table exists...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error accessing profiles table:', tableError);
      return;
    }
    
    console.log('✅ Profiles table exists and is accessible');
    
    // Test 2: Get table structure
    console.log('\n2. Getting table structure...');
    const { data: structure, error: structureError } = await supabase
      .rpc('get_table_structure', { table_name: 'profiles' });
    
    if (structureError) {
      console.log('Could not get table structure via RPC, trying direct query...');
      const { data: columns, error: columnsError } = await supabase
        .from('profiles')
        .select('*')
        .limit(0);
      
      if (columnsError) {
        console.error('Error getting columns:', columnsError);
      } else {
        console.log('✅ Table structure accessible');
      }
    } else {
      console.log('Table structure:', structure);
    }
    
    // Test 3: Count records
    console.log('\n3. Counting records...');
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error counting records:', countError);
    } else {
      console.log(`✅ Found ${count} records in profiles table`);
    }
    
    // Test 4: Get first few records
    console.log('\n4. Getting first few records...');
    const { data: records, error: recordsError } = await supabase
      .from('profiles')
      .select('*')
      .limit(5);
    
    if (recordsError) {
      console.error('Error getting records:', recordsError);
    } else {
      console.log('✅ Records retrieved successfully');
      console.log('Sample records:', records);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testProfilesTable(); 