// Load environment variables from .env.local
require("dotenv").config({ path: "./.env.local" })

const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

// Ensure DATABASE_URL is available before initializing neon
if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.")
  process.exit(1)
}

const sql = neon(process.env.DATABASE_URL)

async function initDb() {
  console.log("Running database initialization...")
  try {
    const initSqlContent = fs.readFileSync(path.join(__dirname, "init.sql"), "utf8")

    // Split the SQL content into individual statements
    // Filter out empty strings and comments
    const statements = initSqlContent
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`) // Log first 50 chars
      await sql.query(statement)
    }

    console.log("Database initialized successfully.")
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

function generateMigration() {
  console.log("Generating new migration file...")
  const timestamp = new Date().toISOString().replace(/[-:.]/g, "")
  const fileName = `migration-${timestamp}.sql`
  const filePath = path.join(__dirname, fileName)
  fs.writeFileSync(filePath, `-- Add your SQL migration here\n\n`)
  console.log(`New migration file created: ${fileName}`)
}

async function runMigrations() {
  console.log("Running pending migrations...")
  // For this simple setup, 'run' will just ensure 'init.sql' is applied.
  // In a real migration system, you'd track applied migrations.
  await initDb() // Ensure base schema is there
  console.log("All migrations run.")
}

async function main() {
  const command = process.argv[2]

  switch (command) {
    case "init":
      await initDb()
      break
    case "generate":
      generateMigration()
      break
    case "run":
      await runMigrations()
      break
    default:
      console.log("Usage: node scripts/db/migrate.js [init|generate|run]")
      process.exit(1)
  }
  process.exit(0)
}

main()