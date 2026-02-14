#include <stdio.h>
#include "../include/metrics.h"

void simulate_access(NUMASystem *sys,
                     Allocation *alloc,
                     int process_node,
                     Metrics *m)
{
    m->local_access = 0;
    m->remote_access = 0;
    m->total_time = 0;

    for(int i = 0; i < alloc->count; i++)
    {
        int block_node = alloc->owner_node[i];

        int latency = get_latency(sys, process_node, block_node);

        if(process_node == block_node)
            m->local_access++;
        else
            m->remote_access++;

        m->total_time += latency;
    }
}

void print_metrics(Metrics *m)
{
    printf("Local Access  : %d\n", m->local_access);
    printf("Remote Access : %d\n", m->remote_access);
    printf("Total Time    : %d ns\n", m->total_time);
}