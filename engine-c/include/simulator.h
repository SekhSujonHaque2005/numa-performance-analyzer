#ifndef SIMULATOR_H
#define SIMULATOR_H
#define MAX_NODES 8
#define MEMORY_PER_NODE 1024

typedef struct {
    int id;
} MemoryBlock;

typedef struct {
    int id;
    MemoryBlock memory[MEMORY_PER_NODE];
} Node;

typedef struct {
    int num_nodes;
    Node nodes[MAX_NODES];
    int latency[MAX_NODES][MAX_NODES];
} NUMASystem;

void init_system(NUMASystem *sys, int nodes);
int get_latency(NUMASystem *sys, int from, int to);
void print_latency_matrix(NUMASystem *sys);

#endif