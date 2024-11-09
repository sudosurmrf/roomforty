import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './HomePage.jsx'
import CatGallery from './CatGallery.jsx';
import Navbar from './Navbar.jsx';


const App = () => {

  

  return (
    <Router>
        <Navbar />
    
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<CatGallery />} />
      
       </Routes>
    </Router>
  )
}

export default App
