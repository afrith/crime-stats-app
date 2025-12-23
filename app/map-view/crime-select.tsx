import type { Crime } from "~/db/crimes";
import { Form } from "react-bootstrap";

interface CrimeSelectProps {
  crimes: Crime[];
  selectedCrime?: string;
  onSelect?: (crime: string) => void;
}

export default function CrimeSelect({
  crimes,
  selectedCrime,
  onSelect,
}: CrimeSelectProps) {
  const sortedCrimes = [...crimes].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Form.Select
      onChange={(e) => onSelect?.(e.target.value)}
      value={selectedCrime ?? ""}
    >
      <option value="" disabled>
        Select a crime category
      </option>
      {sortedCrimes
        .filter((crime) => crime.parent_id == null)
        .map((crime) => (
          <CrimeOption
            key={crime.slug}
            crime={crime}
            allCrimes={sortedCrimes}
          />
        ))}
    </Form.Select>
  );
}

interface CrimeOptionProps {
  crime: Crime;
  allCrimes: Crime[];
  indent?: number;
}

function CrimeOption({ crime, allCrimes, indent = 0 }: CrimeOptionProps) {
  return (
    <>
      <option value={crime.slug}>
        {
          // this is an em space for indentation
          " ".repeat(indent)
        }
        {crime.name}
      </option>
      {allCrimes
        .filter((c) => c.parent_id === crime.id)
        .map((childCrime) => (
          <CrimeOption
            key={childCrime.slug}
            crime={childCrime}
            allCrimes={allCrimes}
            indent={indent + 1}
          />
        ))}
    </>
  );
}
