#!/usr/bin/env node
/**
 * Library MCP — the five tools an agent sees, spoken over stdin and stdout as
 * line-delimited JSON-RPC. No dependencies: the protocol is small enough that
 * a package would be the larger thing to maintain.
 *
 * Everything it can reach is decided before it starts: one key, one library,
 * one target. Read mcp/library/README.md before wiring it to an agent.
 */

import { createInterface } from 'node:readline';

import { strapiUrl, target } from './config.mjs';
import { record, setCaller } from './journal.mjs';
import { call, definitions } from './tools.mjs';

const NAME = 'keepsimple-library';
const VERSION = '1.0.0';
const FALLBACK_PROTOCOL = '2024-11-05';

const send = message => {
  process.stdout.write(`${JSON.stringify(message)}\n`);
};

const reply = (id, result) => send({ jsonrpc: '2.0', id, result });

const fail = (id, code, message) =>
  send({ jsonrpc: '2.0', id, error: { code, message } });

const onMessage = async message => {
  const { id, method, params } = message;

  switch (method) {
    case 'initialize':
      setCaller(params?.clientInfo?.name ?? null);
      record({ event: 'initialize' });

      return reply(id, {
        protocolVersion:
          typeof params?.protocolVersion === 'string'
            ? params.protocolVersion
            : FALLBACK_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: { name: NAME, version: VERSION },
      });

    case 'notifications/initialized':
    case 'notifications/cancelled':
      return undefined;

    case 'ping':
      return reply(id, {});

    case 'tools/list':
      return reply(id, { tools: definitions });

    case 'tools/call':
      return reply(id, await call(params?.name, params?.arguments ?? {}));

    default:
      if (id === undefined) return undefined;

      return fail(id, -32601, `Unknown method: ${method}`);
  }
};

process.stderr.write(`[library-mcp] ${target} → ${strapiUrl}\n`);

createInterface({ input: process.stdin }).on('line', async line => {
  const trimmed = line.trim();

  if (!trimmed) return;

  let message;

  try {
    message = JSON.parse(trimmed);
  } catch {
    return fail(null, -32700, 'Parse error');
  }

  try {
    await onMessage(message);
  } catch (error) {
    record({ event: 'crash', detail: error.message });

    if (message.id !== undefined) fail(message.id, -32603, error.message);
  }
});
