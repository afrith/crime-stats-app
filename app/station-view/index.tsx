import type { StationDetails, StationFeature } from "~/db/stations";
import StationMap from "~/map/station-map.client";
import ClientOnly from "~/utils/client-only";
import { Row, Col } from "react-bootstrap";
import StationInfo from "./station-info";

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
          <StationInfo station={station} />
        </Col>
      </Row>
    </main>
  );
}
