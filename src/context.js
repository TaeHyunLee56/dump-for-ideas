import React, { createContext, useState } from 'react';

// Context 생성
export const ApiKeyContext = createContext();

// Context Provider 컴포넌트 생성
export const ApiKeyProvider = ({ children }) => {
  // API 키를 Context로만 관리 (localStorage 사용 안 함)
  const [apiKey, setApiKey] = useState(null);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};