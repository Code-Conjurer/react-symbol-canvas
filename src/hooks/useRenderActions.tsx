import { useCallback } from 'react';
import { Point, ScaledTile, Tile, TileLocation } from '../types';

type ClearLayerProps = {
  layer: number;
};

type DrawProps = {
  layer: number;
  point: Point;
  scaledTile?: ScaledTile;
  tile?: Tile;
};

type MoveProps = {};

type Actions = {
  clearLayer: (props: ClearLayerProps) => void;
  draw: (props: DrawProps) => void;
  move: (props: MoveProps) => void;
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
  const clearLayer = useCallback(
    ({ layer }: ClearLayerProps) => {
      canvasContexts[layer]?.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    [canvasContexts, canvasHeight, canvasWidth]
  );

  const draw = useCallback(
    ({ layer, point: [x, y], scaledTile, tile }: DrawProps) => {
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

  const move = ({}: MoveProps) => {};

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

  return { clearLayer, draw, move };
};

export default useRenderActions;
