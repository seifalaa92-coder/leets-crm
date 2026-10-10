import Image from "next/image";

interface LeetsWordmarkProps {
  variant?: "dark" | "white";
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Authentic Leets Angular Wordmark.
 * Exactly preserves the original geometry from the supplied artwork.
 * - variant "dark": deep navy (#111F35) wordmark on light backgrounds.
 * - variant "white": pure white wordmark on navy/dark backgrounds.
 * Native aspect ratio is 1116 : 419 (~2.66).
 */
export function LeetsWordmark({
  variant = "dark",
  width = 110,
  height = 41,
  className = "",
  priority = false,
}: LeetsWordmarkProps) {
  const src = variant === "white" ? "/leets-wordmark-white.png" : "/leets-wordmark-dark.png";

  return (
    <Image
      src={src}
      alt="Leets"
      width={width}
      height={height}
      priority={priority}
      className={`inline-block object-contain ${className}`}
      style={{
        aspectRatio: "1116 / 419",
        width: `${width}px`,
        height: "auto",
      }}
    />
  );
}

export default LeetsWordmark;
