/* eslint-disable react/display-name */
import React from 'react';

type CanvasLayerType = {
  layer: number;
  width: number;
  height: number;
};

const CanvasLayer = React.forwardRef<HTMLCanvasElement, CanvasLayerType>(
  ({ layer, width, height }, ref) => {
    return (
      <canvas
        style={{ position: 'absolute', zIndex: layer, border: '1px solid red' }}
        ref={ref}
        width={width}
        height={height}
      />
    );
  }
);

export default CanvasLayer;
