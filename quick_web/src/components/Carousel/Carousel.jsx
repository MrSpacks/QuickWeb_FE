import React, { useEffect, useRef } from "react";
import "./Carousel.css";

export default function Carousel() {
  const images = [
    "/img/carousel/slide1.png",
    "/img/carousel/slide2.png",
    "/img/carousel/slide3.png",
    "/img/carousel/slide4.png",
  ];

  const carouselRef = useRef(null);

  useEffect(() => {
    let currentX = 0;
    let speed = 0.5; // пикселей в кадр
    let animationFrame;

    const animate = () => {
      currentX -= speed;
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(${currentX}px)`;
        // Когда прокрутка доходит до половины, сбрасываем
        if (Math.abs(currentX) >= carouselRef.current.scrollWidth / 2) {
          currentX = 0;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-track" ref={carouselRef}>
        {[...images, ...images].map((src, index) => (
          <div className="carousel-slide" key={index}>
            <img src={src} alt={`slide-${index}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
