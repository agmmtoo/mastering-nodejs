int find_byte(const char *buffer, int size, const char b)
{
    for (int i = 0; i < size; i++)
    {
        if (buffer[i] == b)
        {
            return i;
        }
    }
    return -1;
}