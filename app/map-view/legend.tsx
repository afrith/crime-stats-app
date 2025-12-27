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
      <Table>
        <thead>
          <tr>
            <th />
            <th>{measureLabels[options.measure]}</th>
          </tr>
        </thead>
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
