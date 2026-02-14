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
} ThreadData;

void* thread_worker(void *arg)
{
    ThreadData *data = (ThreadData*)arg;

    Allocation alloc;
    Metrics m;

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
void simulate_parallel(NUMASystem *sys, int threads, int blocks)
{
    pthread_t tid[threads];
    ThreadData tdata[threads];
    pthread_mutex_init(&print_mutex, NULL);
    init_csv();
    for(int i = 0; i < threads; i++)
    {
        tdata[i].sys = sys;
        tdata[i].node_id = i;
        tdata[i].blocks = blocks;

        pthread_create(&tid[i], NULL, thread_worker, &tdata[i]);
    }

    for(int i = 0; i < threads; i++)
        pthread_join(tid[i], NULL);

    close_csv();
    pthread_mutex_destroy(&print_mutex);
}
