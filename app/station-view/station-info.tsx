import type { StationDetails } from "~/db/stations";
import { formatInt, formatFloat } from "~/utils/format";

export default function StationInfo({ station }: { station: StationDetails }) {
  return (
    <dl>
      <dt>Province</dt>
      <dd>{station.prov_name}</dd>
      {station.dc_code === station.muni_code ? (
        <>
          <dt>Municipality</dt>
          <dd>{station.muni_name}</dd>
        </>
      ) : (
        <>
          <dt>District municipality</dt>
          <dd>{station.dc_name}</dd>
          <dt>Local municipality</dt>
          <dd>{station.muni_name}</dd>
        </>
      )}
      <dt>
        Population <small className="text-muted">(Census 2022)</small>
      </dt>
      <dd>{formatInt(station.population)} people</dd>
      <dt>Area</dt>
      <dd>{formatFloat(station.area_km2, 1)} km²</dd>
    </dl>
  );
}
