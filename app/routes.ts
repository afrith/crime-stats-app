import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("province/:provCode", "routes/province.tsx"),
  route("station/:stationSlug", "routes/station.tsx"),
  ...prefix("stats", [route("annual", "routes/stats.ts")]),
] satisfies RouteConfig;
