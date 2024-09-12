import actions from "@actions/core";
import { context } from "@actions/github";
import { Version } from "./version.js";
import { GitHub } from "./github.js";
import { Config } from "./config.js";

try {
  const token = actions.getInput("token") ?? process.env.GITHUB_TOKEN;
  const {
    repo: { owner, repo },
  } = context;
  const github = new GitHub(token, owner, repo);
  const config = await actions.group(
    "Read configuration from .github/release.yml",
    async () => {
      const config = await Config.read(".github", "release.yml");

      if (config.empty) {
        actions.warning("Config file has no versions configured.");
      }

      return config;
    },
  );
  const version = await actions.group(
    "Calculate new version based on unreleased pull requests",
    () => Version.calculate(github, config),
  );

  actions.setOutput("bump", version.bump);
  actions.setOutput("bumped", version.bumped);
  actions.setOutput("last", version.current.toString());
  actions.setOutput("next", version.next.toString());
  actions.setOutput("major", version.next.major);
  actions.setOutput("minor", version.next.minor);
  actions.setOutput("patch", version.next.patch);
} catch (error) {
  if (error instanceof Error) {
    actions.error(error.message);
  }

  process.exit(1);
}
