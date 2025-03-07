async function fetchEncryptedMessage() {
    try {
        const response = await fetch('/encrypt');
        if (!response.ok) throw new Error('Failed to fetch encrypted message');
        return await response.json();
    } catch (error) {
        console.error("Error fetching encrypted message:", error);
        return null;
    }
}

function decryptMessage(encryptedText) {
    return atob(encryptedText); // Base64 Decoding
}

async function verifyDecryption(decryptedText) {
    const verificationData = {
        decrypted_text: decryptedText,
        email: "user@example.com",
        phone_number: "1234567890",
        name: "User Name",
        user_submitted_code: "your_solution_code_here"
    };

    try {
        const response = await fetch('/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verificationData)
        });
        const result = await response.json();
        return result.message;
    } catch (error) {
        console.error("Error verifying decryption:", error);
        return "Verification failed";
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const data = await fetchEncryptedMessage();
    if (!data || !data.encrypted_text) {
        document.getElementById("decryptedText").innerText = "Invalid data received";
        return;
    }

    const decryptedText = decryptMessage(data.encrypted_text);
    document.getElementById("decryptedText").innerText = decryptedText;

    const verificationResult = await verifyDecryption(decryptedText);
    document.getElementById("verificationResult").innerText = verificationResult;
});
