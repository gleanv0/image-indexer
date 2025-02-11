import React from "react";

interface ImageTilerProps {
  imageUrl: string;
  tileWidth: number;
  tileHeight: number;
}

export function ImageTiler({ imageUrl, tileWidth, tileHeight }: ImageTilerProps) {
  const [imageSize, setImageSize] = React.useState({ width: 0, height: 0 });

  // Load image dimensions
  React.useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [imageUrl]);

  if (imageSize.width === 0 || imageSize.height === 0) {
    return <p>Loading image...</p>;
  }

  const cols = Math.ceil(imageSize.width / tileWidth);
  const rows = Math.ceil(imageSize.height / tileHeight);

  return (
    <div className="relative overflow-hidden" style={{ width: imageSize.width, height: imageSize.height }}>
      {/* Background Image */}
      <img src={imageUrl} alt="Tiled" className="absolute top-0 left-0 w-full h-full object-cover border border-black" />

      {/* Grid Overlay */}
      {Array.from({ length: rows }).map((_, rowIndex) =>
        Array.from({ length: cols }).map((_, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className="absolute border border-red-500"
            style={{
              width: tileWidth,
              height: tileHeight,
              top: rowIndex * tileHeight,
              left: colIndex * tileWidth,
            }}
          />
        ))
      )}
    </div>
  );
};

export default ImageTiler;
