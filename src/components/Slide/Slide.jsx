import React, { useState, useEffect } from "react";
import "./Slide.scss";
import Slider from "infinite-react-carousel";

const Slide = ({ children, slidesToShow, arrowsScroll, title, showDots = true, autoplay = false }) => {
  const [currentSlidesToShow, setCurrentSlidesToShow] = useState(slidesToShow);
  
  // Normalize children into an array
  const childrenArray = React.Children.toArray(children);

  // Handle responsive behavior
  useEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 480) {
        setCurrentSlidesToShow(1);
      } else if (width < 768) {
        setCurrentSlidesToShow(2);
      } else if (width < 1024) {
        setCurrentSlidesToShow(3);
      } else {
        setCurrentSlidesToShow(slidesToShow);
      }
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, [slidesToShow]);

  // If there are no slides, show a fallback
  if (childrenArray.length === 0) {
    return (
      <div className="slide">
        <div className="container">
          <p>No items to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slide">
      <div className="container">
        {title && <h2 className="slide-title">{title}</h2>}
        
        <div className="slider-wrapper">
          <Slider 
            slidesToShow={currentSlidesToShow}
            arrowsScroll={1}
            autoplay={autoplay}
            dots={showDots}
            infinite={true}
            centerMode={false}
            centerPadding={0}
            swipeToSlide={true}
            adaptiveHeight={false}
            arrows={currentSlidesToShow > 1}
            slidesToScroll={1}
            speed={500}
            easing="ease"
            pauseOnHover={true}
          >
            {childrenArray.map((child, index) => (
              <div key={index} className="slider-item">
                {child}
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Slide;