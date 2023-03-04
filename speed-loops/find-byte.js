function find_byte(buffer, b) {
    let i
    for (i = 0; i < buffer.length; i++) {
        if (buffer[i] == b) {
            return i
        }
    }
    return -1
}
let buffer = Buffer.from('ascii A is byte value sixty-five', 'utf8')
let r = find_byte(buffer, 65)
console.log(r)