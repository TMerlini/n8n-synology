/**
 * Coolify (and similar) set PORT; n8n expects N8N_PORT.
 */
process.env.N8N_PORT = process.env.PORT || process.env.N8N_PORT || '5678';

const { spawn } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const isWin = process.platform === 'win32';
const n8nBin = path.join(root, 'node_modules', '.bin', isWin ? 'n8n.cmd' : 'n8n');

const child = spawn(n8nBin, ['start'], {
  stdio: 'inherit',
  env: process.env,
  cwd: root,
  shell: isWin,
});

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  process.exit(code === null ? 0 : code);
});
