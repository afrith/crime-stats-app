import type { Route } from "../routes/+types/station";
import StationMap from "~/map/station-map.client";
import ClientOnly from "~/utils/client-only";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import StationInfo from "./station-info";
import CrimeTable from "~/crime-table";
import { Link } from "react-router";

export default function StationView(props: Route.ComponentProps["loaderData"]) {
  const { station, crimes, stats } = props;
  const { name, former_name, prov_code, prov_name } = station.properties;
  return (
    <main className="p-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/province/${prov_code}`}>{prov_name}</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{name}</Breadcrumb.Item>
      </Breadcrumb>
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
              <StationMap station={station} />
            </ClientOnly>
          </div>
        </Col>
        <Col sm={12} md={4}>
          <StationInfo station={station.properties} />
        </Col>
      </Row>
      <div className="pt-4">
        <CrimeTable crimes={crimes} stats={stats} />
      </div>
    </main>
  );
}
