import type { Route } from "../routes/+types/station";
import StationMap from "~/map/station-map.client";
import ClientOnly from "~/utils/client-only";
import { Breadcrumb, Row, Col } from "react-bootstrap";
import StationInfo from "./station-info";
import CrimeTable from "~/crime-table";
import { Link } from "react-router";
import { LinkContainer } from "react-router-bootstrap";

export default function StationView(props: Route.ComponentProps["loaderData"]) {
  const { station, crimes, stats } = props;
  const { name, former_name, prov_code, prov_name } = station.properties;
  return (
    <main>
      <div className="d-flex justify-content-between align-items-top flex-wrap-reverse">
        <Breadcrumb>
          <LinkContainer to="/">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </LinkContainer>
          <LinkContainer to={`/province/${prov_code}`}>
            <Breadcrumb.Item>{prov_name}</Breadcrumb.Item>
          </LinkContainer>
          <Breadcrumb.Item active>{name}</Breadcrumb.Item>
        </Breadcrumb>
        <Link to="/about">About this site</Link>
      </div>
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
        <Col sm={12} md={4} className="mt-3 mt-md-0">
          <StationInfo station={station.properties} />
        </Col>
      </Row>
      <div className="pt-2">
        <CrimeTable crimes={crimes} stats={stats} />
      </div>
    </main>
  );
}
