import type { MapOptions } from "~/map-options";
import { measureOptions, measureLabels } from "~/map-options";
import { FormSelect } from "react-bootstrap";

type MeasureSelectProps = {
  measure: MapOptions["measure"];
  onChange: (measure: MapOptions["measure"]) => void;
};

export default function MeasureSelect(props: MeasureSelectProps) {
  const { measure, onChange } = props;

  return (
    <FormSelect
      value={measure}
      onChange={(e) => onChange(e.target.value as MapOptions["measure"])}
    >
      {measureOptions.map((measure) => (
        <option key={measure} value={measure}>
          {measureLabels[measure]}
        </option>
      ))}
    </FormSelect>
  );
}
