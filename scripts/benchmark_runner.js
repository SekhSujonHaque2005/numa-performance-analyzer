/**
 * Automated Benchmark Runner
 * 
 * Executes a matrix of experiments to gather baseline data for research.
 * Iterates through Policies [first_touch, interleaved] and Nodes [4, 8].
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:5000/simulate';
const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const experiments = [
    { name: 'baseline_4n_ft', config: { nodes: 4, threads: 4, blocks: 20, policy: 'first_touch', pinning: true } },
    { name: 'baseline_4n_int', config: { nodes: 4, threads: 4, blocks: 20, policy: 'interleaved', pinning: true } },
    { name: 'stress_8n_rand', config: { nodes: 8, threads: 16, blocks: 50, policy: 'random', pinning: false } }
];

async function runBenchmarks() {
    console.log("Starting Automated Benchmarks...");
    const results = [];

    for (const exp of experiments) {
        console.log(`Running: ${exp.name}...`);
        try {
            const start = Date.now();
            const res = await axios.post(API_URL, exp.config);
            const duration = Date.now() - start;

            const data = res.data;
            const locals = data.reduce((s, d) => s + Number(d.local), 0);
            const remotes = data.reduce((s, d) => s + Number(d.remote), 0);
            const totalOps = locals + remotes;
            const avgLatency = data.reduce((s, d) => s + Number(d.time), 0) / data.length; // Approximate

            const result = {
                experiment: exp.name,
                config: exp.config,
                metrics: {
                    local_access_ratio: (locals / totalOps).toFixed(4),
                    avg_latency_ns: avgLatency.toFixed(2),
                    duration_ms: duration
                },
                timestamp: new Date().toISOString()
            };

            results.push(result);
            console.log(`  -> Completed: LAR=${result.metrics.local_access_ratio}, Latency=${result.metrics.avg_latency_ns}ns`);

            // Save individual raw data
            fs.writeFileSync(path.join(DATA_DIR, `${exp.name}.json`), JSON.stringify(data, null, 2));

        } catch (err) {
            console.error(`  -> Failed: ${err.message}`);
        }
    }

    // Save Summary
    fs.writeFileSync(path.join(DATA_DIR, 'benchmark_summary.json'), JSON.stringify(results, null, 2));
    console.log("\nAll benchmarks completed. Data saved to /data directory.");
}

runBenchmarks();
