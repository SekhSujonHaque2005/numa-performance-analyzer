#ifndef LOGGER_H
#define LOGGER_H

#include "metrics.h"

void init_csv();
void log_to_csv(int thread_id, Metrics *m);
void close_csv();

#endif
