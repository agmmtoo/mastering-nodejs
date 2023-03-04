#include <stdio.h>
#include <time.h>
int main()
{
    int cycles = 1000000000;
    clock_t start, end;
    double duration;
    start = clock();
    for (int i = 0; i < cycles; i++)
    {
    }
    end = clock();
    duration = ((double)(end - start));
    printf("C looped %d times in %1f seconds\n", cycles, duration);
    return 0;
}