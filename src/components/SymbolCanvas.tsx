import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Entity, Layer, Point, ScaledTile, Tile, TileLocation } from '../types';
import CanvasLayer from './CanvasLayer';
import useRenderActions from '../hooks/useRenderActions';

export type SymbolCanvasProps = {
  spriteSheetSrc: string;
  layers: number;
  tileWidth: number;
  tileHeight: number;
  width: number;
  height: number;
};

const SymbolCanvas = ({
  spriteSheetSrc,
  layers,
  tileWidth,
  tileHeight,
  width,
  height,
}: SymbolCanvasProps) => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const [canvas2d, setCanvas2d] = useState<CanvasRenderingContext2D>(
  //   null as unknown as CanvasRenderingContext2D
  // );
  // const [canvasData, setCanvasData] = useState<Layer[]>([]);

  const canvasRefs = useRef(
    new Array(layers).fill(undefined).map(() => createRef<HTMLCanvasElement>())
  );

  const [canvasContexts, setContexts] = useState<
    Array<CanvasRenderingContext2D | undefined>
  >([]);

  const [canvasWidth, canvasHeight] = useMemo(() => {
    return [tileWidth * width, tileHeight * height];
  }, [height, tileHeight, tileWidth, width]);

  const image = useMemo(() => {
    const img = new Image();
    img.src = spriteSheetSrc;
    return img;
  }, [spriteSheetSrc]);

  useEffect(() => {
    const ctxs = canvasRefs.current.map((ref) => {
      if (ref.current === null) return;

      const ctx = ref.current.getContext('2d')!;

      // initalize image context
      ctx.imageSmoothingEnabled = false;

      return ctx;
    });

    setContexts(ctxs);
  }, []);

  // useEffect(() => {
  //   if (canvasRef.current === null) return;

  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext('2d')!;

  //   // initalize image context
  //   ctx.imageSmoothingEnabled = false;

  //   setCanvas2d(ctx);

  //   setCanvasData([
  //     {
  //       rawGrid: new Array(width).map(() => new Array(height).fill(undefined)),
  //     },
  //   ]);

  //   //   const image = new Image();
  //   //   image.src = spriteSheetSrc;

  //   //   image.onload = () => {
  //   //     // Clear the canvas
  //   //     ctx.clearRect(0, 0, canvas.width, canvas.height);

  //   //     // Draw the selected tile from the sprite sheet onto the canvas
  //   // ctx.drawImage(
  //   //   image,
  //   //   tileX * tileWidth,
  //   //   tileY * tileHeight,
  //   //   tileWidth,
  //   //   tileHeight,
  //   //   0,
  //   //   0,
  //   //   tileWidth,
  //   //   tileHeight
  //   // );
  //   //   };
  // }, [height, width]);

  const { draw, clearCanvas } = useRenderActions({
    canvasContexts,
    spriteSheet: image,
    canvasWidth,
    canvasHeight,
    tileWidth,
    tileHeight,
  });

  return (
    <div
      style={{ position: 'relative', width: canvasWidth, height: canvasHeight }}
    >
      {canvasRefs.current.map((ref, index) => (
        <CanvasLayer
          key={`${index}`}
          ref={ref}
          layer={index}
          width={canvasWidth}
          height={canvasHeight}
        />
      ))}
    </div>
  );
};

export default SymbolCanvas;
