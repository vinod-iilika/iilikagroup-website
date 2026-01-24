import { ReactNode } from "react";

interface CardProps {
  children?: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  const hoverEffect = hover ? "hover:shadow-md" : "";

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-shadow duration-200 ${hoverEffect} ${className}`}>
      {children}
    </div>
  );
}
