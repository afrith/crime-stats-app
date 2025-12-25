import { Form } from "react-bootstrap";
import CrimeSelect from "./crime-select";
import type { Crime } from "~/db/crimes";
import type { MapOptions } from "./index";

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
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025 (Jan-Jun)</option>
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
          <option value="count">Count of crimes</option>
          <option value="rate">Crimes per 100,000 population</option>
          <option value="density">Crimes per square kilometer</option>
        </Form.Select>
      </Form.Group>
    </Form>
  );
}
