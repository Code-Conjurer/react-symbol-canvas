import React from 'react';

type ActionsProviderContext = {};

const ActionsProviderContext = React.createContext<ActionsProviderContext>({});

export const ActionsProviderProvider = ({
  children,
}: React.PropsWithChildren) => {
  return (
    <ActionsProviderContext.Provider value={{}}>
      {children}
    </ActionsProviderContext.Provider>
  );
};

const useCanvasActions = () => {
  return React.useContext(ActionsProviderContext);
};

export default useCanvasActions;
