 n = int(input("Digite um número: "))

fib = [1, 1]

for i in range(n):
    prox_fib = fib[-1] + fib[-2]
    fib.append(prox_fib)

print("Sequência Fibonacci até", n, ": ", fib)

print("Números informados:")
for i in range(1, n+1):
    print(i)
