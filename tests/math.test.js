const { celsiusToFahrenheit, fahrenheitToCelsius, add  } = require('../src/math')

test('Should convert 32 F to 0 C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
})

test('Should add two numbers', (done) => {
    add(1,4).then((sum) => {
        expect(sum).toBe(5)
        done()
    })
})

test('Should add two numbers async/await', async () => {
    const sum = await add(1,3)
    expect(sum).toBe(4)
})