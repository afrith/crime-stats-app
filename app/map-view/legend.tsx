import type { MapOptions } from "~/map-view";
import { Table } from "react-bootstrap";

interface LegendProps {
  options: MapOptions;
  colors: string[];
  breakpoints: number[];
}

export default function Legend({ options, colors, breakpoints }: LegendProps) {
  return (
    <div className="mt-3">
      <h4>Legend</h4>
      <Table>
        <tbody>
          {breakpoints.map((bp, i) => {
            if (i === 0) return null;
            const color = colors[i - 1];
            return (
              <tr key={color}>
                <td style={{ backgroundColor: color, width: "50px" }}></td>
                <td>
                  {options.measure === "count"
                    ? `${breakpoints[i - 1]} – ${bp}`
                    : `${breakpoints[i - 1].toFixed(2)} – ${bp.toFixed(2)}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
