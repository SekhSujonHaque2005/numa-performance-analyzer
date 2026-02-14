# Experiment Design

## Experiment A: Impact of Thread Pinning
**Hypothesis**: Thread mobility destroys First-touch locality benefits.
- **Configuration**:
    - Policy: First-touch
    - Threads: 8
    - Nodes: 4
- **Variable**: CPU Affinity (Pinned vs. Unpinned)
- **Expected Outcome**: Unpinned threads will drift to nodes disparate from their allocated memory, increasing remote access by >30%.

## Experiment B: Interleaving Efficiency
**Hypothesis**: Interleaving reduces tail latency under high contention but increases average latency.
- **Configuration**: 
    - Workload: Bandwidth-bound linear scan (1GB Array).
    - Threads: 16 (Saturation point).
- **Control**: First-touch quantization.
- **Variable**: Interleave Granularity (4KB page vs. 2MB HugePage).
- **Expected Outcome**: Interleaving yields a tighter latency distribution (lower standard deviation) despite higher mean latency.

## Experiment C: Topology Awareness
**Hypothesis**: Access costs are non-uniform even among remote nodes (NUMA distance).
- **Configuration**:
    - Nodes: 8 (Complex topology).
- **Action**: Force allocation on Node 0. Run threads on Nodes 1-7 sequentially.
- **Observation**: Record latency variations as distance ($hops$) increases.
