import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CatGallery = () => {
    const [photos, setPhotos] = useState([]);


    const getPhotos = async() =>{
      try{
      const response = await fetch('', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();
      setPhotos(result);
    }catch(err){
      console.log("couldnt get the photos: ", err);

  }

    }
    useEffect(() => {
      getPhotos();
      
    }, []);

    return (
        <div>
            <h1>Cat Photo Gallery</h1>
            <div className="gallery">
                {photos.map((photo, index) => (
                    <div key={index} className="photo-card">
                        <img src={photo.url} alt={`Cat ${index + 1}`} />
                        <p>{photo.caption}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CatGallery;
