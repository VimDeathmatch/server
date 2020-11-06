function foo() {
    let a = 0;
    for (let i = 0; i < 10; ++i) {
        a += i;
    }

    return a;
}

console.log(foo());

