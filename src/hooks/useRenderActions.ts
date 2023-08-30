import { useCallback, useMemo } from 'react';
import { Color, Point, ScaledTile, Tile } from '../types';
import { colorToHex } from '../support/colorUtils';

type ClearLayerProps = {
  layer: number;
};

type DrawProps = {
  layer: number;
  point: Point;
  scaledTile?: ScaledTile;
  tile?: Tile;
};

type FillProps = {
  layer: number;
  point: Point;
  color: Color;
  width?: number;
  height?: number;
};

type ColorProps = {
  layer: number;
  point: Point;
  color: Color;
  exclude?: Color;
  width?: number;
  height?: number;
};

type ClearProps = {
  layer: number;
  point: Point;
  width?: number;
  height?: number;
};

type MoveProps = {
  layer: number;
  from: Point;
  to: Point;
  width?: number;
  height?: number;
};

export type RenderActions = {
  clearLayer: ({ layer }: ClearLayerProps) => void;
  draw: ({ layer, point, scaledTile, tile }: DrawProps) => void;
  fill: ({ layer, point, color, width, height }: FillProps) => void;
  color: ({ layer, point, color, width, height }: ColorProps) => void;
  clear: ({ layer, point, width, height }: ClearProps) => void;
  move: ({ layer, from, to, width, height }: MoveProps) => void;
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
}: UseRenderActionsType): RenderActions => {
  const clearLayer = useCallback(
    ({ layer }: ClearLayerProps) => {
      canvasContexts[layer]?.clearRect(0, 0, canvasWidth, canvasHeight);
    },
    [canvasContexts, canvasHeight, canvasWidth]
  );

  const color = useCallback(
    ({ layer, point: [x, y], color, exclude, width, height }: ColorProps) => {
      const ctx = canvasContexts[layer];

      if (!ctx) return;

      const pixelWidth = tileWidth * (width ?? 1);
      const pixelHeight = tileHeight * (height ?? 1);
      const pixelX = x * tileWidth;
      const pixelY = y * tileHeight;

      const image = ctx.getImageData(pixelX, pixelY, pixelWidth, pixelHeight);

      for (let i = 0; i < image.data.length; i += 4) {
        const excludeCond =
          !!exclude &&
          (exclude[0] !== image.data[i] ||
            exclude[1] !== image.data[i + 1] ||
            exclude[2] !== image.data[i + 2] ||
            exclude[3] !== image.data[i + 3]);

        if ((!exclude && image.data[i + 3] > 0) || excludeCond) {
          image.data[i] = color[0];
          image.data[i + 1] = color[1];
          image.data[i + 2] = color[2];
          image.data[i + 3] = color[3];
        }
      }

      ctx.putImageData(image, pixelX, pixelY);
    },
    [canvasContexts, tileHeight, tileWidth]
  );

  const fill = useCallback(
    ({ layer, point: [x, y], color, width, height }: FillProps) => {
      const ctx = canvasContexts[layer];

      if (!ctx) return;

      const pixelWidth = tileWidth * (width ?? 1);
      const pixelHeight = tileHeight * (height ?? 1);
      const pixelX = x * tileWidth;
      const pixelY = y * tileHeight;

      ctx.fillStyle = colorToHex(color);
      ctx.fillRect(pixelX, pixelY, pixelWidth, pixelHeight);
    },
    [canvasContexts, tileHeight, tileWidth]
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

      const pixelX = x * tileWidth;
      const pixelY = y * tileHeight;

      if (t?.highlight) {
        fill({
          layer,
          point: [x, y],
          color: t.highlight,
          width: scaledTile?.width,
          height: scaledTile?.height,
        });
      }

      canvasContexts[layer]?.drawImage(
        spriteSheet,
        // sprite from sheet
        t!.tileImageX * tileWidth,
        t!.tileImageY * tileHeight,
        tileWidth,
        tileHeight,
        // canvas draw location
        pixelX,
        pixelY,
        width,
        height
      );

      if (t?.color) {
        color({
          layer,
          point: [x, y],
          color: t.color,
          exclude: t.highlight,
          width: scaledTile?.width,
          height: scaledTile?.height,
        });
      }
    },
    [canvasContexts, color, fill, spriteSheet, tileHeight, tileWidth]
  );

  const clear = useCallback(
    ({ layer, point: [x, y], width, height }: ClearProps) => {
      const ctx = canvasContexts[layer];
      if (!ctx) return;

      const pixelWidth = tileWidth * (width ?? 1);
      const pixelHeight = tileHeight * (height ?? 1);
      const pixelX = x * tileWidth;
      const pixelY = y * tileHeight;

      ctx.clearRect(pixelX, pixelY, pixelWidth, pixelHeight);
    },
    [canvasContexts, tileHeight, tileWidth]
  );

  const move = useCallback(
    ({ layer, from, to, width, height }: MoveProps) => {
      const ctx = canvasContexts[layer];

      if (!ctx) return;

      const pixelWidth = tileWidth * (width ?? 1);
      const pixelHeight = tileHeight * (height ?? 1);
      const fromX = from[0] * tileWidth;
      const fromY = from[1] * tileHeight;
      const toX = to[0] * tileWidth;
      const toY = to[1] * tileHeight;

      const image = ctx.getImageData(fromX, fromY, pixelWidth, pixelHeight);
      clear({ layer, point: from, width, height });
      ctx.putImageData(image, toX, toY);

      // const isPositiveTransposeX = fromX < toX;
      // const isPositiveTransposeY = fromY < toY;

      // const pasteImage = ctx.getImageData(
      //   isPositiveTransposeX ? fromX : toX,
      //   isPositiveTransposeY ? fromY : toY,
      //   Math.abs(fromX - toX) + pixelWidth,
      //   Math.abs(fromY - toY) + pixelHeight
      //   // { colorSpace: cutImage.colorSpace }
      // );

      // console.log('🙂');

      // // for (let i = 0; i < cutImage.data.length; i++) {
      // //   const xTranspose = isPositiveTransposeX ? toX * 4 * pasteImage.width : 0;
      // //   const yTranspose = isPositiveTransposeY ? toY * 4 : 0;
      // //   pasteImage.data[xTranspose + yTranspose + i] = cutImage.data[i];
      // // }

      // for (let i = 0; i < pixelWidth * 4; i++) {
      //   for (let j = 0; j < pixelHeight * 4; j++) {
      //     const xSrcOffset = !isPositiveTransposeX ? (fromX - toX) * 4 : 0;
      //     const ySrcOffset = !isPositiveTransposeY ? (fromY - toY) * 4 : 0;

      //     const xDestOffset = isPositiveTransposeX ? (toX - fromX) * 4 : 0;
      //     const yDestOffset = isPositiveTransposeY ? (toY - fromY) * 4 : 0;
      //     // pasteImage.data[
      //     //   i + j * (pasteImage.width * 4) + xOffset + yOffset * pasteImage.width
      //     // ] = cutImage.data[i + j * (cutImage.width * 4)];

      //     // pasteImage.data[
      //     //   i + j * (pasteImage.width * 4) + xOffset + yOffset * pasteImage.width
      //     // ];

      //     const srcIndex = i + j * (pasteImage.width * 4); //+
      //     xSrcOffset + ySrcOffset * pasteImage.width;

      //     const destIndex =
      //       i +
      //       j * (pasteImage.width * 4) +
      //       xDestOffset +
      //       yDestOffset * pasteImage.width;

      //     pasteImage.data[destIndex] = pasteImage.data[srcIndex];
      //     pasteImage.data[srcIndex] = 0;
      //   }
      // }

      // ctx.putImageData(
      //   pasteImage,
      //   isPositiveTransposeX ? fromX : toX,
      //   isPositiveTransposeY ? fromY : toY
      //   // isPositiveTransposeX ? fromX : toX - pixelWidth,
      //   // isPositiveTransposeY ? fromY : toY - pixelHeight
      // );
    },
    [canvasContexts, clear, tileHeight, tileWidth]
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

  const result = useMemo(() => {
    return {
      clearLayer,
      draw,
      fill,
      color,
      clear,
      move,
    };
  }, [clear, clearLayer, color, draw, fill, move]);
  return result;
};

export default useRenderActions;
