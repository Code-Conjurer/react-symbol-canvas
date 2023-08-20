import { useCallback } from 'react';
import { Entity, Point, ScaledTile, Tile, TileLocation } from '../types';

const useRenderActions = () => {
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
};

export default useRenderActions;
