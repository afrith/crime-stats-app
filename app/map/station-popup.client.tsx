import type { StationFeature } from "~/db/stations";
import { Popup } from "react-map-gl/maplibre";
import { Link } from "react-router";
import { Table } from "react-bootstrap";

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
      <h4>{feature.properties.name}</h4>
      <Table size="sm">
        <tbody>
          <tr>
            <th>Population:</th>
            <td>{feature.properties.population}</td>
          </tr>
          <tr>
            <th>Area:</th>
            <td>{feature.properties.area_km2} km²</td>
          </tr>
        </tbody>
      </Table>
      <div>
        <Link to={`/station/${feature.properties.slug}`}>See more&hellip;</Link>
      </div>
    </Popup>
  );
}
