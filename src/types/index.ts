export type Point = [number, number];

export type Tile = {
  tileImageX: number;
  tileImageY: number;
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
  rawGrid: (Tile | Entity | ScaledTile | undefined)[][];
};
