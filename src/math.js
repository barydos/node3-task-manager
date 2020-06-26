const fahrenheitToCelsius = (temp) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp) => {
    return (temp * 1.8) + 32
}

//
// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!

// Promises
const add = (a,b) => new Promise((resolve, reject) => { 
    const sum = setTimeout(() => {
        resolve(a + b)
    }, 1000)
})

module.exports = {
    fahrenheitToCelsius,
    celsiusToFahrenheit,
    add
}