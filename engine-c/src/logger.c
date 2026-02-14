#include <stdio.h>
#include "../include/logger.h"

static FILE *fp = NULL;

void init_csv()
{
    fp = fopen("results.csv", "w");

    if(fp)
        fprintf(fp, "thread,local,remote,time\n");
}

void log_to_csv(int thread_id, Metrics *m)
{
    if(fp)
        fprintf(fp, "%d,%d,%d,%d\n",
                thread_id,
                m->local_access,
                m->remote_access,
                m->total_time);
}

void close_csv()
{
    if(fp)
        fclose(fp);
}
