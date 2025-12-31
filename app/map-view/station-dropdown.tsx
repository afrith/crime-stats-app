import type { Station } from "~/db/stations";
import { useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Dropdown, FormControl } from "react-bootstrap";

interface StationDropdownProps {
  stations: Station[];
}

export default function StationDropdown({ stations }: StationDropdownProps) {
  const sortedStations = [...stations].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const normalisedTerm = searchTerm.trim().toLowerCase();
  const filteredStations =
    normalisedTerm !== ""
      ? sortedStations.filter((station) =>
          station.name.toLowerCase().includes(normalisedTerm)
        )
      : sortedStations;

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="primary"
        id="dropdown-drilldown"
        style={{ minWidth: "200px" }}
      >
        Find a police station
      </Dropdown.Toggle>
      <Dropdown.Menu
        style={{
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <Dropdown.ItemText>
          <FormControl
            type="text"
            placeholder="Type to search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></FormControl>
        </Dropdown.ItemText>
        <Dropdown.Divider />
        {filteredStations.map((station) => (
          <LinkContainer to={`/station/${station.slug}`} key={station.slug}>
            <Dropdown.Item>{station.name}</Dropdown.Item>
          </LinkContainer>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
