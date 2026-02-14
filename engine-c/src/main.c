#include <stdio.h>
#include <stdlib.h>
#include "../include/simulator.h"
#include "../include/thread_sim.h"
int main(int argc, char** argv)
{
    int nodes = 4;
    int threads = 4;
    int blocks = 20;
    int policy = 0;
    int pinning = 1;

    if(argc > 1) nodes = atoi(argv[1]);
    if(argc > 2) threads = atoi(argv[2]);
    if(argc > 3) blocks = atoi(argv[3]);
    if(argc > 4) policy = atoi(argv[4]);
    if(argc > 5) pinning = atoi(argv[5]);

    NUMASystem sys;
    init_system(&sys, nodes);

    simulate_parallel(&sys, threads, blocks, policy, pinning);

    return 0;
}
