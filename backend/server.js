import express from "express";
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
  const policy = String(req.body?.policy ?? "random");
  const pinning = Boolean(req.body?.pinning ?? true);
  const data = simulateAll({ nodes, threads, blocks, policy, pinning });
  res.json(data);
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
