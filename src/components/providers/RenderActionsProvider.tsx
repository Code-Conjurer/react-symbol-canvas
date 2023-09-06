import React, { useMemo, useState } from 'react';
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

  const value = useMemo(() => ({ actions, setActions }), [actions]);

  return (
    <RenderActionsProviderContext.Provider value={value}>
      {children}
    </RenderActionsProviderContext.Provider>
  );
};

export const useRenderActionsContext = () => {
  return React.useContext(RenderActionsProviderContext);
};
