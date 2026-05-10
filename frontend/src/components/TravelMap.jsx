import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const TravelMap = ({ stops }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const geocodeStops = async () => {
      setLoading(true);
      const coords = [];
      for (const stop of stops) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(stop.city)}`);
          const data = await response.json();
          if (data && data.length > 0) {
            coords.push({
              id: stop._id,
              city: stop.city,
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon)
            });
          }
        } catch (error) {
          console.error('Geocoding error for', stop.city, error);
        }
      }
      setLocations(coords);
      setLoading(false);
    };

    if (stops && stops.length > 0) {
      geocodeStops();
    }
  }, [stops]);

  if (loading) return (
    <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl">
      <p className="text-slate-500 font-medium animate-pulse">Mapping your route...</p>
    </div>
  );

  if (locations.length === 0) return (
    <div className="h-full flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
      <p className="text-slate-400 italic">Add stops to see your route on the map</p>
    </div>
  );

  const center = locations.length > 0 ? [locations[0].lat, locations[0].lng] : [20, 0];
  const polylinePoints = locations.map(loc => [loc.lat, loc.lng]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={4} />
        {locations.map((loc, idx) => (
          <Marker key={loc.id || idx} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="font-bold">{loc.city}</div>
              <div className="text-xs text-slate-500">Stop #{idx + 1}</div>
            </Popup>
          </Marker>
        ))}
        <Polyline positions={polylinePoints} color="#2563eb" weight={3} dashArray="5, 10" />
      </MapContainer>
    </div>
  );
};

export default TravelMap;
