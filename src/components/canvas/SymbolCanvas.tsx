import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type SymbolCanvasProps = {
  spriteSheetSrc: string;
  tileWidth: number;
  tileHeight: number;
  width: number;
  height: number;
};

type Point = [number, number];

type Tile = {
  origin?: Entity;
};

type TileLocation = {
  x: number;
  y: number;
  tile: Tile;
};

type Entity = {
  start: Tile;
  tiles: TileLocation[];
};

type ScaledTile = {
  width: number;
  height: number;
  tile: Tile;
};

type Layer = {
  rawGrid: (Tile | undefined)[][];
};

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
    ([x, y]: Point, obj: TileLocation | Entity | ScaledTile) => {
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
        0 * tileWidth,
        0 * tileHeight,
        tileWidth,
        tileHeight,

        // canvas draw location
        x,
        y,
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
  }, []);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />;
};

export default SymbolCanvas;
