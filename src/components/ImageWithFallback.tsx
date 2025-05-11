'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends Omit<ImageProps, 'src' | 'onError'> {
  src: string;
  fallbackSrc: string;
}

/**
 * Image component that automatically falls back to a local image if the primary source fails to load
 * This helps prevent broken images in production deployments
 */
const ImageWithFallback = ({
  src,
  fallbackSrc,
  alt,
  ...rest
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  useEffect(() => {
    setImgSrc(src);
    setHasLoaded(false);
  }, [src]);

  // Error handling function for when image fails to load
  const handleError = () => {
    // Only apply fallback if we haven't already tried to load it once
    if (!hasLoaded) {
      console.log(`Image load failed for: ${src}, using fallback: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
      setHasLoaded(true);
    }
  };

  // Handle absolute URLs for both public folder and external resources
  const resolvedSrc = imgSrc.startsWith('http') || imgSrc.startsWith('/') 
    ? imgSrc 
    : `/${imgSrc}`;

  return (
    <Image
      {...rest}
      src={resolvedSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

export default ImageWithFallback;