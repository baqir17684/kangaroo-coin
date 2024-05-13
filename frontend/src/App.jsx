import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInSide from './components/Login/SignInSide';
import SignUp from './components/Register/SignUp';
import Presto from './components/Presto/Presto';
import PresentationEditor from './components/EditPresentation/PresentationEditor';

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignInSide />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/presto' element={<Presto />} />
        <Route path='/presto/EditPresentation/:presentationId' element={<PresentationEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
