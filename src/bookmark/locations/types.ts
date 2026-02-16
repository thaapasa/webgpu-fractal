/**
 * Famous Location Types
 *
 * "Types for the greatest hits of chaos theory."
 * - Skippy the Magnificent
 */

import { BookmarkState } from '../BookmarkManager';

export interface FamousLocation {
  name: string;
  description: string;
  key: string; // Keyboard shortcut (1-9)
  state: BookmarkState;
}
