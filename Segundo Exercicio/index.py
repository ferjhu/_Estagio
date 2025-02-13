v = []

for i in range(0, 300):
    v.append(i)

n = int(input("Qual número você deseja buscar? "))

achou = False
ini = 0
fim = len(v) - 1

while ini <= fim and not achou:
    meio = (ini + fim) // 2  

    if v[meio] == n:  
        achou = True
        print (f"Número {n} encontrado no índice {meio}.")
    elif v[meio] < n:  
        ini = meio + 1
    else:  
        fim = meio - 1

if not achou:
    print (f"Número {n} não encontrado.")
