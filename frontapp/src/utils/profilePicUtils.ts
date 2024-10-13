// src/utils/profilePicUtils.ts
import ct from '../assets/Emojis/2.svg';
import sm from '../assets/Emojis/1.svg';
import nt from '../assets/Emojis/4.svg';
import sd from '../assets/Emojis/5.svg';
import dn from '../assets/Emojis/3.svg';

/**
 * Determines the profile picture URL based on the mood value.
 * @param mood - The user's mood value (0-100).
 * @returns The corresponding profile picture URL.
 */
export const getProfilePicUrl = (mood: number): string => {
  if (mood > 80) return ct;
  if (mood > 66) return sm;
  if (mood > 50) return sd;
  if (mood > 25) return dn;
  return nt;
};
