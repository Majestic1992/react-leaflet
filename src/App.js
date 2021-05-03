import { useState } from "react";
import "./App.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Icon } from "leaflet";
import * as cityData from "./cityData.json";
import factoryPic from "./img/factories-factory-svgrepo-com.svg";
import findMePic from "./img/location-svgrepo-com.svg";

function App() {
  const [activeCity, setActiveCity] = useState(null);
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState(null);
  const tallinn = [59.436962, 24.753574];
  const factory = new Icon({
    iconUrl: factoryPic,
    iconSize: [40, 40],
  });

  const LocationMarker = () => {
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  };

  // Locate me or fly to certain coords
  const changePos = () => {
    if (map) {
      // map.flyTo([58.38, 26.7225]);
      navigator.geolocation.getCurrentPosition(function (position) {
        map.flyTo([position.coords.latitude, position.coords.longitude], 14);
      });
    }
  };

  return (
    <div className="App">
      {/* <a className="findMe">
        <img src={findMePic} />
      </a> */}
      <MapContainer
        className="map-container"
        center={tallinn}
        zoom={8}
        scrollWheelZoom={true}
        whenCreated={(map) => setMap(map)}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cityData.cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.coordinates[0], city.coordinates[1]]}
            icon={factory}
            eventHandlers={{
              click: () => {
                setActiveCity(city);
              },
            }}
          />
        ))}
        {activeCity && (
          <Popup
            position={[activeCity.coordinates[0], activeCity.coordinates[1]]}
          >
            <h2>{activeCity.name}</h2>
            <p>Populataion: {activeCity.population}</p>
          </Popup>
        )}
        <button className="find" onClick={changePos}>
          <img src={findMePic} />
        </button>
      </MapContainer>
    </div>
  );
}

export default App;
