export default function Footer() {
  return (
    <footer className="pt-2">
      <p className="fst-italic">
        This site was developed by{" "}
        <a href="https://adrian.frith.dev/">Adrian Frith</a>. It is not
        affiliated with the SA Police Service or any other government agency.
        The data presented here was sourced from the{" "}
        <a href="https://www.saps.gov.za/services/crimestats.php">
          SAPS Crime Statistics
        </a>{" "}
        and is provided "as is" without warranty of any kind. For more
        information about the data please see{" "}
        <a href="https://github.com/afrith/crime-stats">
          the data repository on GitHub
        </a>
        . For the source code of this app please see{" "}
        <a href="https://github.com/afrith/crime-stats-app">
          the code repository on GitHub
        </a>
        .
      </p>
    </footer>
  );
}
