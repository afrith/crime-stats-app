import { Table } from "react-bootstrap";
import type { Crime } from "~/db/crimes";
import type { CrimeStat } from "~/db/stats";
import { formatFloat, formatInt } from "~/utils/format";
import { type MapOptions, yearOptions, yearLabels } from "~/map-options";
import { useMapOptions } from "~/map-options/options-context";
import MeasureSelect from "~/map-options/measure-select";

interface CrimeTableProps {
  crimes: Crime[];
  stats: CrimeStat[];
  population: number;
  area_km2: number;
}

export default function CrimeTable(props: CrimeTableProps) {
  const { crimes } = props;
  const sortedCrimes = [...crimes].sort((a, b) => a.sort_order - b.sort_order);
  const { options, setOptions } = useMapOptions();

  return (
    <>
      <div className="my-1 d-flex flex-row">
        <div className="flex-grow-0">
          <MeasureSelect
            measure={options.measure}
            onChange={(measure) => setOptions({ ...options, measure })}
          />
        </div>
      </div>
      <Table striped responsive>
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
                measure={options.measure}
                {...props}
              />
            ))}
        </tbody>
      </Table>
    </>
  );
}

interface CrimeRowProps extends CrimeTableProps {
  currentCrime: Crime;
  measure: MapOptions["measure"];
  indent?: number;
}

function CrimeRow(props: CrimeRowProps) {
  const { crimes, stats, currentCrime, measure, indent = 0 } = props;

  const currentStats = stats.filter((s) => s.crimeSlug === currentCrime.slug);

  return (
    <>
      <tr>
        <td style={{ paddingLeft: `calc(.5rem + ${indent}em)` }}>
          {currentCrime.name}
        </td>
        {yearOptions.map((year) => {
          const currentStat =
            currentStats.find((s) => `${s.year}` === year)?.count ?? 0;
          let statString: string;
          switch (measure) {
            case "count":
              statString = formatInt(currentStat);
              break;
            case "rate":
              statString = formatFloat(
                (currentStat / props.population) * 100_000
              );
              break;
            case "density":
              statString = formatFloat(currentStat / props.area_km2);
              break;
            default:
              statString = "";
          }
          if (currentStats)
            return (
              <td
                key={`${currentCrime.slug}-stat-${year}`}
                className="text-end"
              >
                {statString}
              </td>
            );
        })}
      </tr>
      {crimes
        .filter(({ parent_id }) => parent_id === currentCrime.id)
        .map((childCrime) => (
          <CrimeRow
            {...props}
            key={childCrime.slug}
            currentCrime={childCrime}
            indent={indent + 1}
          />
        ))}
    </>
  );
}
