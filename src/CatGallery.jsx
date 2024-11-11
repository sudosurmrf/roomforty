import React, { useEffect, useState } from 'react';
import './CatGallery.css';


const CatGallery = () => {
    const [photos, setPhotos] = useState([]);


    const getPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        // Sort the photos by distance based on hamming and hashing
        result.sort((a, b) => a.distance - b.distance);
        
        setPhotos(result);
      } catch (err) {
        console.error("Couldn't get the photos: ", err);
      }
    };
    
    
    useEffect(() => {
      getPhotos();
      
    }, []);

    return (
      <div className="container">
        <h1>Cat Photo Gallery</h1>
        <div className="gallery">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <div key={index} className="photo-card">
                <img src={photo.url} alt={`Cat ${index + 1}`} />
                <p>Similarity Score: {photo.distance}</p>
              </div>
            ))
          ) : (
            <p>No photos available.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default CatGallery;
