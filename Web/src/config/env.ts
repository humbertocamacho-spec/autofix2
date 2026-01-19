// Environment variables
export const VITE_API_URL: string = import.meta.env.VITE_API_URL as string;

if (!VITE_API_URL) {
  throw new Error("VITE_API_URL is missing. Define it in your .env file.");
}
