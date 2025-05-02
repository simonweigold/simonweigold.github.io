declare module 'react-scroll' {
  import { ComponentType, ReactNode } from 'react';

  interface ScrollLinkProps {
    to: string;
    smooth?: boolean;
    duration?: number;
    style?: React.CSSProperties;
    children: ReactNode;
  }

  export const Link: ComponentType<ScrollLinkProps>;
} 