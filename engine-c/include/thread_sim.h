#ifndef THREAD_SIM_H
#define THREAD_SIM_H

#include "metrics.h"

void simulate_parallel(NUMASystem *sys, int threads, int blocks, int policy, int pinning);

#endif
