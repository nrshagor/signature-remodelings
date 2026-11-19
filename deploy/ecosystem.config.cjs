// PM2 config for Signature Remodelings (Next.js standalone server), one process per
// environment, owned by the deploy user "builders": signature-staging (127.0.0.1:3104)
// and signature-production (127.0.0.1:3204).
//
// deploy.sh sets APP, ENV_NAME and PORT, then runs:
//   pm2 start  deploy/ecosystem.config.cjs                # first deploy of that env
//   pm2 reload deploy/ecosystem.config.cjs --update-env   # later deploys (zero downtime)
//
// Settings live only in /var/www/builders/signature-<env>/shared/.env (chmod 600), never
// in this repo. It is read here because PM2 has no built-in .env support.

const fs = require('node:fs');
const path = require('node:path');

const BASE = process.env.BUILDERS_BASE || '/var/www/builders';
const APP = process.env.APP;
const ENV_NAME = process.env.ENV_NAME;
const PORT = process.env.PORT;
const PORTS = { staging: '3104', production: '3204' };

if (APP !== 'signature' || !/^(staging|production)$/.test(ENV_NAME || '')) {
  throw new Error('Set APP=signature and ENV_NAME (staging|production); deploy.sh does.');
}
if (PORT !== PORTS[ENV_NAME]) {
  throw new Error(`PORT for ${ENV_NAME} must be ${PORTS[ENV_NAME]} (got "${PORT}"); deploy.sh sets it.`);
}

const NAME = `${APP}-${ENV_NAME}`;
const TARGET = path.join(BASE, NAME);
const ENV_FILE = path.join(TARGET, 'shared', '.env');

/** Minimal KEY=VALUE parser: skips blanks and # comments, strips matching quotes. */
function readEnvFile(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`Missing ${file}. Copy .env.example there and fill it in (deploy/README.md).`);
  }
  const env = {};
  for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (/^(['"]).*\1$/.test(value)) value = value.slice(1, -1);
    env[key] = value;
  }
  return env;
}

module.exports = {
  apps: [
    {
      name: NAME,
      // `current` is a symlink to the live release; reload picks up the new target.
      cwd: path.join(TARGET, 'current'),
      script: 'server.js',

      // Cluster mode with ONE worker: `pm2 reload` starts the new worker before stopping
      // the old one (zero downtime), and the in-memory contact rate limit still lives
      // in a single process. Do not raise `instances` (see README, rate limit).
      exec_mode: 'cluster',
      instances: 1,

      env: {
        ...readEnvFile(ENV_FILE),
        NODE_ENV: 'production',
        // Bind to localhost only: reachable through Nginx, never directly.
        HOSTNAME: '127.0.0.1',
        PORT,
      },

      max_memory_restart: '600M',
      listen_timeout: 15000,
      kill_timeout: 8000,
      time: true,
      out_file: path.join(TARGET, 'logs', 'out.log'),
      error_file: path.join(TARGET, 'logs', 'error.log'),
      merge_logs: true,
    },
  ],
};
