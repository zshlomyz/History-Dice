import React, { useState } from 'react';
import './App.css';
import locations from './locations.json';
import MapComponent from './MapComponent';

interface LocationData {
  name: string;
  coordinates: number[];
  message: string;
}

interface Locations {
  [key: string]: LocationData;
}

function App(): React.JSX.Element {
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [funnyMessage, setFunnyMessage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [mobileView, setMobileView] = useState<'content' | 'map'>('content');

  const getLocationMessage = (number: number): LocationData => {
    const year: number = 1900 + number;
    const locationData: Locations = locations as Locations;
    return locationData[number] || {
      name: "Mystery Location",
      coordinates: [0, 0],
      message: `🌍 Year ${year}: 🎲 A mysterious location full of adventure awaits!`
    };
  };

  const generateRandomNumber = (): void => {
    setIsAnimating(true);

    setTimeout(() => {
      const number: number = Math.floor(Math.random() * 100) + 1;
      setRandomNumber(number);
      const location = getLocationMessage(number);
      setSelectedLocation(location);
      setFunnyMessage(location.message);
      setIsAnimating(false);
      // On mobile, switch to map view after generating
      if (window.innerWidth <= 768) {
        setMobileView('map');
      }
    }, 300);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">🎲 Random Number Generator 🎲</h1>
        <p className="subtitle">
          Click the button to get a random number from 1 to 100!
        </p>

        {/* Desktop Layout - Two Columns */}
        <div className="desktop-layout">
          <div className="left-panel">
            <button
              onClick={generateRandomNumber}
              className={`generate-button ${isAnimating ? 'clicked' : ''}`}
            >
              Generate Number!
            </button>

            {randomNumber !== null && (
              <div className="result-container">
                <div className="random-number">
                  {randomNumber}
                </div>
                <div className="funny-message">
                  {funnyMessage}
                </div>
              </div>
            )}
          </div>

          <div className="right-panel">
            <MapComponent location={selectedLocation} year={1900 + (randomNumber || 0)} />
          </div>
        </div>

        {/* Mobile Layout - Toggle View */}
        <div className="mobile-layout">
          {mobileView === 'content' ? (
            <>
              <button
                onClick={generateRandomNumber}
                className={`generate-button ${isAnimating ? 'clicked' : ''}`}
              >
                Generate Number!
              </button>

              {randomNumber !== null && (
                <div className="result-container">
                  <div className="random-number">
                    {randomNumber}
                  </div>
                  <div className="funny-message">
                    {funnyMessage}
                  </div>
                  <button
                    className="view-toggle-btn"
                    onClick={() => setMobileView('map')}
                  >
                    View Map 📍
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <MapComponent location={selectedLocation} year={1900 + (randomNumber || 0)} />
              <button
                className="view-toggle-btn"
                onClick={() => setMobileView('content')}
              >
                Back to Content 📊
              </button>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
