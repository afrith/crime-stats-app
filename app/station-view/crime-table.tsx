import { Table } from "react-bootstrap";
import type { Crime } from "~/db/crimes";
import type { CrimeStat } from "~/db/stats";
import { yearOptions, yearLabels } from "~/utils/map-options";

interface CrimeTableProps {
  crimes: Crime[];
  stats: CrimeStat[];
}

export function CrimeTable({ crimes, stats }: CrimeTableProps) {
  const sortedCrimes = [...crimes].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Table striped hover>
      <thead style={{ position: "sticky", top: 0 }}>
        <tr>
          <th>Crime category</th>
          {yearOptions.map((year) => {
            const label = yearLabels[year];
            let labelComponent = <>{label}</>;
            if (label.includes(" ")) {
              const parts = label.split(" ");
              labelComponent = (
                <>
                  {parts[0]} <small>{parts.slice(1).join(" ")}</small>
                </>
              );
            }
            return (
              <th
                key={`header-${year}}`}
                className="text-end"
                style={{ width: "150px" }}
              >
                {labelComponent}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {sortedCrimes
          .filter(({ parent_id }) => parent_id == null)
          .map((crime) => (
            <CrimeRow
              key={crime.slug}
              currentCrime={crime}
              crimes={crimes}
              stats={stats}
            />
          ))}
      </tbody>
    </Table>
  );
}

interface CrimeRowProps extends CrimeTableProps {
  currentCrime: Crime;
  indent?: number;
}

function CrimeRow(props: CrimeRowProps) {
  const { crimes, stats, currentCrime, indent = 0 } = props;

  const currentStats = stats.filter((s) => s.crimeSlug === currentCrime.slug);

  return (
    <>
      <tr>
        <td style={{ paddingLeft: `calc(.5rem + ${indent}em)` }}>
          {currentCrime.name}
        </td>
        {yearOptions.map((year) => (
          <td key={`${currentCrime.slug}-stat-${year}`} className="text-end">
            {(
              currentStats.find((s) => `${s.year}` === year)?.count ?? 0
            ).toLocaleString("en-GB")}
          </td>
        ))}
      </tr>
      {crimes
        .filter(({ parent_id }) => parent_id === currentCrime.id)
        .map((childCrime) => (
          <CrimeRow
            key={childCrime.slug}
            crimes={crimes}
            stats={stats}
            currentCrime={childCrime}
            indent={indent + 1}
          />
        ))}
    </>
  );
}
