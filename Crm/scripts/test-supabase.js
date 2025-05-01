// Simple script to test Supabase connection and create a user
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Hardcoded values as fallback
const FALLBACK_SUPABASE_URL = 'https://jpupkxgegnknzmdpqwdz.supabase.co';
const FALLBACK_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdXBreGdlZ25rbnptZHBxd2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjA2ODEsImV4cCI6MjA2MDk5NjY4MX0.LWlDmVDHFEiVGu1vj8t3u1kQK5n_uhEIzAojhklzUUc';

async function main() {
  console.log('Testing Supabase connection...');

  // Create Supabase client
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use fallback values if environment variables are not set
  if (!supabaseUrl || !supabaseKey) {
    console.log('Environment variables not found, using fallback values');
    supabaseUrl = FALLBACK_SUPABASE_URL;
    supabaseKey = FALLBACK_SUPABASE_KEY;
  }

  console.log(`Using Supabase URL: ${supabaseUrl}`);
  console.log(`Using Supabase Key: ${supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'undefined'}`);

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or key. Check your .env.local file.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test connection by getting the current user
    console.log('Testing connection by getting service status...');
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    console.log('Connection successful!');
    console.log('Session data:', data);

    // Create a test user
    console.log('\nCreating a test user...');
    const email = 'test@test.pl';
    const password = 'blaeritipol';

    const { data: userData, error: userError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (userError) {
      throw userError;
    }

    console.log('User created successfully!');
    console.log('User data:', userData);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
