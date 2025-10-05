// src/components/StoryCard.js

import React from 'react';
import './StoryCard.css';

const StoryCard = (props) => {
  const { storyStep, onNext, onPrevious } = props;
  
  if (!storyStep) return null;

  const cardStyle = {
    position: 'absolute',
    top: '50%',
    left: '40px',
    transform: 'translateY(-50%)',
    width: '320px',
    minHeight: '480px',
    zIndex: 100,
    background: 'rgba(20, 25, 40, 0.75)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(0, 191, 255, 0.5)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    padding: '25px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const mascotStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    border: '2px solid #00bfff',
    // Reduced margin to make space for the new image
    marginBottom: '15px', 
    objectFit: 'cover',
  };

  // --- NEW STYLE FOR THE CONTENT IMAGE ---
  const contentImageStyle = {
    width: '100%', // Make the image fill the width of the card
    height: '150px', // Give it a fixed height
    borderRadius: '10px', // Rounded corners
    objectFit: 'cover', // Ensure the image covers the area without stretching
    marginBottom: '15px', // Space between the image and the text
  };

  const textStyle = {
    textAlign: 'center',
    // Reduced margin to keep spacing balanced
    marginBottom: '15px', 
    lineHeight: '1.6',
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  };

  return (
    <div style={cardStyle}>
      <img src={storyStep.image} alt="Mascot Astero" style={mascotStyle} />
      
      {/* --- NEW IMG ELEMENT FOR THE CONTENT --- */}
      {/* It will only render if a contentImage path is provided in the story data */}
      {storyStep.contentImage && (
        <img 
          src={storyStep.contentImage} 
          alt="Story content" 
          style={contentImageStyle} 
        />
      )}
      
      <p style={textStyle}>
        {storyStep.text}
      </p>
      
      <div style={buttonContainerStyle}>
        {storyStep.step > 0 ? (
          <button 
            className="story-card-button"
            onClick={onPrevious}
          >
            Previous
          </button>
        ) : <div style={{flexGrow: 1, margin: '0 5px'}} />}

        <button 
          className="story-card-button"
          onClick={onNext}
        >
          {storyStep.buttonText || "Next"}
        </button>
      </div>
    </div>
  );
};

export default StoryCard;