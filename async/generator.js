function* threeThings() {
    yield 'one'
    yield 'two'
    yield 'three'
}

let tt = threeThings()

console.log(tt)
console.log(tt.next())
console.log(tt.next())
console.log(tt.next())
console.log(tt.next())
