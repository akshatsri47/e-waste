'use client';

import { useEffect, useRef, useState, ElementType } from 'react';

export default function ScrollAnimation({
  children,
  className = '',
  style = {},
  as: Component = 'div',
  direction = 'up',
  delay = 0,
  duration = 0.8,
  startScale = 1,
  distance = 30,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  startScale?: number;
  distance?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  let transformStr = `translate(0, 0) scale(1)`;
  if (!isVisible) {
    if (direction === 'up') transformStr = `translate(0, ${distance}px) scale(${startScale})`;
    else if (direction === 'down') transformStr = `translate(0, -${distance}px) scale(${startScale})`;
    else if (direction === 'left') transformStr = `translate(-${distance}px, 0) scale(${startScale})`;
    else if (direction === 'right') transformStr = `translate(${distance}px, 0) scale(${startScale})`;
    else if (direction === 'none') transformStr = `translate(0, 0) scale(${startScale})`;
  }

  return (
    <Component
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: isVisible ? 1 : 0,
        transform: transformStr,
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Component>
  );
}
