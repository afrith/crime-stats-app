import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="pt-2">
      <p className="fst-italic">
        This site was developed by{" "}
        <a href="https://adrian.frith.dev/">Adrian Frith</a>. It is not
        affiliated with the SA Police Service or any other government agency.
        The data is provided "as is" without warranty of any kind. For more
        information see the <Link to="/about">about page</Link>.
      </p>
    </footer>
  );
}
