import { exec } from 'child_process';

async function runCommand(command: string) {
  await new Promise((resolve) => {
    exec(command, (error) => {
      if (error) {
        console.log('error', error.message);
        return;
      }
      resolve('result');
    });
  });
}

async function runNTimes(amount: number, command: string) {
  for (let i = 0; i < amount; i++) {
    await runCommand(command);
  }
}

async function timeIt(fn: () => void): Promise<number> {
  const start = new Date().getTime();
  await fn();
  return new Date().getTime() - start;
}

async function compare() {
  const amount = 10;
  const jestResult = await timeIt(() => runNTimes(amount, 'yarn jest:e2e'));
  const uvuResult = await timeIt(() =>
    runNTimes(amount, 'yarn uvu:e2e:categories'),
  );
  console.log(`Jest: ${jestResult}, ${jestResult / amount}`);
  console.log(`Uvu: ${uvuResult}, ${uvuResult / amount}`);
}

compare();
