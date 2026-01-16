// Lightweight logger used across server utilities and route handlers.
// Falls back to console methods to avoid build failures when structured logging isn't available.
export const logger = {
  info: (...args: any[]) => console.info(...args),
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(...args)
    }
  },
}
