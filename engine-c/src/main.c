#include <stdio.h>
#include "../include/simulator.h"
#include "../include/thread_sim.h"
int main()
{
    NUMASystem sys;

    init_system(&sys, 4);

    printf("\n=== PARALLEL NUMA SIMULATION ===\n");

    simulate_parallel(&sys, 4, 20);

    return 0;
}