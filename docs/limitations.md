# Limitations

## Simulation Constraints
1.  **Synthetic Contention**: The C-Engine uses atomic counters to simulate bus locking. Real hardware memory controllers have complex queuing logic (DDR4/5 interaction) that is not fully captured here.
2.  **Cache Coherency**: We do not simulate MESI/MOESI cache coherence protocols. The latency assumes L3 cache misses (DRAM access).
3.  **Context Switching**: The simulation assumes zero-overhead context switching for unpinned threads, which is optimistic.

## Visualization Limits
1.  **Sampling Rate**: The frontend renders at 60Hz, but the data stream is sampled. Extremely short-lived spikes (<10ms) might be aliased or smoothed out by the batching algorithm.
2.  **Browser Overhead**: Rendering 1000+ particles in `Three.js` competes for GPU resources, potentially affecting the *perceived* smoothness on low-end integrated graphics, though simulation accuracy remains unaffected.

## Hardware Dependency
- The "Real System" metrics rely on `libnuma`. On Windows/WSL environments, the engine falls back to a purely probabilistic simulation mode since direct hardware counters are inaccessible.
