import { JSX } from 'solid-js';

/* eslint-disable max-len */
export function Bell(props?: JSX.HTMLAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5 12C5.6875 12 6.25 11.4462 6.25 10.7692H3.75C3.75 11.4462 4.3125 12 5 12ZM8.75 8.30769V5.23077C8.75 3.34154 7.73125 1.76 5.9375 1.34154V0.923077C5.9375 0.412308 5.51875 0 5 0C4.48125 0 4.0625 0.412308 4.0625 0.923077V1.34154C2.275 1.76 1.25 3.33538 1.25 5.23077V8.30769L0 9.53846V10.1538H10V9.53846L8.75 8.30769ZM7.5 8.92308H2.5V5.23077C2.5 3.70462 3.44375 2.46154 5 2.46154C6.55625 2.46154 7.5 3.70462 7.5 5.23077V8.92308Z"
        fill="currentColor"
      />
    </svg>
  );
}
