import { useCallback } from 'react';
import { Entity, Point, ScaledTile, Tile, TileLocation } from '../types';

type ClearCanvasProps = {
  layer: number;
};

type DrawProps = {
  layer: number;
  point: Point;
  entity?: Entity;
  scaledTile?: ScaledTile;
  tile?: Tile;
};

type Actions = {
  clearCanvas: (props: ClearCanvasProps) => void;
  draw: (props: DrawProps) => void;
};

type UseRenderActionsType = {
  canvasContexts: Array<CanvasRenderingContext2D | undefined>;
  spriteSheet: HTMLImageElement;
  canvasWidth: number;
  canvasHeight: number;
  tileWidth: number;
  tileHeight: number;
};

const useRenderActions = ({
  canvasContexts,
  spriteSheet,
  canvasWidth,
  canvasHeight,
  tileWidth,
  tileHeight,
}: UseRenderActionsType): Actions => {
  const clearCanvas = useCallback(
    ({ layer }: ClearCanvasProps) => {
      canvasContexts[layer]?.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    [canvasContexts, canvasHeight, canvasWidth]
  );

  const draw = useCallback(
    ({ layer, point: [x, y], entity, scaledTile, tile }: DrawProps) => {
      if (entity) {
        for (let i = 0; i < entity.tiles.length; i++) {
          const tileLoc = entity.tiles[i];
          draw({
            layer,
            point: [x + tileLoc.x, y + tileLoc.y],
            tile: tileLoc.tile,
          });
        }
        return;
      }

      let width = tileWidth;
      let height = tileHeight;
      let t = tile;

      if (scaledTile) {
        width = tileWidth * scaledTile.width;
        height = tileHeight * scaledTile.height;
        t = scaledTile.tile;
      }

      canvasContexts[layer]?.drawImage(
        spriteSheet,
        // sprite from sheet
        t!.tileImageX * tileWidth,
        t!.tileImageY * tileHeight,
        tileWidth,
        tileHeight,
        // canvas draw location
        x * tileWidth,
        y * tileHeight,
        width,
        height
      );
    },
    [canvasContexts, spriteSheet, tileHeight, tileWidth]
  );

  // const drawLayer = useCallback(
  //   (layerIndex: number) => {
  //     const layer = canvasData[layerIndex];
  //     if (layer === undefined) return;

  //     const grid = layer.rawGrid;
  //     for (let i = 0; i < grid.length; i++) {
  //       for (let j = 0; j < grid[i].length; j++) {}
  //     }
  //   },
  //   [canvasData]
  // );

  return { clearCanvas, draw };
};

export default useRenderActions;
