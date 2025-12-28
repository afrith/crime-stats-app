import type { StationDetails, StationFeature } from "~/db/stations";
import StationMap from "~/map/station-map.client";
import ClientOnly from "~/utils/client-only";
import { Row, Col } from "react-bootstrap";

interface StationViewProps {
  station: StationDetails;
  feature: StationFeature;
}

export default function StationView({ station, feature }: StationViewProps) {
  const { name, former_name } = station;
  return (
    <main className="p-4">
      <h2>
        Crime Stats for {name}
        {former_name && (
          <small className="text-muted"> (formerly {former_name})</small>
        )}
      </h2>
      <Row>
        <Col sm={12} md={8}>
          <div style={{ height: 400 }}>
            <ClientOnly>
              <StationMap station={feature} />
            </ClientOnly>
          </div>
        </Col>
        <Col sm={12} md={4}>
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
        </Col>
      </Row>
    </main>
  );
}
