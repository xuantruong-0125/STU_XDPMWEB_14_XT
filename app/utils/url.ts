export const BASE_URL = "https://web-pgb0.onrender.com";

export const getImageUrl = (path?: string) => {
  if (!path) return "/default_avatar.png";

  if (path.startsWith("blob:")) return path;

  if (path.startsWith("http")) return path;

  if (path.startsWith("/storage")) {
     return `${BASE_URL}${path}`;
  }

  return `${BASE_URL}/storage/${path}`;
};