import { spawn, spawnSync } from "node:child_process";
import path from "node:path";

const projectRoot = process.cwd();
const environment = {
  ...process.env,
  NEXT_PUBLIC_GA_ID: "G-TEST123",
  NEXT_TELEMETRY_DISABLED: "1",
  PLAYWRIGHT_EXTERNAL_SERVER: "1",
};
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");
const playwrightCli = path.join(projectRoot, "node_modules", "@playwright", "test", "cli.js");
const argumentsFromCommand = process.argv.slice(2);
const skipBuild = argumentsFromCommand.includes("--skip-build");
const playwrightArguments = argumentsFromCommand.filter((argument) => argument !== "--skip-build");

if (!skipBuild) {
  const build = spawnSync(process.execPath, [nextBin, "build"], {
    cwd: projectRoot,
    env: environment,
    stdio: "inherit",
  });

  if (build.status !== 0) {
    process.exit(build.status ?? 1);
  }
}

const server = spawn(
  process.execPath,
  [nextBin, "start", "--hostname", "127.0.0.1", "--port", "3100"],
  { cwd: projectRoot, env: environment, stdio: "inherit" },
);

function stopServer() {
  if (!server.killed) server.kill();
}

process.on("SIGINT", () => {
  stopServer();
  process.exit(130);
});
process.on("SIGTERM", () => {
  stopServer();
  process.exit(143);
});
process.on("exit", stopServer);

const startedAt = Date.now();
let serverReady = false;
while (Date.now() - startedAt < 30_000) {
  if (server.exitCode !== null) {
    stopServer();
    process.exit(server.exitCode ?? 1);
  }

  try {
    const response = await fetch("http://127.0.0.1:3100");
    if (response.ok) {
      serverReady = true;
      break;
    }
  } catch {
    // O servidor ainda está iniciando.
  }

  await new Promise((resolve) => setTimeout(resolve, 250));
}

if (!serverReady) {
  stopServer();
  throw new Error("O servidor de testes não iniciou em 30 segundos.");
}

const tests = spawnSync(process.execPath, [playwrightCli, "test", ...playwrightArguments], {
  cwd: projectRoot,
  env: environment,
  stdio: "inherit",
});

stopServer();
process.exit(tests.status ?? 1);
