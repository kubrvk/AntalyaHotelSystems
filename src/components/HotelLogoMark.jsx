export default function HotelLogoMark({ size = 24, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={style}
    >
      <path
        d="M11 39V18.5L24 9L37 18.5V39"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 39H40"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M19 39V29.5C19 26.7 21.2 24.5 24 24.5C26.8 24.5 29 26.7 29 29.5V39"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 20H20.5M27.5 20H30.5"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d="M24 15.5L25.1 17.7L27.5 18.1L25.8 19.8L26.2 22.2L24 21.1L21.8 22.2L22.2 19.8L20.5 18.1L22.9 17.7L24 15.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
