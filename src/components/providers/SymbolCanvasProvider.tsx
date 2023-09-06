import React from 'react';
import { RenderActions } from '../../hooks/useRenderActions';
import {
  RenderActionsProviderProvider,
  useRenderActionsContext,
} from './RenderActionsProvider';

type SymbolCanvasProviderContext = RenderActions;

const SymbolCanvasProviderContext =
  React.createContext<SymbolCanvasProviderContext | null>(null);

export const SymbolCanvasProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <RenderActionsProviderProvider>
      <ProviderWrapper>{children}</ProviderWrapper>
    </RenderActionsProviderProvider>
  );
};

const ProviderWrapper = ({ children }: React.PropsWithChildren) => {
  const { actions } = useRenderActionsContext();

  return (
    <SymbolCanvasProviderContext.Provider value={actions}>
      {children}
    </SymbolCanvasProviderContext.Provider>
  );
};

export const useSymbolCanvasContext = () => {
  return React.useContext(SymbolCanvasProviderContext);
};
