import { Form } from "react-bootstrap";
import CrimeSelect from "./crime-select";
import type { Crime } from "~/db/crimes";
import {
  type MapOptions,
  yearOptions,
  yearLabels,
  measureOptions,
  measureLabels,
} from "~/utils/map-options";

interface ControlPaneProps {
  crimes: Crime[];
  options: MapOptions;
  onOptionsChange: (options: Partial<MapOptions>) => void;
}

export default function ControlPane({
  crimes,
  options,
  onOptionsChange,
}: ControlPaneProps) {
  return (
    <Form>
      <Form.Group controlId="crimeSelect">
        <Form.Label>Crime category:</Form.Label>
        <CrimeSelect
          crimes={crimes}
          selectedCrime={options.crimeSlug}
          onSelect={(crimeSlug) => onOptionsChange({ crimeSlug })}
        />
      </Form.Group>

      <Form.Group controlId="yearSelect">
        <Form.Label>Year:</Form.Label>
        <Form.Select
          value={options.year}
          onChange={(e) =>
            onOptionsChange({ year: e.target.value as MapOptions["year"] })
          }
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {yearLabels[year]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="measureSelect">
        <Form.Label>Measure:</Form.Label>
        <Form.Select
          value={options.measure}
          onChange={(e) =>
            onOptionsChange({
              measure: e.target.value as MapOptions["measure"],
            })
          }
        >
          {measureOptions.map((measure) => (
            <option key={measure} value={measure}>
              {measureLabels[measure]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
}
