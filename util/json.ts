import sjson from 'secure-json-parse';
import type { FruitComment } from '../app/fruits/[fruitId]/actions';

export function parseJson(json: string | undefined) {
  if (!json) return undefined;
  try {
    // Type assertion ("lying to TypeScript") - try to avoid
    return sjson(json) as FruitComment[] | boolean;
  } catch {
    return undefined;
  }
}
