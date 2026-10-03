/** @format */

import { Router } from "express";

function printRoutes(router: Router, prefix = "") {
  router.stack.forEach((layer) => {
    if (!layer.route) return;

    const route = layer.route;

    const methods = route.stack
      .map((routeLayer) => routeLayer.method?.toUpperCase())
      .filter(Boolean);

    console.log(`${methods.join(", ").padEnd(10)} ${prefix}${route.path}`);
  });
}

export default printRoutes;
