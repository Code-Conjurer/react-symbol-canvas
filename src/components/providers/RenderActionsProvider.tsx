import React, { useState } from 'react';
import { RenderActions } from '../../hooks/useRenderActions';

type RenderActionsProviderContext = {
  actions: RenderActions;
  setActions: (actions: RenderActions) => void;
};

const actionsStub: RenderActions = {
  clearLayer: () => {},
  draw: () => {},
  fill: () => {},
  color: () => {},
  clear: () => {},
  move: () => {},
};

const RenderActionsProviderContext =
  React.createContext<RenderActionsProviderContext>({
    actions: actionsStub,
    setActions: () => {},
  });

export const RenderActionsProviderProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [actions, setActions] = useState<RenderActions>(actionsStub);

  return (
    <RenderActionsProviderContext.Provider value={{ actions, setActions }}>
      {children}
    </RenderActionsProviderContext.Provider>
  );
};

export const useRenderActions = () => {
  return React.useContext(RenderActionsProviderContext);
};
