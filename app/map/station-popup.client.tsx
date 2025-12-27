import type { StationFeature } from "~/db/stations";
import { Popup } from "react-map-gl/maplibre";
import { Link } from "react-router";
import { Table } from "react-bootstrap";
import type { CrimeStat } from "~/db/stats";

interface StationPopupProps {
  feature: StationFeature;
  stat?: CrimeStat;
  longitude: number;
  latitude: number;
}

export default function StationPopup({
  feature,
  stat,
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

      {stat && (
        <p className="text-muted">
          statistics for {stat.crimeSlug} in {stat.year}
        </p>
      )}
      <Table size="sm" className="my-2">
        <tbody>
          <tr>
            <th>Population:</th>
            <td className="text-end">
              {feature.properties.population.toLocaleString("en-GB")}
            </td>
          </tr>
          <tr>
            <th>Area:</th>
            <td className="text-end">
              {feature.properties.area_km2.toLocaleString("en-GB", {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{" "}
              km²
            </td>
          </tr>
          {stat && (
            <>
              <tr>
                <th>Incidents:</th>
                <td className="text-end">
                  {stat.count.toLocaleString("en-GB")}
                </td>
              </tr>
              <tr>
                <th>Per 100,000 people:</th>
                <td className="text-end">
                  {stat.rate.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
              <tr>
                <th>Per km²:</th>
                <td className="text-end">
                  {stat.density.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
      <div>
        <Link to={`/station/${feature.properties.slug}`}>See more&hellip;</Link>
      </div>
    </Popup>
  );
}
