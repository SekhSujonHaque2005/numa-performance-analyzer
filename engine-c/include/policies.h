#ifndef POLICIES_H
#define POLICIES_H

#include "simulator.h"

#define MAX_BLOCKS 256

typedef struct {
    int owner_node[MAX_BLOCKS];
    int count;
} Allocation;

void allocate_first_touch(NUMASystem *sys, Allocation *a, int home_node, int blocks);
void allocate_random(NUMASystem *sys, Allocation *a, int blocks);
void allocate_interleaved(NUMASystem *sys, Allocation *a, int blocks);
void print_allocation(Allocation *a);

#endif
