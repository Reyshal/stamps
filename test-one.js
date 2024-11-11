// Determine if number is prime
const isPrime = (num) => {
  // Handle edge cases
  if (num <= 1) return false;
  if (num <= 3) return true;

  // Check if divisible by 2 or 3
  if (num % 2 === 0 || num % 3 === 0) return false;

  // Check up to square root of number
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }

  return true;
};

// Determine result
const getResult = (length) => {
  const result = [];

  // Iterate from length to 1
  for (let i = length; i > 0; i--) {
    // Skip prime numbers
    if (isPrime(i)) {
      continue;
    }

    // Apply rules
    if (i % 15 === 0) {
      result.push("FooBar");
    } else if (i % 3 === 0) {
      result.push("Foo");
    } else if (i % 5 === 0) {
      result.push("Bar");
    } else {
      result.push(i);
    }
  }

  return result;
};

const result = getResult(100);
console.log(result);
