import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  name: string;
  coordinates: number[];
  message: string;
}

interface MapComponentProps {
  location: LocationData | null;
  year: number;
}

// Custom hook to handle map animations
const MapController: React.FC<{ location: LocationData | null }> = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (location && location.coordinates.length >= 2) {
      const [lat, lng] = location.coordinates;

      // Animate to the location with zoom
      map.flyTo([lat, lng], 6, {
        animate: true,
        duration: 2
      });

      // Add a slight delay before showing the popup
      setTimeout(() => {
        // The marker will handle showing the popup
      }, 500);
    }
  }, [location, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ location, year }) => {
  const center: [number, number] = [20, 0];
  const zoom = 2;

  return (
    <div className="map-container">
      <h3>🌍 World Map - Year {year}</h3>
      {location && (
        <p className="location-name">📍 {location.name}</p>
      )}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapController location={location} />
        {location && location.coordinates.length >= 2 && (
          <Marker
            position={[location.coordinates[0], location.coordinates[1]]}
            eventHandlers={{
              click: () => {
                // Popup will show on marker click
              },
            }}
          >
            <Popup>
              <div>
                <h4>{location.name}</h4>
                <p>{location.message}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <p className="map-note">
        * Click the marker to see more details about this amazing location!
      </p>
    </div>
  );
};

export default MapComponent;
