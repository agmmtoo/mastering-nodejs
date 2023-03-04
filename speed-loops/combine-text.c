const char *s1 = "first string";
const char *s2 = "second string";
int size = strlen(s1) + strlen(s2);
char *buffer = (char *)malloc(size + 1);
strcpy(buffer, s1);
strcat(buffer, s2);
free(buffer);