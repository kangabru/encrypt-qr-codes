import argparse, cv2, json
from Crypto.Cipher import AES
from Crypto.Hash import SHA256
from Crypto.Protocol.KDF import PBKDF2

ITERATIONS = {
    "v0": 100000,
    "v1": 600000,
}

def decrypt(image_path: str, password: str):
    # Read QR code
    try:
        detector = cv2.QRCodeDetector()
        image = cv2.imread(image_path)
        data_str = detector.detectAndDecode(image)[0]
    except:
        raise Exception("Could not read QR code")

    # Extract encrypted data
    iv, salt, ciphertext, version = None, None, None, None
    try:
        data = json.loads(data_str)

        iv = bytes.fromhex(data['iv'])
        salt = bytes.fromhex(data['salt'])
        ciphertext_raw = bytes.fromhex(data['cipherText'])
        version = data.get('vers')
    except:
        raise Exception("Could not parse QR code data")

    # Decrypt data
    plaintext = None
    try:
        tag, ciphertext = ciphertext_raw[-16:], ciphertext_raw[:-16]

        iterations = ITERATIONS.get(version or "v0")

        key = PBKDF2(password, salt, count=iterations, hmac_hash_module=SHA256, dkLen=32)
        cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
        plaintext_bytes = cipher.decrypt_and_verify(ciphertext, tag)
        plaintext = plaintext_bytes.decode()
    except:
        raise Exception("Could not decrypt data. Is the password correct?")
        exit(1)

    return plaintext


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Decrypt QR code from an image.')
    parser.add_argument('image_path', help='The path to the image file containing the QR code.')
    parser.add_argument('password', help='The password for decrypting the QR code.')
    args = parser.parse_args()

    plaintext = decrypt(args.image_path, args.password)
    print('Decrypted data:', plaintext)
