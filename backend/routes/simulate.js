import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const router = express.Router();

router.post("/", (req, res) => {
  exec("make run", { cwd: "../engine-c" }, (err) => {
    if (err) return res.status(500).json({ error: err.message });

    const csv = fs.readFileSync("../engine-c/results.csv", "utf-8");

    const lines = csv.trim().split("\n").slice(1);

    const data = lines.map((l) => {
      const [thread, local, remote, time] = l.split(",");
      return { thread, local, remote, time };
    });

    res.json(data);
  });
});

export default router;
