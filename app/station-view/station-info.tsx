import type { StationDetails } from "~/db/stations";

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
      <dd>{station.population.toLocaleString("en-GB")} people</dd>
      <dt>Area</dt>
      <dd>
        {station.area_km2.toLocaleString("en-GB", {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })}{" "}
        km²
      </dd>
    </dl>
  );
}
