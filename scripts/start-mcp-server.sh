#!/bin/bash
# start-mcp-server.sh
# Starts the EmpowerMe MCP server for use with OpenClaw/Codex assistant
# Usage: ./scripts/start-mcp-server.sh

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to the project directory
cd "$PROJECT_DIR"

# Load environment variables if they exist
if [ -f ".env" ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Error: node_modules not found. Please run 'npm install' first."
  exit 1
fi

# Start the MCP server
# The server will listen on stdin/stdout (stdio protocol)
# This allows OpenClaw to communicate with it via stdio transport
exec node src/mcp/companyCreationServer.js
