export function urlJoin(...parts: string[]): string {
  return parts
    .map((part) => part.replace(/(^\/+|\/+$)/g, '')) // Remove leading/trailing slashes from each part
    .filter((part) => part.length > 0) // Remove any empty parts
    .join('/'); // Join parts with a single slash
}
