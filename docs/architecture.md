# System Architecture

## Overview
The NUMA Performance Analyzer is a hybrid research platform designed to visualize and quantify Non-Uniform Memory Access (NUMA) effects in high-performance computing environments. It combines a low-level C simulation engine with a high-fidelity React-based visualization layer.

## Components

### 1. The C-Engine (Core)
Located in `engine-c/`, this component is responsible for the deterministic simulation of memory operations.
- **Thread Management**: Uses `pthread` to simulate concurrent execution threads.
- **Memory Allocator**: Implements `numa_alloc_onnode` simulation to model data placement.
- **Latency Matrix**: A configurable matrix defining the cost (in nanoseconds) between any two nodes $N_i$ and $N_j$.
- **Contention Model**: Simulates atomic contention for shared resources using lock-free data structures.

### 2. The Backend Bridge
Located in `backend/`, this Node.js server acts as the orchestration layer.
- **API**: Exposes REST endpoints for configuration (`POST /simulate`) and control.
- **Streaming Pipeline**: Uses Server-Sent Events (SSE) to stream simulation telemetry to the frontend in real-time.
- **Process Management**: Spawns and manages the lifecycle of the C-Engine child processes.

### 3. The Visualizer (Frontend)
Located in `frontend/`, this React application provides the interactive research interface.
- **Topology Renderer**: Uses `Three.js` (`@react-three/fiber`) to render the physical layout of NUMA nodes and connections.
- **Real-Time Charts**: Displays latency histograms and throughput metrics at 60Hz.
- **Heatmap Visualization**: Maps access patterns to a 2D matrix for rapid identification of "hot" remote nodes.

## Data Flow
1.  **Configuration**: User defines policy (e.g., *First-touch*) and density (e.g., *4 Nodes*).
2.  **Initialization**: Backend compiles and launches the C-Engine with these parameters.
3.  **Simulation**: C-Engine executes memory traces and outputs raw CSV data to `stdout`.
4.  **Streaming**: Backend parses CSV lines and pushes JSON objects via SSE.
5.  **Rendering**: Frontend buffers data (100ms batches) and updates the visualization state.

## Tech Stack
- **Languages**: C11, JavaScript (ES6+), GLSL
- **Frameworks**: React, Express.js, Three.js
- **Tools**: GCC, Node.js, Vite
