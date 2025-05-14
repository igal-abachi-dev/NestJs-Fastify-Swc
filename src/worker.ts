export default function dispatcher(job: { task: string; data: any }) {
  switch (job.task) {
    case 'fibonacci':
      return fibonacci(job.data);              // accepts number | number[]
    case 'hashPassword':
      return hashPassword(job.data as string);
    case 'compressImage':
      return compressImage(job.data as Buffer);
    default:
      throw new Error(`Unknown task ${job.task}`);
  }
}

function fibonacci(input: number | number[]): number | number[] {
  if (Array.isArray(input)) return input.map(calcFib);
  return calcFib(input);
}

function calcFib(n: number): number {
  if (n <= 1) return n;
  let a = 0,
    b = 1;
  for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
  return b;
}

function hashPassword(pwd: string): string {
  //demo ‑ replace with bcrypt or argon2 in prod
  return Buffer.from(pwd).toString('base64');
}

function compressImage(buf: Buffer): Buffer {
  //stub – do real compression (sharp / squoosh) here
  return buf.subarray(0, Math.ceil(buf.length / 2));
}