def maior_palindromo(s):
    if not s:
        return ""

    def expandir(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]

    maior = ""
    for i in range(len(s)):
        palindromo_impar = expandir(i, i)
        palindromo_par = expandir(i, i + 1)

        if len(palindromo_impar) > len(maior):
            maior = palindromo_impar
        if len(palindromo_par) > len(maior):
            maior = palindromo_par

    return maior

entrada = "babad"
print (maior_palindromo (entrada))
