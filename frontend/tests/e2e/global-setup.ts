import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
export default function setup() {
  const root = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../..",
  );
  execFileSync(path.join(root, ".venv/bin/alembic"), ["upgrade", "head"], {
    cwd: root,
    stdio: "inherit",
  });
  execFileSync(
    path.join(root, ".venv/bin/python"),
    ["-m", "app.scripts.seed_all"],
    { cwd: root, stdio: "inherit" },
  );
}
