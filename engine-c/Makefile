CC=gcc
CFLAGS=-Iinclude -pthread -static -static-libgcc -static-libstdc++

SRC=src/main.c src/simulator.c src/policies.c src/metrics.c src/thread_sim.c src/logger.c
OUT=build/simulator.exe

all:
	$(CC) $(SRC) $(CFLAGS) -o $(OUT)

run: all
	./$(OUT) $(ARGS)

clean:
	rm -f build/*