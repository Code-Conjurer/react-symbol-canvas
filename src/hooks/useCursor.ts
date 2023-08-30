import { useEffect, useRef } from 'react';
import { RenderActions } from './useRenderActions';
import { Point, Tile } from '../types';

type UseCursorProps = {
  cursorTile: Tile;
  draw: RenderActions['draw'];
  move: RenderActions['move'];
  tileWidth: number;
  tileHeight: number;
  cursorLayer: number;
  canvasContainer: React.RefObject<HTMLDivElement>;
};

const useCurosr = ({
  cursorTile,
  draw,
  move,
  tileWidth,
  tileHeight,
  cursorLayer,
  canvasContainer,
}: UseCursorProps) => {
  const previousLoc = useRef<Point | null>(null);

  useEffect(() => {
    const maxX = canvasContainer.current?.clientWidth ?? -1;
    const maxY = canvasContainer.current?.clientHeight ?? -1;

    const handleMouseMove = (e: any) => {
      let x = e.offsetX;
      let y = e.offsetY;

      if (x < 0 || y < 0 || x >= maxX || y >= maxY) return;

      let point: Point = [
        Math.floor(x / tileWidth),
        Math.floor(y / tileHeight),
      ];

      if (previousLoc.current === null) {
        draw({ layer: cursorLayer, point, tile: cursorTile });
      } else {
        move({
          layer: cursorLayer,
          to: point,
          from: [previousLoc.current[0], previousLoc.current[1]],
        });
      }

      previousLoc.current = point;
    };

    canvasContainer.current?.addEventListener('mousemove', handleMouseMove);
    return () =>
      canvasContainer.current?.removeEventListener(
        'mousemove',
        handleMouseMove
      );
  }, [
    canvasContainer,
    cursorLayer,
    cursorTile,
    draw,
    move,
    tileHeight,
    tileWidth,
  ]);
};

export default useCurosr;
