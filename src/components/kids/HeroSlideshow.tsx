"use client";

import { useEffect, useState } from "react";

interface Props {
  images: string[];
  intervalMs?: number;
}

export default function HeroSlideshow({ images, intervalMs = 4000 }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  return (
    <div className="absolute inset-0">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}
    </div>
  );
}
