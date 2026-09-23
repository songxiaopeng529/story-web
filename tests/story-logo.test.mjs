import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import test from "node:test";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scene = readFileSync(path.join(repositoryRoot, "apps/web/src/app/scene.tsx"), "utf8");

test("header and footer use the Story icon asset instead of the old SVG mark", () => {
  assert.equal((scene.match(/<StoryIcon \/>/g) ?? []).length, 2);
  assert.match(scene, /src=\{assetPath\("\/images\/story\/story-icon\.png"\)\}/);
  assert.doesNotMatch(scene, /function Mark\(/);

  const image = readFileSync(path.join(repositoryRoot, "apps/web/public/images/story/story-icon.png"));
  assert.deepEqual(image.subarray(0, 8), Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  assert.equal(image.readUInt32BE(16), 128);
  assert.equal(image.readUInt32BE(20), 128);
  assert.ok(image.length < 50_000, "small UI icon should not load the 677 KB source image");
});
