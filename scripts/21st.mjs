#!/usr/bin/env node
/**
 * 21st.dev MCP & API Bridge CLI
 * Usage:
 *   node scripts/21st.mjs search "<query>"
 *   node scripts/21st.mjs get <id>
 *   node scripts/21st.mjs theme "<query>"
 *   node scripts/21st.mjs usage
 */

const API_KEY = process.env.API_KEY_21ST || "";
const URL = "https://21st.dev/api/mcp";

async function callMcpTool(name, args = {}) {
  const payload = {
    jsonrpc: "2.0",
    id: Date.now(),
    method: "tools/call",
    params: {
      name,
      arguments: args
    }
  };

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`MCP Error ${res.status}: ${await res.text()}`);
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(`RPC Error: ${JSON.stringify(json.error)}`);
  }

  return json.result?.content?.map(c => c.text).join("\n") || "";
}

async function main() {
  const [,, command, ...rest] = process.argv;

  try {
    if (command === "search") {
      const query = rest.join(" ");
      console.log(`Searching 21st.dev for: "${query}"...\n`);
      const result = await callMcpTool("search", { query });
      console.log(result);
    } else if (command === "get") {
      const id = parseInt(rest[0], 10);
      if (isNaN(id)) {
        console.error("Please provide a numerical component ID: node scripts/21st.mjs get <id>");
        process.exit(1);
      }
      console.log(`Fetching component ID: ${id}...\n`);
      const result = await callMcpTool("get_component", { id });
      console.log(result);
    } else if (command === "theme") {
      const query = rest.join(" ");
      console.log(`Searching theme for: "${query}"...\n`);
      const result = await callMcpTool("get_theme", { query });
      console.log(result);
    } else if (command === "usage") {
      const result = await callMcpTool("get_usage", {});
      console.log(result);
    } else {
      console.log("Usage:");
      console.log("  node scripts/21st.mjs search <query>");
      console.log("  node scripts/21st.mjs get <componentId>");
      console.log("  node scripts/21st.mjs theme <themeName>");
      console.log("  node scripts/21st.mjs usage");
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
