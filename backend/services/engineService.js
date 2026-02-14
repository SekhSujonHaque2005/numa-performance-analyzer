import { spawn } from "child_process";
import fs from "fs";

export function runSimulation() {
  return new Promise((resolve, reject) => {

    const exePath = "E:/numa-performance-analyzer/engine-c/build/simulator.exe";

    const child = spawn(exePath, [], { shell: false });

    child.on("error", reject);

    child.on("close", (code) => {

      if (code !== 0) {
        return reject(new Error("Simulator exited with code " + code));
      }

      const csvPath = "E:/numa-performance-analyzer/engine-c/results.csv";

      fs.readFile(csvPath, "utf8", (err, data) => {
        if (err) return reject(err);

        const lines = data.trim().split(/\r?\n/);
        const headers = lines[0].split(",");

      const result = lines.slice(1).map(line => {
      const values = line.split(",");
      let obj = {};

    headers.forEach((h, i) => {
    obj[h.trim()] = values[i].trim();
  });

  return obj;
});


        resolve(result);
      });
    });
  });
}
