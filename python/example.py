from decrypt import decrypt

print("Decrypting example.png")
plaintext = decrypt("example.png", "password-12345")
print("Decrypted data:", plaintext)