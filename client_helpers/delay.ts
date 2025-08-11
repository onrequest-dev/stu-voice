export function randomDelay(maxSeconds: number): Promise<void> {
  const delay = Math.random() * maxSeconds * 1000; // من 0 إلى x ثواني (بالملي ثانية)
  return new Promise(resolve => setTimeout(resolve, delay));
}
