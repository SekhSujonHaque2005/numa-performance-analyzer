import express from "express";
import cors from "cors";
import { exec } from "child_process";
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

app.post("/simulate", (req, res) => {
  const cmd = 'C:/msys64/usr/bin/bash.exe -lc "make run"';

  exec(cmd, { cwd: enginePath }, (error, stdout, stderr) => {
    if (error) {
      console.log(stderr);
      return res.status(500).json({ error: error.message });
    }

    const csv = fs.readFileSync(csvPath, "utf-8");

    const lines = csv.trim().split("\n").slice(1);

    const data = lines.map((l) => {
      const [thread, local, remote, time] = l.split(",");
      return {
        thread: Number(thread),
        local: Number(local),
        remote: Number(remote),
        time: Number(time),
      };
    });

    res.json(data);
  });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
