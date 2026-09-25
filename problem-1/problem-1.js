//Three ways to sum to n

var sum_to_n_a = function(n) { // o(n)
  if (n <= 0) return 0;
  return Array.from({ length: n }, (_, i) => i + 1).reduce((a, b) => b + a, 0)
};

var sum_to_n_b = function(n) { // o(1)
  if (n <= 0) return 0;
  return n*(n + 1)/2
};

var sum_to_n_c = function(n) { //o(n)
  if (n <= 0) return 0;
  if (n === 1) return 1;

  return sum_to_n_c(n - 1) + n;
};

console.log(sum_to_n_a(7))
console.log(sum_to_n_b(7))
console.log(sum_to_n_c(7))