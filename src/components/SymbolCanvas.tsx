import React, {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Layer, Point, ScaledTile, Tile, TileLocation } from '../types';
import CanvasLayer from './CanvasLayer';
import useRenderActions from '../hooks/useRenderActions';
import useCurosr from '../hooks/useCursor';

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

  const { draw, color, highlight, move, clearLayer, clear } = useRenderActions({
    canvasContexts,
    spriteSheet: image,
    canvasWidth,
    canvasHeight,
    tileWidth,
    tileHeight,
  });

  useCurosr();

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
