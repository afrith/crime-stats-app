import {
  type RouteConfig,
  index,
  route,
  prefix,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("station/:stationSlug", "routes/station.tsx"),
  ...prefix("stats", [route("annual", "routes/stats.tsx")]),
] satisfies RouteConfig;
