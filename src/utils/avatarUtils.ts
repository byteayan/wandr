export const PRESET_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Ayan (Explorer)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    name: 'Adventurer (Outdoor)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    name: 'Wanderer (Minimalist)',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    name: 'City Nomad (Urban)',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-5',
    name: 'Photographer (Scenic)',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-6',
    name: 'Sun Chaser (Coast)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
];

export const DEFAULT_AVATAR_URL = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';
export const FALLBACK_AVATAR_URL = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';

/**
 * Returns a safe avatar URL.
 */
export function getSafeAvatarUrl(avatar?: string | null): string {
  if (!avatar || avatar.trim() === '' || avatar === '/user_avatar.jpg') {
    return DEFAULT_AVATAR_URL;
  }
  return avatar;
}
