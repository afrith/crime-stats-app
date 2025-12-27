import { Table } from "react-bootstrap";
import { type MapOptions, measureLabels } from "./map-options";

interface LegendProps {
  options: MapOptions;
  colors: string[];
  breakpoints: number[];
}

export default function Legend({ options, colors, breakpoints }: LegendProps) {
  return (
    <div className="mt-3">
      <h4>Legend</h4>
      <Table style={{ width: "auto" }}>
        <tbody>
          {breakpoints.map((bp, i) => {
            if (i === 0) return null;
            const color = colors[i - 1];
            return (
              <tr key={color}>
                <td
                  style={{
                    width: "50px",
                  }}
                >
                  <div
                    style={{
                      opacity: 0.5,
                      backgroundColor: color,
                      border: "1px solid #000",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    &nbsp;
                  </div>
                </td>
                <td className="text-end">
                  {options.measure === "count"
                    ? breakpoints[i - 1].toLocaleString("en-GB")
                    : breakpoints[i - 1].toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </td>
                <td>&ndash;</td>
                <td className="text-end">
                  {options.measure === "count"
                    ? bp.toLocaleString("en-GB")
                    : bp.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
