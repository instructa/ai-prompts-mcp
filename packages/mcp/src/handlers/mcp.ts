import { z } from "zod";
import { defineEventHandler } from "h3";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { JSONRPCMessage } from "@modelcontextprotocol/sdk/types";
import { register as registerFindRuleTool } from "../tools/findrule";

const log = (...args: any[]) =>
  process.env.NODE_ENV === "development" && console.info(...args);

// initialize the MCP server and register tools
export function initializeMcpServer() {
  const server = new McpServer(
    {
      name: "mcp-prompt-finder",
      version: "1.0.0",
    }
    // {
    //   capabilities: {
    //     tools: {
    //       demo: {
    //         title: 'Demo Tool',
    //         inputSchema: z.object({}).optional(),
    //         description: 'Just a demo tool',
    //       },
    //     },
    //   },
    // }
  );

  registerFindRuleTool(server);

  return server;
}

export const createMcp = () => {
  const server = initializeMcpServer();
  let transport: SSEServerTransport;

  const onSse = defineEventHandler(async (event) => {
    const { res } = event.node;

    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);

    const _onMsg = transport.onmessage;
    const _onClose = transport.onclose;
    const _onErr = transport.onerror;

    // Send heartbeat every 5 seconds to keep the connection alive
    const heartbeatInterval = setInterval(() => {
      if (res.writable) {
        res.write(":\n\n"); // Sending an empty comment to the client to keep the connection alive
      }
    }, 5000); // 5 seconds

    transport.onmessage = (msg: JSONRPCMessage) => {
      log(msg);
      if (_onMsg) _onMsg(msg);
    };

    transport.onclose = () => {
      log("transport closed");
      if (_onClose) _onClose();
    };

    transport.onerror = (err) => {
      log(err);
      if (_onErr) _onErr(err);
    };

    // handle client disconnect
    res.on("close", async () => {
      await server.close();
      res.end();
      clearInterval(heartbeatInterval);
      log("disconnected");
    });

    ///
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();
  });

  const onMsg = defineEventHandler(async (event) => {
    const { req, res } = event.node;

    log("<--", "Received message (post)");
    if (transport?.handlePostMessage)
      await transport.handlePostMessage(req, res);
    log("<--", res.statusCode);
  });

  return {
    onSse,
    onMsg,
  };
};
