import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TheIP from './components/TheIP';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App () {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path='/' element={<TheIP />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
