import { Link } from "react-router";
import type { Province } from "~/db/structures";

interface ProvinceListProps {
  provinces: Province[];
  currentCode?: string;
}

export default function ProvinceList({
  provinces,
  currentCode,
}: ProvinceListProps) {
  const sortedProvinces = [...provinces].sort((a, b) =>
    a.prov_name.localeCompare(b.prov_name)
  );

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "1rem",
        margin: "0 1rem",
      }}
    >
      <div className="text-nowrap">
        {currentCode == null ? (
          <strong>South Africa</strong>
        ) : (
          <Link to="/">South Africa</Link>
        )}
      </div>
      {sortedProvinces.map((prov) => (
        <div key={prov.prov_code} className="text-nowrap">
          {currentCode === prov.prov_code ? (
            <strong>{prov.prov_name}</strong>
          ) : (
            <Link to={`/province/${prov.prov_code}`}>{prov.prov_name}</Link>
          )}
        </div>
      ))}
    </div>
  );
}
