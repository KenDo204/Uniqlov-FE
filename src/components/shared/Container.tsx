import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
}

export function Container({ children, fluid = false, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto",
        !fluid && "lg:max-w-[1052px] xl:max-w-[1200px]",
        // Mobile (< 768px): px-3 (12px)
        // Tablet (768px - 1024px): md:px-4 (16px)
        // Desktop (1024px - 1280px): lg:px-4 (16px) -> kế thừa từ md
        // Large (>= 1280px): xl:px-3 (12px)
        "px-3 md:px-4 xl:px-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
