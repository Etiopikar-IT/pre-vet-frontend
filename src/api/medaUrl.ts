const API_URL = import.meta.env.VITE_API_URL 
const BACKEND_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${BACKEND_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}