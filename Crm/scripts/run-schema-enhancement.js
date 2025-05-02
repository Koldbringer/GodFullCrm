// run-schema-enhancement.js
// Script to execute the enhance-schema.sql file against the Supabase database

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing required environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

// Create Supabase client with service role key for admin privileges
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function runSchemaEnhancement() {
  try {
    console.log('Reading SQL script...');
    const sqlScript = fs.readFileSync(path.resolve(__dirname, './enhance-schema.sql'), 'utf8');
    
    // Split the script into individual statements
    const statements = sqlScript
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute.`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      
      const { error } = await supabase.rpc('pgexecute', { query: statement + ';' });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        console.error('Statement:', statement);
      }
    }
    
    console.log('Schema enhancement completed successfully!');
  } catch (error) {
    console.error('Error running schema enhancement:', error);
    process.exit(1);
  }
}

// Run the enhancement
runSchemaEnhancement();