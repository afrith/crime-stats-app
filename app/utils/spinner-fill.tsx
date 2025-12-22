import { Spinner } from "react-bootstrap";

export default function SpinnerFill({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="w-100 h-100 d-flex justify-content-center align-items-center bg-light">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      &nbsp;
      {children}
    </div>
  );
}
