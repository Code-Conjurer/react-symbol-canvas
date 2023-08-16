import React, { useEffect, useRef } from 'react';

type SymbolCanvasProps = {
  spriteSheetSrc: string;
  tileWidth: number;
  tileHeight: number;
  tileX: number;
  tileY: number;
};

const SymbolCanvas = ({
  spriteSheetSrc,
  tileWidth,
  tileHeight,
  tileX,
  tileY,
}: SymbolCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    const image = new Image();
    image.src = spriteSheetSrc;

    image.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the selected tile from the sprite sheet onto the canvas
      ctx.drawImage(
        image,
        tileX * tileWidth,
        tileY * tileHeight,
        tileWidth,
        tileHeight,
        0,
        0,
        tileWidth,
        tileHeight
      );
    };
  }, [tileWidth, tileHeight, tileX, tileY, spriteSheetSrc]);

  return <canvas ref={canvasRef} width={tileWidth} height={tileHeight} />;
};

export default SymbolCanvas;
