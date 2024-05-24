import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSide from './components/Login/SignInSide';
import SignUp from './components/Register/SignUp';
import Presto from './components/Presto/Presto';
import PresentationEditor from './components/EditPresentation/PresentationEditor';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App () {
  return (
    <DndProvider backend={HTML5Backend}>
      <Router>
        <Routes>
          <Route path='/' element={<SignInSide />} />
          <Route path='/register' element={<SignUp />} />
          <Route path='/presto' element={<Presto />} />
          <Route path='/presto/EditPresentation/:presentationId' element={<PresentationEditor />} />
        </Routes>
      </Router>
    </DndProvider>
  );
}

export default App;
