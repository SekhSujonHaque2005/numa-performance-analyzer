#ifndef METRICS_H
#define METRICS_H

#include "simulator.h"
#include "policies.h"

typedef struct {
    int local_access;
    int remote_access;
    int total_time;
} Metrics;

void simulate_access(NUMASystem *sys,
                     Allocation *alloc,
                     int process_node,
                     Metrics *m);

void print_metrics(Metrics *m);

#endif
