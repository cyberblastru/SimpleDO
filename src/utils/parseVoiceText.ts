const SEPARATOR = /\s*(?:\+|плюс|plus|и)\s*/gi;

export function parseVoiceText(text: string): string[] {
  return text
    .replace(SEPARATOR, '|')
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean);
}
