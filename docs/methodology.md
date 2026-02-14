# Methodology

## Simulation Model

### Latency Modeling
We define the latency $L$ for a memory access from Thread $T$ (on Node $N_T$) to Address $A$ (on Node $N_A$) as:

$$ L(T, A) = L_{base}(N_T, N_A) + C(N_A) $$

Where:
- $L_{base}(N_T, N_A)$ is the static latency derived from the ACPI SLIT (System Locality Information Table).
- $C(N_A)$ is the dynamic contention factor on Node $N_A$, modeled as a function of active threads accessing $N_A$.

### Memory Policies
The platform evaluates three primary allocation policies:

1.  **First-touch (Preferred Local)**
    - Pages are allocated on the node where the accessing thread is scheduled.
    - *Ideal Case*: Maximizes $L_{local}$, minimizes $L_{remote}$.

2.  **Interleaved**
    - Pages are distributed round-robin across all available nodes ($N_{0} \dots N_{k}$).
    - *Use Case*: Large datasets exceeding single-node capacity; mitigation of hot-spotting.

3.  **Worst-Case (Remote)**
    - Forces allocation on Node $N_{(i+1)\%k}$ relative to execution Node $N_i$.
    - *Stress Test*: Simulates pathological scheduling scenarios.

## Experimental Setup

### Environment
- **Hardware**: Validated on x86_64 SMP systems.
- **OS**: Linux Kernel 5.15+ (requires `libnuma`).
- **Compiler**: GCC 11.2 (`-O3` optimization level).

### Metrics
1.  **Local Access Ratio (LAR)**: $\frac{Access_{local}}{Access_{total}}$
2.  **Average Latency**: $\frac{\sum L(T, A)}{N_{ops}}$
3.  **Thread Stall Time**: Total duration threads are blocked waiting for memory response.
