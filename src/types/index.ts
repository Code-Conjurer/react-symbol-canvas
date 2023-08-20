export type SymbolCanvasProps = {
  spriteSheetSrc: string;
  tileWidth: number;
  tileHeight: number;
  width: number;
  height: number;
};

export type Point = [number, number];

export type Tile = {
  origin?: Entity;
};

export type TileLocation = {
  x: number;
  y: number;
  tile: Tile;
};

export type Entity = {
  start: Tile;
  tiles: TileLocation[];
};

export type ScaledTile = {
  width: number;
  height: number;
  tile: Tile;
};

export type Layer = {
  rawGrid: (Tile | undefined)[][];
};
