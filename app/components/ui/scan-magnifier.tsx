import React, { useRef, useState } from "react";

interface ScanMagnifierProps {
  imageSrc: string;
  magnifierSize?: number;
  zoom?: number;
  borderColor?: string;
  glowColor?: string;
  className?: string;
}

const ScanMagnifier: React.FC<ScanMagnifierProps> = ({
  imageSrc,
  magnifierSize = 140,
  zoom = 2,
  borderColor = "#3B82F6", // Tailwind blue-500
  glowColor = "rgba(59, 130, 246, 0.4)",
  scanColor = borderColor,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [showLens, setShowLens] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      <img
        src={imageSrc}
        alt="scanned"
        className="w-full h-full object-cover select-none"
      />

      {showLens && containerRef.current && (
        <div
            className="absolute rounded-full pointer-events-none"
            style={{
            width: magnifierSize,
            height: magnifierSize,
            left: lensPos.x - magnifierSize / 2,
            top: lensPos.y - magnifierSize / 2,
            border: `2px solid ${scanColor}`,
            boxShadow: `0 0 20px ${scanColor}`,
            backgroundImage: `url(${imageSrc})`,
            backgroundRepeat: "no-repeat",
            // use the *natural* image ratio for background scaling
            backgroundSize: `${
                containerRef.current.offsetWidth * 2
            }px ${containerRef.current.offsetHeight * 2}px`,
            // fix alignment so entire image zooms correctly
            backgroundPosition: `${
                -(lensPos.x / containerRef.current.offsetWidth) * 
                containerRef.current.offsetWidth * 2 +
                magnifierSize / 2
            }px ${
                -(lensPos.y / containerRef.current.offsetHeight) * 
                containerRef.current.offsetHeight * 2 +
                magnifierSize / 2
            }px`,
            backgroundClip: "content-box",
            transition: "background-position 0.05s ease-out",
            }}
        />
        )}

    </div>
  );
};

export default ScanMagnifier;
