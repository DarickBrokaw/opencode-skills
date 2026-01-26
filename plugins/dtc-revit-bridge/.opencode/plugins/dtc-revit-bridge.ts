import type { Plugin, ToolExecutionContext } from '@opencode-ai/plugin';
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const DEFAULT_REPO = path.join(process.env.USERPROFILE || '', 'Desktop', 'DTCAI.Addin.3.0.0');
const REPO_ROOT = path.resolve(process.env.DTC_REPO_PATH || DEFAULT_REPO);
const BRIDGE_SCRIPT = 'tools/revit-bridge/send.js';
const PLUGIN_ROOT = path.join(process.env.USERPROFILE || '', '.config', 'opencode', 'plugins', 'dtc-revit-bridge');
const SCRIPTS_DIR = path.join(PLUGIN_ROOT, 'scripts');

interface BridgePayload {
  code: string;
  context?: Record<string, unknown>;
  timeoutMs?: number;
}

function ensureScriptsDir(): void {
  if (!fs.existsSync(SCRIPTS_DIR)) {
    fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
  }
}

function persistScript(code: string): string {
  ensureScriptsDir();
  const name = `goal-${Date.now()}.py`;
  const filePath = path.join(SCRIPTS_DIR, name);
  fs.writeFileSync(filePath, code, 'utf-8');
  return filePath;
}

function loadToken(): string {
  const envToken = process.env.DTC_AI_TOKEN;
  if (envToken && envToken.trim()) {
    return envToken.trim();
  }

  const appData = process.env.APPDATA;
  if (!appData) {
    throw new Error('APPDATA is not set; cannot find DTCAI token file.');
  }

  const tokenPath = path.join(appData, 'DTCAI', 'token.txt');
  if (!fs.existsSync(tokenPath)) {
    throw new Error(`Token file missing at ${tokenPath}. Start Revit once to generate it.`);
  }

  return fs.readFileSync(tokenPath, 'utf-8').trim();
}

function runBridge(payload: BridgePayload, savedFile?: string): string {
  const args = ['--code', payload.code];
  if (payload.context) {
    args.push('--context', JSON.stringify(payload.context));
  }
  if (payload.timeoutMs) {
    args.push('--timeout', payload.timeoutMs.toString());
  }

  const env = { ...process.env, DTC_AI_TOKEN: loadToken() };
  env.DTC_BRIDGE_SOURCE = savedFile || '';

  const result = spawnSync('node', [path.join(REPO_ROOT, BRIDGE_SCRIPT), ...args], {
    cwd: REPO_ROOT,
    env,
    encoding: 'utf-8'
  });

  if (result.error) {
    throw result.error;
  }

  return (result.stdout || '') + (result.stderr || '');
}

function parseBridgeRequest(command: string): BridgePayload {
  try {
    return JSON.parse(command);
  } catch (err) {
    throw new Error('Command must be a JSON object with a `code` field.');
  }
}

export const DtcRevitBridgePlugin: Plugin = async (context) => {
  const { command } = context;
  if (!command) {
    return {};
  }

  const payload = parseBridgeRequest(command);
  if (!payload.code || typeof payload.code !== 'string') {
    throw new Error('Payload must include a `code` string.');
  }

  const savedFile = persistScript(payload.code);
  console.log(`[DTC-REVIT-BRIDGE] Persisted goal script to ${savedFile}`);

  console.log('[DTC-REVIT-BRIDGE] Forwarding generated Python to the bridge.');
  const output = runBridge(payload, savedFile);
  console.log(output.trim());

  return {};
};

export default DtcRevitBridgePlugin;
