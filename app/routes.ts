import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("station/:stationSlug", "routes/station.tsx"),
] satisfies RouteConfig;
