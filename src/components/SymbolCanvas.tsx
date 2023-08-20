import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Entity,
  Layer,
  Point,
  ScaledTile,
  SymbolCanvasProps,
  Tile,
  TileLocation,
} from '../types';

const SymbolCanvas = ({
  spriteSheetSrc,
  tileWidth,
  tileHeight,
  width,
  height,
}: SymbolCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas2d, setCanvas2d] = useState<CanvasRenderingContext2D>(
    null as unknown as CanvasRenderingContext2D
  );
  const [canvasData, setCanvasData] = useState<Layer[]>([]);

  const [canvasWidth, canvasHeight] = useMemo(() => {
    return [tileWidth * width, tileHeight * height];
  }, [height, tileHeight, tileWidth, width]);

  const image = useMemo(() => {
    const img = new Image();
    img.src = spriteSheetSrc;
    return img;
  }, [spriteSheetSrc]);

  const clearCanvas = useCallback(() => {
    canvas2d.clearRect(0, 0, canvasWidth, canvasHeight);
  }, [canvas2d, canvasHeight, canvasWidth]);

  const draw = useCallback(
    ([x, y]: Point, obj: Entity | ScaledTile | Tile | TileLocation) => {
      let width = tileWidth;
      let height = tileHeight;

      if ('start' in obj) {
        for (let i = 0; i < obj.tiles.length; i++) {
          const tile = obj.tiles[i];
          draw([x + tile.x, y + tile.y], obj.tiles[i]);
        }
        return;
      } else if ('width' in obj) {
        width = tileWidth * obj.width;
        height = tileHeight * obj.height;
      }
      canvas2d.drawImage(
        image,
        // sprite from sheet
        1 * tileWidth,
        0 * tileHeight,
        tileWidth,
        tileHeight,

        // canvas draw location
        x * tileWidth,
        y * tileHeight,
        width,
        height
      );
    },
    [canvas2d, image, tileHeight, tileWidth]
  );

  const drawLayer = useCallback(
    (layerIndex: number) => {
      const layer = canvasData[layerIndex];
      if (layer === undefined) return;

      const grid = layer.rawGrid;
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {}
      }
    },
    [canvasData]
  );

  useEffect(() => {
    if (canvasRef.current === null) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;

    // initalize image context
    ctx.imageSmoothingEnabled = false;

    setCanvas2d(ctx);

    setCanvasData([
      {
        rawGrid: new Array(width).map(() => new Array(height).fill(undefined)),
      },
    ]);

    //   const image = new Image();
    //   image.src = spriteSheetSrc;

    //   image.onload = () => {
    //     // Clear the canvas
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);

    //     // Draw the selected tile from the sprite sheet onto the canvas
    // ctx.drawImage(
    //   image,
    //   tileX * tileWidth,
    //   tileY * tileHeight,
    //   tileWidth,
    //   tileHeight,
    //   0,
    //   0,
    //   tileWidth,
    //   tileHeight
    // );
    //   };
  }, [height, width]);

  useEffect(() => {
    if (canvas2d === null) return;

    setTimeout(() => {
      const tile: Tile = {};
      const scaled: ScaledTile = { width: 3, height: 3, tile };

      draw([0, 0], tile);
      draw([0, 1], tile);
      draw([1, 0], tile);
      draw([1, 1], scaled);
    }, 2000);
  }, [canvas2d, draw]);

  return (
    <canvas
      style={{ border: '1px solid red' }}
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
};

export default SymbolCanvas;
