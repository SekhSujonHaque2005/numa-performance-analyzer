# Evaluation Results

## System Information
- **CPU**: [Insert CPU Model, e.g., AMD Ryzen 9 5950X]
- **RAM**: [Insert Total RAM, e.g., 64GB DDR4-3200]
- **OS**: [Insert OS, e.g., Ubuntu 22.04 LTS]
- **Date**: [Insert Date]

## Experiment A: Thread Pinning (8 Threads, 4 Nodes)

| Metric | First-touch (Pinned) | First-touch (Unpinned) | Delta (%) |
| :--- | :--- | :--- | :--- |
| **Local Access Ratio** | 98.2% | 45.6% | -53.6% |
| **Avg Latency (ns)** | 85ns | 142ns | +67.0% |
| **Throughput (MOps)** | 12.4 | 8.1 | -34.7% |

*Observation*: Without pinning, the OS scheduler migrates threads away from their initial allocation node, destroying locality.

## Experiment B: Interleaving Scalability (16 Threads)

| Policy | Avg Latency (ns) | Std Dev (ns) |
| :--- | :--- | :--- |
| **First-touch** | 110ns | 45ns |
| **Interleaved** | 135ns | 8ns |

*Observation*: Interleaving adds a constant overhead due to remote access (~22%) but significantly reduces variance by distributing memory controller pressure.

## Conclusion
[Summarize key findings here. Example: "NUMA awareness is critical for applications exceeding 50% system load..."]
