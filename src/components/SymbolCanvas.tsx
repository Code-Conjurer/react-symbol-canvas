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
import { useRenderActionsContext } from './providers/RenderActionsProvider';

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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRefs = useMemo(
    () =>
      // add 2 layers for cursor and effects layers
      new Array(layers + 2)
        .fill(undefined)
        .map(() => createRef<HTMLCanvasElement>()),
    [layers]
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
    const ctxs = canvasRefs.map((ref, index) => {
      if (ref.current === null) return;

      const ctx = ref.current.getContext('2d', { willReadFrequently: true })!;

      // initalize image context
      ctx.imageSmoothingEnabled = false;

      return ctx;
    });

    setContexts(ctxs);
  }, [canvasRefs]);

  const actions = useRenderActions({
    canvasContexts,
    spriteSheet: image,
    canvasWidth,
    canvasHeight,
    tileWidth,
    tileHeight,
  });

  useCurosr({
    cursorTile: {
      tileImageX: 8,
      tileImageY: 5,
      color: [0, 0, 0, 255],
      highlight: [199, 166, 22, 255],
    },
    cursorLayer: layers + 1,
    tileWidth,
    tileHeight,
    draw: actions.draw,
    move: actions.move,
    canvasContainer: containerRef,
  });

  const { setActions } = useRenderActionsContext();

  useEffect(() => {
    setActions(actions);
  }, [actions, setActions]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: canvasWidth,
        height: canvasHeight,
        cursor: 'none',
      }}
    >
      {canvasRefs.map((ref, index) => (
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
