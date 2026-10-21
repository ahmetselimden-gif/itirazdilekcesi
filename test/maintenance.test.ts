import assert from "node:assert/strict";
import test from "node:test";

import {
  HOME_MAINTENANCE_ENABLED,
  MAINTENANCE_MESSAGE,
} from "../lib/maintenance";

test("enables maintenance mode only for the home page implementation", () => {
  assert.equal(HOME_MAINTENANCE_ENABLED, true);
});

test("uses the approved Turkish maintenance message", () => {
  assert.equal(MAINTENANCE_MESSAGE, "Çok yakında hizmetinizdeyiz.");
});
