#include <stdio.h>
#include <stdlib.h>
#include "../include/policies.h"

void allocate_first_touch(NUMASystem *sys, Allocation *a, int home_node, int blocks)
{
    a->count = blocks;

    for(int i = 0; i < blocks; i++)
        a->owner_node[i] = home_node;
}

void allocate_random(NUMASystem *sys, Allocation *a, int blocks)
{
    a->count = blocks;

    for(int i = 0; i < blocks; i++)
        a->owner_node[i] = rand() % sys->num_nodes;
}

void allocate_interleaved(NUMASystem *sys, Allocation *a, int blocks)
{
    a->count = blocks;

    for(int i = 0; i < blocks; i++)
        a->owner_node[i] = i % sys->num_nodes;
}

void print_allocation(Allocation *a)
{
    printf("Block Allocation:\n");

    for(int i = 0; i < a->count; i++)
        printf("%d ", a->owner_node[i]);

    printf("\n");
}
