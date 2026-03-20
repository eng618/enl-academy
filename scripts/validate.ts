import { spawn } from 'node:child_process';

type Step = {
  name: string;
  command: string[];
};

const args = process.argv.slice(2);
const fixMode = args.includes('--fix');

for (const arg of args) {
  if (arg !== '--fix') {
    console.error(`Unknown flag: ${arg}`);
    console.error('Usage: bun validate [--fix]');
    process.exit(2);
  }
}

const steps: Step[] = [
  {
    name: fixMode ? 'Format (write)' : 'Format (check)',
    command: ['run', fixMode ? 'format' : 'format:ci'],
  },
  {
    name: fixMode ? 'Lint (fix)' : 'Lint',
    command: ['run', fixMode ? 'lint:fix' : 'lint'],
  },
  {
    name: 'Typecheck',
    command: ['run', 'typecheck'],
  },
  {
    name: 'Test',
    command: ['run', 'test'],
  },
];

function runStep(step: Step): Promise<void> {
  return new Promise((resolve, reject) => {
    const prettyCommand = ['bun', ...step.command].join(' ');
    console.log(`\n>>> ${step.name}`);
    console.log(`$ ${prettyCommand}`);

    const child = spawn('bun', step.command, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${step.name} failed with exit code ${code ?? 1}`));
    });
  });
}

async function main() {
  console.log(fixMode ? 'Running local CI checks in fix mode...' : 'Running local CI checks...');

  for (const step of steps) {
    await runStep(step);
  }

  console.log('\nAll validate checks passed.');
}

main().catch((error) => {
  console.error(`\nValidate failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
