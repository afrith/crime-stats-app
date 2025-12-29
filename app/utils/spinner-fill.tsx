import { memo } from "react";
import { Spinner } from "react-bootstrap";

function SpinnerFill() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "var(--bs-light)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        fontFamily: "var(--bs-font-sans-serif)",
        fontSize: "16pt",
      }}
    >
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      &nbsp;
      <span>Loading map&hellip;</span>
    </div>
  );
}

export default memo(SpinnerFill);
