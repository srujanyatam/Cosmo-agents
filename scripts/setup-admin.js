const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase URL and anon key
const supabaseUrl = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupAdmin() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Please provide an email address: node setup-admin.js user@example.com');
    process.exit(1);
  }

  try {
    // First, check if the user exists
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('Error fetching users:', userError);
      return;
    }

    const user = users.find(u => u.email === email);
    
    if (!user) {
      console.error(`User with email ${email} not found. Please make sure the user has signed up first.`);
      return;
    }

    // Update the user's role to admin
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return;
    }

    console.log(`✅ Successfully set ${email} as admin!`);
    console.log(`User ID: ${user.id}`);
    console.log('The user can now access the admin panel at /admin');

  } catch (error) {
    console.error('Error:', error);
  }
}

setupAdmin(); 