import React, { useState, useEffect } from 'react';
import { DEFAULT_AVATAR_URL, FALLBACK_AVATAR_URL } from '../utils/avatarUtils';

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'custom';
  className?: string;
  ringColor?: string;
  showOnlineStatus?: boolean;
  onClick?: () => void;
  title?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 sm:w-20 sm:h-20 text-base',
  '2xl': 'w-24 h-24 text-lg',
  custom: '',
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = 'User',
  size = 'md',
  className = '',
  ringColor,
  showOnlineStatus = false,
  onClick,
  title,
}) => {
  const initialSrc =
    src && src !== '/user_avatar.jpg' && src.trim() !== '' ? src : DEFAULT_AVATAR_URL;
  const [currentSrc, setCurrentSrc] = useState<string>(initialSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const validSrc =
      src && src !== '/user_avatar.jpg' && src.trim() !== '' ? src : DEFAULT_AVATAR_URL;
    setCurrentSrc(validSrc);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(FALLBACK_AVATAR_URL);
    }
  };

  const ringStyle = ringColor ? ringColor : '';

  return (
    <div
      onClick={onClick}
      title={title || alt}
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-full ${
        size !== 'custom' ? sizeClasses[size] : ''
      } ${ringStyle} ${className}`}
    >
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={handleError}
        className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
      />
      {showOnlineStatus && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </div>
  );
};
