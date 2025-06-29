import React, { createContext, useContext } from 'react';

type ResultUpdateContextType = {
  onResultUpdate: () => void;
};

export const ResultUpdateContext = createContext<ResultUpdateContextType>({
  onResultUpdate: () => {}
});

export const useResultUpdate = () => useContext(ResultUpdateContext);

export const ResultUpdateProvider: React.FC<{ 
  children: React.ReactNode;
  onResultUpdate: () => void;
}> = ({ children, onResultUpdate }) => {
  return (
    <ResultUpdateContext.Provider value={{ onResultUpdate }}>
      {children}
    </ResultUpdateContext.Provider>
  );
};