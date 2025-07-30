// Separate Supabase client for comments feature
import { createClient } from '@supabase/supabase-js';
import { supabase } from './client'; // Import the main supabase client

// Get environment variables for comments database
const getCommentsSupabaseUrl = () => {
  try {
    const url = import.meta.env.VITE_SUPABASE_URL_COMMENTS;
    console.log('🔍 Comments Supabase URL check:', {
      hasUrl: !!url,
      urlType: typeof url,
      urlLength: url?.length,
      startsWithHttps: url?.startsWith('https://'),
      value: url ? url.substring(0, 30) + '...' : 'undefined'
    });
    
    if (!url || url === 'undefined' || url === '' || typeof url !== 'string') {
      console.warn('❌ Comments Supabase URL is missing or invalid');
      return null;
    }
    if (!url.startsWith('https://') || url.length < 10) {
      console.warn('❌ Comments Supabase URL format is invalid:', url);
      return null;
    }
    console.log('✅ Comments Supabase URL is valid');
    return url;
  } catch (error) {
    console.warn('❌ Error getting Comments Supabase URL:', error);
    return null;
  }
};

const getCommentsSupabaseKey = () => {
  try {
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY_COMMENTS;
    console.log('🔍 Comments Supabase Key check:', {
      hasKey: !!key,
      keyType: typeof key,
      keyLength: key?.length,
      startsWithEyJ: key?.startsWith('eyJ'),
      value: key ? key.substring(0, 20) + '...' : 'undefined'
    });
    
    if (!key || key === 'undefined' || key === '' || typeof key !== 'string') {
      console.warn('❌ Comments Supabase key is missing or invalid');
      return null;
    }
    if (!key.startsWith('eyJ') || key.length < 50) {
      console.warn('❌ Comments Supabase key format is invalid:', key.substring(0, 20) + '...');
      return null;
    }
    console.log('✅ Comments Supabase key is valid');
    return key;
  } catch (error) {
    console.warn('❌ Error getting Comments Supabase key:', error);
    return null;
  }
};

const COMMENTS_SUPABASE_URL = getCommentsSupabaseUrl();
const COMMENTS_SUPABASE_KEY = getCommentsSupabaseKey();

// Log configuration status
if (!COMMENTS_SUPABASE_URL || !COMMENTS_SUPABASE_KEY) {
  console.error('❌ Comments Supabase not configured properly!');
  console.error('Missing or invalid environment variables:');
  console.error('- VITE_SUPABASE_URL_COMMENTS:', COMMENTS_SUPABASE_URL ? '✅ Present' : '❌ Missing/Invalid');
  console.error('- VITE_SUPABASE_ANON_KEY_COMMENTS:', COMMENTS_SUPABASE_KEY ? '✅ Present' : '❌ Missing/Invalid');
  console.error('');
  console.error('🔧 To fix this:');
  console.error('1. Go to Netlify Dashboard → Site Settings → Environment Variables');
  console.error('2. Add these variables as Key/Value pairs:');
  console.error('   VITE_SUPABASE_URL_COMMENTS = https://your-comments-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY_COMMENTS = your_comments_supabase_anon_key');
  console.error('3. Redeploy your site');
} else {
  console.log('✅ Comments Supabase configured successfully');
}

// Create mock client for comments
const createMockCommentsClient = () => {
  const mockResponse = (data: any = null, error: any = null) => Promise.resolve({ data, error });
  
  return {
    auth: {
      onAuthStateChange: () => ({ 
        data: { 
          subscription: { 
            unsubscribe: () => {} 
          } 
        } 
      }),
      getSession: () => mockResponse({ session: null }),
      getUser: () => mockResponse({ user: null }),
    },
    from: (table: string) => ({
      select: (columns?: string) => ({
        eq: (column: string, value: any) => ({
          single: () => mockResponse(null, { message: 'Comments Supabase not configured' }),
          order: () => ({
            limit: () => mockResponse([])
          })
        }),
        order: () => ({
          limit: () => mockResponse([])
        }),
        limit: () => mockResponse([])
      }),
      insert: (data: any) => mockResponse(null, { message: 'Comments Supabase not configured' }),
      update: (data: any) => ({
        eq: (column: string, value: any) => mockResponse(null, { message: 'Comments Supabase not configured' })
      }),
      delete: () => ({
        eq: (column: string, value: any) => mockResponse(null, { message: 'Comments Supabase not configured' })
      }),
    }),
  } as any;
};

// Create the comments client
let commentsSupabaseClient: any;

try {
  if (COMMENTS_SUPABASE_URL && COMMENTS_SUPABASE_KEY) {
    console.log('🔧 Creating Comments Supabase client...');
    commentsSupabaseClient = createClient(COMMENTS_SUPABASE_URL, COMMENTS_SUPABASE_KEY);
    console.log('✅ Comments Supabase client created successfully');
    
    // Sync authentication session from main client
    const syncAuthSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('🔄 Syncing auth session to comments client...');
          await commentsSupabaseClient.auth.setSession(session);
          console.log('✅ Auth session synced successfully');
        }
      } catch (error) {
        console.warn('⚠️ Could not sync auth session:', error);
      }
    };
    
    // Initial sync
    syncAuthSession();
    
    // Listen for auth changes in main client and sync to comments client
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed in main client:', event);
      if (session) {
        await commentsSupabaseClient.auth.setSession(session);
        console.log('✅ Auth session synced to comments client');
      } else {
        await commentsSupabaseClient.auth.signOut();
        console.log('✅ Signed out from comments client');
      }
    });
    
  } else {
    console.log('⚠️ Creating mock Comments Supabase client...');
    commentsSupabaseClient = createMockCommentsClient();
    console.log('⚠️ Using mock Comments Supabase client - comments will not work');
  }
} catch (error) {
  console.error('❌ Error creating Comments Supabase client:', error);
  commentsSupabaseClient = createMockCommentsClient();
}

export const commentsSupabase = commentsSupabaseClient; 