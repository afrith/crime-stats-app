import { Table } from "react-bootstrap";
import { type MapOptions } from "~/utils/map-options";
import { formatInt, formatFloat } from "~/utils/format";

interface LegendProps {
  options: MapOptions;
  colors: string[];
  breakpoints: number[];
}

export default function Legend({ options, colors, breakpoints }: LegendProps) {
  return (
    <Table style={{ width: "auto" }}>
      <tbody>
        {breakpoints.map((bp, i) => {
          if (i === 0) return null;
          const color = colors[i - 1];

          const start = breakpoints[i - 1];
          const end =
            options.measure === "count" && i < breakpoints.length - 1
              ? bp - 1
              : bp;

          let text = "";

          if (options.measure === "count") {
            if (start === end) {
              text = formatInt(end);
            } else {
              text = `${formatInt(start)} – ${formatInt(end)}`;
            }
          } else {
            if (start === end) {
              text = formatFloat(end);
            } else {
              text = `${formatFloat(start)} – ${formatFloat(end)}`;
            }
          }

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
              <td>{text}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}
