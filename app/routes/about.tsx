import type { Route } from "./+types/about";
import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router";
import { makeMetaTags } from "~/utils/meta-tags";

export function headers(): HeadersInit {
  return {
    "Cache-Control": "public, max-age=600",
  };
}

export function meta({ location }: Route.MetaArgs) {
  return makeMetaTags({
    title: "Crime Stats: About this site",
    description: "Crime statistics for South Africa with interactive maps",
    pathname: location.pathname,
  });
}

export default function About() {
  return (
    <main className="container">
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          Home
        </Breadcrumb.Item>
        <Breadcrumb.Item active>About</Breadcrumb.Item>
      </Breadcrumb>
      <h1>About this site</h1>
      <p>
        This site was developed by{" "}
        <a href="https://adrian.frith.dev/">Adrian Frith</a> as a holiday
        project in December 2025. The{" "}
        <a href="https://github.com/afrith/crime-stats-app">code</a> and{" "}
        <a href="https://github.com/afrith/crime-stats">data</a> are available
        on GitHub.
      </p>
      <h2>Disclaimer and copyright</h2>
      <p className="fw-bold">
        This site is not affiliated with the SA Police Service, Stats SA, any
        other government agency, or my employer. All information on this site is
        provided "as is" without warranty of any kind.
      </p>
      <p>
        Neither SAPS nor Stats SA explicitly state terms of use for their data.
        In my view, this is public information that should be freely
        redistributable under the Promotion of Access to Information Act and
        section 32(1)(a) of the Constitution. To the extent that I have any
        claim to copyright or database right in respect of the work I have done
        to clean and organise the data, I relinquish any such rights and
        dedicate them to the public domain, in the terms set out in the{" "}
        <a href="https://opendatacommons.org/licenses/pddl/1-0/">
          Open Data Commons Public Domain Dedication and License (PDDL) v1.0.
        </a>
      </p>
      <p>
        <a href="https://github.com/afrith/crime-stats-app">
          The code which powers this site
        </a>{" "}
        is available under the{" "}
        <a href="https://opensource.org/licenses/MIT">MIT License</a>.
      </p>
      <h2>Data sources</h2>
      <p>
        The crime statistics were extracted from the quarterly crime statistics
        spreadsheets{" "}
        <a href="https://www.saps.gov.za/services/crimestats.php">
          available on the SAPS website
        </a>
        . I retrieved older files which are no longer available on the SAPS
        website through the{" "}
        <a href="https://web.archive.org/">Wayback Machine</a>. I wrote{" "}
        <a href="https://github.com/afrith/unhide-xlsx">this script</a> to
        unhide the hidden sheets in the spreadsheets which contain the raw data.
      </p>
      <p>
        The boundaries of the police districts are from the{" "}
        <a href="https://www.statssa.gov.za/wp-content/uploads/2025/08/PoliceDistrict.zip">
          police district shapefile
        </a>{" "}
        published by Stats SA in August 2025. I used PostGIS to{" "}
        <a href="https://postgis.net/docs/manual-3.6/ST_CoverageClean.html">
          remove gaps and overlaps
        </a>
        , and to{" "}
        <a href="https://postgis.net/docs/manual-3.6/ST_CoverageSimplify.html">
          slightly simplify
        </a>{" "}
        the geometries.
      </p>
      <p>
        The population counts were extracted from{" "}
        <a href="https://superweb.statssa.gov.za/webapi">
          Stats SA's SuperWEB data portal
        </a>
        .
      </p>
      <p>
        I cleaned up some inconsistencies in the naming of police stations. For
        more details see{" "}
        <a href="https://github.com/afrith/crime-stats">the data repository</a>.
      </p>
    </main>
  );
}
