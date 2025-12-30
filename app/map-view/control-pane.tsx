import { Form } from "react-bootstrap";
import CrimeSelect from "./crime-select";
import type { Crime } from "~/db/crimes";
import {
  type MapOptions,
  yearOptions,
  yearLabels,
  measureOptions,
  measureLabels,
} from "~/map-options";
import { useMapOptions } from "~/map-options/options-context";

interface ControlPaneProps {
  crimes: Crime[];
}

export default function ControlPane({ crimes }: ControlPaneProps) {
  const { options, setOptions } = useMapOptions();
  return (
    <Form>
      <Form.Group controlId="crimeSelect" className="mt-2">
        <Form.Label>Crime category:</Form.Label>
        <CrimeSelect
          crimes={crimes}
          selectedCrime={options.crimeSlug}
          onSelect={(crimeSlug) => setOptions({ ...options, crimeSlug })}
        />
      </Form.Group>

      <Form.Group controlId="yearSelect" className="mt-2">
        <Form.Label>Year:</Form.Label>
        <Form.Select
          value={options.year}
          onChange={(e) =>
            setOptions({
              ...options,
              year: e.target.value as MapOptions["year"],
            })
          }
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {yearLabels[year]}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="measureSelect" className="mt-2">
        <Form.Label>Measure:</Form.Label>
        <Form.Select
          value={options.measure}
          onChange={(e) =>
            setOptions({
              ...options,
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
