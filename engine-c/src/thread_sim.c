#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>

#include "../include/thread_sim.h"
#include "../include/policies.h"
#include "../include/metrics.h"
#include "../include/logger.h"

pthread_mutex_t print_mutex;

typedef struct {
    NUMASystem *sys;
    int node_id;
    int blocks;
    int policy;
} ThreadData;

void* thread_worker(void *arg)
{
    ThreadData *data = (ThreadData*)arg;

    Allocation alloc;
    Metrics m;
    if(data->policy == 1)
        allocate_first_touch(data->sys, &alloc, data->node_id, data->blocks);
    else if(data->policy == 2)
        allocate_interleaved(data->sys, &alloc, data->blocks);
    else
        allocate_random(data->sys, &alloc, data->blocks);


    simulate_access(data->sys, &alloc, data->node_id, &m);

    pthread_mutex_lock(&print_mutex);

    printf("\n[Thread %d]\n", data->node_id);
    print_metrics(&m);
    printf("-------------------------\n");
    log_to_csv(data->node_id, &m);

    pthread_mutex_unlock(&print_mutex);

    return NULL;
}
void simulate_parallel(NUMASystem *sys, int threads, int blocks, int policy, int pinning)
{
    pthread_t tid[threads];
    ThreadData tdata[threads];
    pthread_mutex_init(&print_mutex, NULL);
    init_csv();
    for(int i = 0; i < threads; i++)
    {
        tdata[i].sys = sys;
        if(pinning)
            tdata[i].node_id = i % sys->num_nodes;
        else
            tdata[i].node_id = rand() % sys->num_nodes;
        tdata[i].blocks = blocks;
        tdata[i].policy = policy;

        pthread_create(&tid[i], NULL, thread_worker, &tdata[i]);
    }

    for(int i = 0; i < threads; i++)
        pthread_join(tid[i], NULL);

    close_csv();
    pthread_mutex_destroy(&print_mutex);
}
