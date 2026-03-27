export const debug = (message: any) => {
  const stack = new Error().stack?.split('\n')[2];
  const match = stack?.match(/\((.+):(\d+):(\d+)\)/);
  
  if (match) {
    const [, file, line, col] = match;
    console.log(`[${file}:${line}:${col}]`, message);
  }
};