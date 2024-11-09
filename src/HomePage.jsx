import React from 'react';
import './HomePage.css';

const cats = [
    { name: "Puff", color: "Orange", favoriteActivity: "Eating", image: "/assets/puff.jpg" },
    { name: "Gotham", color: "Black", favoriteActivity: "Sleeping", image: "/assets/gotham.jpg" },
    { name: "Stella", color: "Cute", favoriteActivity: "String", image: "/assets/stella.jpg" },
    { name: "Bud", color: "Tuxedo", favoriteActivity: "Bullying", image: "/assets/bud.jpg" }
];

function HomePage() {
    return (
        <div className="homepage-container">
            <header className="homepage-header">
                <h1>Welcome to Courtnee's Cat Paradise!</h1>
                <p className="homepage-subtitle">A delightful blend of Hello Kitty and feline love</p>
            </header>
            
            <section className="hello-kitty-section">
                <h2>Hello Kitty Corner</h2>
                <div className="hello-kitty-image-container">
                    <img 
                        src="/assets/bud.jpg" 
                        alt="Hello Kitty" 
                        className="hello-kitty-image"
                    />
                </div>
            </section>

            <section className="cats-section">
                <h2>Meet the Cats</h2>
                <div className="cats-gallery">
                    {cats.map((cat, index) => (
                        <div key={index} className="cat-card">
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="cat-image"
                            />
                            <p className="cat-name">{cat.name}</p>
                            <p className="cat-details">Color: {cat.color}</p>
                            <p className="cat-details">Favorite Activity: {cat.favoriteActivity}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default HomePage;
