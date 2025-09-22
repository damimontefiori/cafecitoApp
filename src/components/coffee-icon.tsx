import { SVGProps } from 'react';

export function CoffeeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M8 8H4a4 4 0 0 0 0 8h4" />
      <path d="M14.5 22a2.5 2.5 0 0 1-5 0" />
      <path d="M18 16V8a6 6 0 0 0-12 0v8" />
    </svg>
  );
}
