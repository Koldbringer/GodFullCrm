anon public : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdXBreGdlZ25rbnptZHBxd2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjA2ODEsImV4cCI6MjA2MDk5NjY4MX0.LWlDmVDHFEiVGu1vj8t3u1kQK5n_uhEIzAojhklzUUc
service_role secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdXBreGdlZ25rbnptZHBxd2R6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTQyMDY4MSwiZXhwIjoyMDYwOTk2NjgxfQ.ALvFaFKmANOvr-lAx9TPaXH1m7hayYsvW8sIpYRBrKY
jwt: jtWRz2Am+Oq/WZSzaQy1gcFrNOMCXY2HsNfGEavzYddya8clV/Q6rRctbJYxtpsdmeP+uDm8iL9ANF5ayWzH5Q==


NEXT_PUBLIC_SUPABASE_URL=https://jpupkxgegnknzmdpqwdz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwdXBreGdlZ25rbnptZHBxd2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MjA2ODEsImV4cCI6MjA2MDk5NjY4MX0.LWlDmVDHFEiVGu1vj8t3u1kQs5n_uhEIzAojhklzUUc

he Model Context Protocol (MCP) standardizes how Large Language Models (LLMs) talk to external services like Supabase. It connects AI assistants directly with your Supabase project and allows them to perform tasks like managing tables, fetching config, and querying data. See the full list of tools.

Prerequisites
You will need Node.js installed on your machine. You can check this by running:

node -v
If you don't have Node.js installed, you can download it from nodejs.org.

Setup
1. Personal access token (PAT)
First, go to your Supabase settings and create a personal access token. Give it a name that describes its purpose, like "Cursor MCP Server".

This will be used to authenticate the MCP server with your Supabase account. Make sure to copy the token, as you won't be able to see it again.

2. Configure MCP client
Next, configure your MCP client (such as Cursor) to use this server. Most MCP clients store the configuration as JSON in the following format:

{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
Replace <personal-access-token> with the token you created in step 1. Alternatively you can omit --access-token and instead set the SUPABASE_ACCESS_TOKEN environment variable to your personal access token (you will need to restart your MCP client after setting this). This allows you to keep your token out of version control if you plan on committing this configuration to a repository.

If you are on Windows, you will need to prefix the command. If your MCP client doesn't accept JSON, the direct CLI command is:

npx -y @supabase/mcp-server-supabase@latest --access-token=<personal-access-token>
Note: Do not run this command directly - this is meant to be executed by your MCP client in order to start the server. npx automatically downloads the latest version of the MCP server from npm and runs it in a single command.

Windows
On Windows, you will need to prefix the command with cmd /c:

{
  "mcpServers": {
    "supabase": {
      "command": "cmd",
      "args": [
        "/c",
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
or with wsl if you are running Node.js inside WSL:

{
  "mcpServers": {
    "supabase": {
      "command": "wsl",
      "args": [
        "npx",
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "<personal-access-token>"
      ]
    }
  }
}
Make sure Node.js is available in your system PATH environment variable. If you are running Node.js natively on Windows, you can set this by running the following commands in your terminal.

Get the path to npm:

npm config get prefix
Add the directory to your PATH:

setx PATH "%PATH%;<path-to-dir>"
Restart your MCP client.

Read-only mode
If you wish to restrict the Supabase MCP server to read-only queries, set the --read-only flag on the CLI command:

npx -y @supabase/mcp-server-supabase@latest --access-token=<personal-access-token> --read-only
This prevents write operations on any of your databases by executing SQL as a read-only Postgres user. Note that this flag only applies to database tools (execute_sql and apply_migration) and not to other tools like create_project or create_branch.

Tools
Note: This server is pre-1.0, so expect some breaking changes between versions. Since LLMs will automatically adapt to the tools available, this shouldn't affect most users.

The following Supabase tools are available to the LLM:

Project Management
list_projects: Lists all Supabase projects for the user.
get_project: Gets details for a project.
create_project: Creates a new Supabase project.
pause_project: Pauses a project.
restore_project: Restores a project.
list_organizations: Lists all organizations that the user is a member of.
get_organization: Gets details for an organization.
Database Operations
list_tables: Lists all tables within the specified schemas.
list_extensions: Lists all extensions in the database.
list_migrations: Lists all migrations in the database.
apply_migration: Applies a SQL migration to the database. SQL passed to this tool will be tracked within the database, so LLMs should use this for DDL operations (schema changes).
execute_sql: Executes raw SQL in the database. LLMs should use this for regular queries that don't change the schema.
get_logs: Gets logs for a Supabase project by service type (api, postgres, edge functions, auth, storage, realtime). LLMs can use this to help with debugging and monitoring service performance.
Edge Function Management
list_edge_functions: Lists all Edge Functions in a Supabase project.
deploy_edge_function: Deploys a new Edge Function to a Supabase project. LLMs can use this to deploy new functions or update existing ones.
Project Configuration
get_project_url: Gets the API URL for a project.
get_anon_key: Gets the anonymous API key for a project.
Branching (Experimental, requires a paid plan)
create_branch: Creates a development branch with migrations from production branch.
list_branches: Lists all development branches.
delete_branch: Deletes a development branch.
merge_branch: Merges migrations and edge functions from a development branch to production.
reset_branch: Resets migrations of a development branch to a prior version.
rebase_branch: Rebases development branch on production to handle migration drift.
Development Tools
generate_typescript_types: Generates TypeScript types based on the database schema. LLMs can save this to a file and use it in their code.
Cost Confirmation
get_cost: Gets the cost of a new project or branch for an organization.
confirm_cost: Confirms the user's understanding of new project or branch costs. This is required to create a new project or branch.
Other MCP servers
@supabase/mcp-server-postgrest
The PostgREST MCP server allows you to connect your own users to your app via REST API. See more details on its project README.

Resources
Model Context Protocol: Learn more about MCP and its capabilities.
From development to production: Learn how to safely promote changes to production environments.

---

## Installing the Supabase JavaScript Client

To use Supabase in your Node.js project, install the official client library:

```sh
npm install @supabase/supabase-js
```

Add this to your `fetch-mcp` project directory. This package allows you to connect to your Supabase backend from your Node.js code, including within MCP tools or custom integrations.

### Basic Usage Example

```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Fetch all rows from a table
const { data, error } = await supabase
  .from('your_table')
  .select('*');

console.log(data, error);
```

- Place your Supabase URL and key in environment variables for security.
- Use this client in your MCP server or any Node.js backend code that needs to access Supabase.

---