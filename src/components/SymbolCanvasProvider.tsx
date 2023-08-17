import React from 'react';

type SymbolCanvasContext = {};

const SymbolCanvasContext = React.createContext<SymbolCanvasContext>({});

const SymbolCanvasProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <SymbolCanvasContext.Provider value={{}}>
      {children}
    </SymbolCanvasContext.Provider>
  );
};

export const useSymbolCanvasContext = () => {
  return React.useContext(SymbolCanvasContext);
};

export default SymbolCanvasProvider;
