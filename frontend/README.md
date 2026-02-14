# NUMA Performance Analyzer v3.0 (Extreme Edition)

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![Version](https://img.shields.io/badge/version-3.0.0--EXTREME-cyan.svg) ![Status](https://img.shields.io/badge/status-Research%20Grade-purple.svg)

> **Visualizing the Future of Memory Dynamics.**
> A high-fidelity research platform for analyzing Non-Uniform Memory Access (NUMA) effects in high-performance computing systems.

## 🌟 Overview

The **NUMA Performance Analyzer** is a hybrid visualization tool designed to bridge the gap between low-level hardware metrics and high-level software design. It combines a deterministic **C Simulation Engine** with a **React + Three.js** frontend to provide real-time feedback on memory latency, thread contention, and allocation policies.

This repository contains the **Frontend Visualization Layer**, built with modern web technologies to deliver a "Cyber-Glass" aesthetic suitable for both academic presentation and engineering analysis.

## ✨ Key Features

-   **3D Topology Visualizer**: Interactive rendering of NUMA nodes and interconnects using `@react-three/fiber`.
-   **Real-Time Telemetry**: 60Hz data streaming via Server-Sent Events (SSE) with batched updates.
-   **Scenario Comparison**: Side-by-side analysis of "Ideal" vs. "Stress" configurations with visual delta bars.
-   **Professional Landing Page**: Research-grade entry point with direct access to academic resources.
-   **Latency Heatmaps**: 2D matrix visualization of thread-to-node access patterns.

## 🚀 Quick Start

### Prerequisites
-   Node.js v18+
-   Modern Browser (Chrome/Edge/Firefox) with WebGL support.

### Installation

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start Development Server**
    ```bash
    npm run dev
    ```
    Access the application at `http://localhost:5173`.

3.  **Build for Production**
    ```bash
    npm run build
    ```

## 🔬 Research Workflow

This frontend is part of a larger research suite. For full academic reproducibility, utilize the accompanying backend and script tools:

-   **Backend**: Located in `../backend/`, orchestrates the C-Engine.
-   **Documentation**: See `../docs/` for `architecture.md`, `methodology.md`, and `experiment_design.md`.
-   **Automation**: Use `../scripts/benchmark_runner.js` for headless data collection.

## 🛠️ Tech Stack

-   **Framework**: React 18, Vite
-   **Visualization**: Three.js, Recharts, Framer Motion
-   **Styling**: TailwindCSS, Lucide Icons
-   **Language**: JavaScript (ES6+)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed by the NUMA Research Group, Advanced Systems Laboratory.*
