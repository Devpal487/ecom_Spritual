async function generateKey() {
    return crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256,
        },
        true,
        ["encrypt", "decrypt"]
    );
}

// Convert ArrayBuffer to Base64 string
function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Convert Base64 string to ArrayBuffer
function base64ToBuffer(base64) {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

// Encrypt data
async function encryptData(data, key) {
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        encodedData
    );


    return {
        iv: bufferToBase64(iv),
        data: bufferToBase64(encryptedBuffer),
    };
}


async function decryptData(encryptedData, iv, key) {
    const ivBuffer = base64ToBuffer(iv);
    const dataBuffer = base64ToBuffer(encryptedData);

    const decryptedBuffer = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: ivBuffer,
        },
        key,
        dataBuffer
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
}

export { generateKey, encryptData, decryptData };