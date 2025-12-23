import type { StationFeature } from "~/db/stations";
import { Popup } from "react-map-gl/maplibre";
import { Link } from "react-router";

interface StationPopupProps {
  feature: StationFeature;
  longitude: number;
  latitude: number;
}

export default function StationPopup({
  feature,
  longitude,
  latitude,
}: StationPopupProps) {
  // the prolonged key is to ensure the popup remounts when moved to a new location
  return (
    <Popup
      key={`popup-${feature.properties.slug}-${longitude}-${latitude}`}
      longitude={longitude}
      latitude={latitude}
    >
      <div className="fw-bold">{feature.properties.name}</div>
      <div>
        <Link to={`/station/${feature.properties.slug}`}>View Details</Link>
      </div>
    </Popup>
  );
}
