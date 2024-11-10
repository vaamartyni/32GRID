// src/utils.js

// Function to convert fileNumber to numbering (e.g., 11 -> 1.1)
export const convertFileNumberToNumbering = (fileNumber) => {
    const firstDigit = Math.floor(fileNumber / 10);
    const secondDigit = fileNumber % 10;
    return `${firstDigit}.${secondDigit}`;
};
