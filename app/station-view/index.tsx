import type { StationFeature } from "~/db/stations";
import StationMap from "~/map/station-map.client";
import ClientOnly from "~/utils/client-only";

interface StationViewProps {
  station: StationFeature;
}

export default function StationView({ station }: StationViewProps) {
  const { name, prov_code } = station.properties;
  return (
    <main className="p-4">
      <h2>Crime Stats for {name}</h2>
      <div style={{ height: 400, maxWidth: 600 }}>
        <ClientOnly>
          <StationMap station={station} />
        </ClientOnly>
      </div>
    </main>
  );
}
