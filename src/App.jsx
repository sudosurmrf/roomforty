import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx'
import CatGallery from './CatGallery.jsx';


const App = () => {

  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cats" element={<CatGallery />} />
      
      </Routes>
     
    
    </Router>
  )
}

export default App
