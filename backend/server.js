import express from "express";
import { exec } from "child_process";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const enginePath = path.join(__dirname, "../engine-c");
const csvPath = path.join(enginePath, "results.csv");

function buildLatency(nodes) {
  const m = Array.from({ length: nodes }, () => Array(nodes).fill(0));
  for (let i = 0; i < nodes; i++) {
    for (let j = 0; j < nodes; j++) {
      m[i][j] = i === j ? 10 : 30 + Math.abs(i - j) * 15;
    }
  }
  return m;
}

function simulateThread({ latency, processNode, blocks, nodes, policy }) {
  let local = 0;
  let remote = 0;
  let time = 0;
  for (let i = 0; i < blocks; i++) {
    let blockNode;
    if (policy === "first_touch") blockNode = processNode;
    else if (policy === "interleaved") blockNode = i % nodes;
    else blockNode = Math.floor(Math.random() * nodes);

    const l = latency[processNode][blockNode];
    if (blockNode === processNode) local++; else remote++;
    time += l;
  }
  return { local, remote, time };
}

function simulateAll({ nodes = 4, threads = 4, blocks = 20, policy = "random", pinning = true }) {
  nodes = Math.max(1, Math.min(nodes, 8));
  threads = Math.max(1, threads);
  blocks = Math.max(1, Math.min(blocks, 256));
  const latency = buildLatency(nodes);
  const results = [];
  for (let t = 0; t < threads; t++) {
    const processNode = pinning ? (t % nodes) : Math.floor(Math.random() * nodes);
    const m = simulateThread({ latency, processNode, blocks, nodes, policy });
    results.push({ thread: t, local: m.local, remote: m.remote, time: m.time });
  }
  return results;
}

app.post("/simulate", (req, res) => {
  const nodes = Number(req.body?.nodes ?? 4);
  const threads = Number(req.body?.threads ?? 4);
  const blocks = Number(req.body?.blocks ?? 20);
  const policyStr = String(req.body?.policy ?? "random");
  const pinning = Boolean(req.body?.pinning ?? true) ? 1 : 0;

  let policy = 0;
  if (policyStr === "first_touch") policy = 1;
  else if (policyStr === "interleaved") policy = 2;

  // Use /usr/bin/bash with MSYSTEM=MINGW64 to enforce MINGW64 environment
  // This is necessary because mingw64/bin/bash.exe does not exist in standard MSYS2
  const bashPath = "C:/msys64/usr/bin/bash.exe";
  // The command to run
  // We pass arguments via ARGS variable to make run
  // We explicitly change directory because bash --login might reset cwd
  const enginePathMsys = enginePath.replace(/\\/g, '/').replace(/^([a-zA-Z]):/, (m, d) => '/' + d.toLowerCase());
  const args = `${nodes} ${threads} ${blocks} ${policy} ${pinning}`;
  const cmd = `"${bashPath}" -lc "cd '${enginePathMsys}' && make run ARGS='${args}'"`;

  console.log(`Running simulation via C engine: ${cmd}`);

  exec(cmd, {
    cwd: enginePath,
    env: { ...process.env, MSYSTEM: "MINGW64", PATH: '/mingw64/bin:' + process.env.PATH }
  }, (error, stdout, stderr) => {
    if (error) {
      console.error("Simulation error:", error);
      console.error("Stderr:", stderr);
      // Log stdout for debugging make errors
      console.log("Stdout:", stdout);
      return res.status(500).json({ error: error.message, stderr, stdout });
    }

    try {
      if (!fs.existsSync(csvPath)) {
        return res.status(500).json({ error: "Results file not found" });
      }
      const csv = fs.readFileSync(csvPath, "utf-8");
      const lines = csv.trim().split("\n").slice(1); // skip header

      const data = lines.filter(l => l.trim()).map((l) => {
        const [thread, local, remote, time] = l.split(",");
        return {
          thread: Number(thread),
          local: Number(local),
          remote: Number(remote),
          time: Number(time),
        };
      });
      res.json(data);
    } catch (e) {
      console.error("Error parsing results:", e);
      res.status(500).json({ error: "Failed to parse simulation results" });
    }
  });
});

app.get("/simulate/stream", (req, res) => {
  const nodes = Number(req.query?.nodes ?? 4);
  const threads = Number(req.query?.threads ?? 4);
  const blocks = Number(req.query?.blocks ?? 20);
  const policy = String(req.query?.policy ?? "random");
  const pinning = req.query?.pinning === "false" ? false : true;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const data = simulateAll({ nodes, threads, blocks, policy, pinning });
  const sendEvent = (type, payload) => {
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };
  let i = 0;
  const tick = () => {
    if (i < data.length) {
      sendEvent("result", data[i]);
      i++;
      setTimeout(tick, 50);
    } else {
      sendEvent("end", { code: 0 });
      res.end();
    }
  };
  tick();
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
