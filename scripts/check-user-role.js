const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUserRole() {
  console.log('Checking user role and profiles table...');
  
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('Error getting user:', userError);
      return;
    }
    
    if (!user) {
      console.log('No authenticated user found');
      return;
    }
    
    console.log('Current user ID:', user.id);
    console.log('Current user email:', user.email);
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return;
    }
    
    console.log('User profile:', profile);
    console.log('User role:', profile.role);
    
    // Test admin access to all profiles
    console.log('\nTesting admin access to all profiles...');
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (allProfilesError) {
      console.error('Error fetching all profiles:', allProfilesError);
    } else {
      console.log('✅ Successfully fetched all profiles');
      console.log('Total profiles:', allProfiles.length);
      console.log('Profiles:', allProfiles.map(p => ({ id: p.id, email: p.email, role: p.role })));
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

checkUserRole(); 