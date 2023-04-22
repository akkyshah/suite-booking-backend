import * as dotenv from "dotenv";
import path from "path";

export class LocalEnvironment {
  static load() {
    const rootDir = process.cwd();

    // Because dotenv never clobbers an existing environment variable,
    // we load the (uncommitted) ".env.local" file before the (committed) ".env.local.local" one.
    [
      ".env.local",
      ".env.local.local",
    ].forEach((name) => {
      const envPath = path.resolve(rootDir, name);
      dotenv.config({path: envPath});
    });
  };
}
