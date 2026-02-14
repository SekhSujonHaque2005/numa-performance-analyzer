#include <stdio.h>
#include <stdlib.h>
#include "../include/simulator.h"
void init_system(NUMASystem *sys, int nodes)
{
    sys->num_nodes = nodes;

    // Initialize nodes + memory
    for(int i = 0; i < nodes; i++)
    {
        sys->nodes[i].id = i;

        for(int j = 0; j < MEMORY_PER_NODE; j++)
            sys->nodes[i].memory[j].id = j;
    }

    // Create latency matrix
    for(int i = 0; i < nodes; i++)
    {
        for(int j = 0; j < nodes; j++)
        {
            if(i == j)
                sys->latency[i][j] = 10;
            else
                sys->latency[i][j] = 30 + abs(i - j) * 15; // remote
        }
    }
}
int get_latency(NUMASystem *sys, int from, int to)
{
    return sys->latency[from][to];
}
void print_latency_matrix(NUMASystem *sys)
{
    printf("\nLatency Matrix:\n");

    for(int i = 0; i < sys->num_nodes; i++)
    {
        for(int j = 0; j < sys->num_nodes; j++)
            printf("%4d ", sys->latency[i][j]);

        printf("\n");
    }
}