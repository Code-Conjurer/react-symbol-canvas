export type Point = [number, number];

export type Tile = {
  tileImageX: number;
  tileImageY: number;
};

export type TileLocation = {
  x: number;
  y: number;
  tile: Tile;
};

export type ScaledTile = {
  width: number;
  height: number;
  tile: Tile;
};

export type Layer = {
  rawGrid: (Tile | ScaledTile | undefined)[][];
};
