import React from 'react';
import ReactDOM from 'react-dom/client';

import {BrowserRouter, Routes, Route} from 'react-router-dom';

import MainPage from './component/page/MainPage';
import CanvasPage from './component/page/CanvasPage'
import AddCardPage from './component/page/AddCardPage';

import CardList from './component/ui/CardList';

import { ApiKeyProvider } from './context';
import { CardProvider } from './context/CardContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApiKeyProvider>
    <CardProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<MainPage/>}/>
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="canvas/addcard" element={<AddCardPage />} />
        </Routes>
      </BrowserRouter>
    </CardProvider>
  </ApiKeyProvider>
);
