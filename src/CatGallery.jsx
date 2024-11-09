import React, { useEffect, useState } from 'react';
import './CatGallery.css';


const CatGallery = () => {
    const [photos, setPhotos] = useState([]);


    const getPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const result = await response.json();
        setPhotos(result);
      } catch (err) {
        console.log("Couldn't get the photos: ", err);
      }
    };
    
    useEffect(() => {
      getPhotos();
      
    }, []);

    return (
        <div>
            <h1>Cat Photo Gallery</h1>
            <div className="gallery">
            {photos.length > 0 ? (
              photos.map((photo, index) => (
                <div key={index} className="photo-card">
                  <img src={photo.url} alt={`Cat ${index + 1}`} />
                  <p>{photo.caption}</p>
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
