// Get references to DOM elements
const voiceBtn = document.getElementById('voice-btn');
const resultInput = document.getElementById('result');
const volumeControl = document.getElementById('volume-control');
const speedControl = document.getElementById('speed-control');

// Initialize speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Voice button event listener
voiceBtn.addEventListener('click', () => {
    resultInput.value = '';
    recognition.start();
});

// Handle speech recognition result
recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    resultInput.value = spokenText;

    try {
        const calculation = performCalculation(spokenText);
        resultInput.value = `${spokenText} = ${calculation}`;
        speakResult(`${spokenText} equals ${calculation}`);
    } catch (error) {
        resultInput.value = 'Error!';
        speakResult('Sorry, there was an error in your calculation');
    }
};

// Perform calculations based on voice input
// Perform calculations based on voice input
function performCalculation(input) {
    // Normalize the input to handle common words
    input = input.toLowerCase()
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/times|multiplied by/g, '*')
        .replace(/divided by/g, '/')
        .replace(/power of|to the power of/g, '**')
        .replace(/square root of|root of/g, 'sqrt')
        .replace(/log of|logarithm of/g, 'Math.log')
        .replace(/absolute value of/g, 'Math.abs')
        .replace(/degree/g, '* Math.PI / 180')  // For angles if required
        .replace(/bracket/g, '(')  // Handle 'bracket' as parentheses
        .replace(/end bracket/g, ')');  // Handle 'end bracket' as closing parentheses

    // Handle scientific functions like sqrt, log, factorial, and trigonometry
    if (input.includes('sqrt')) {
        const number = parseExpression(input.replace('sqrt', '').trim());
        return Math.sqrt(number);
    }

    if (input.includes('sin')) {
        return Math.sin(toRadians(parseExpression(input.replace('sin', '').trim())));
    }

    if (input.includes('cos')) {
        return Math.cos(toRadians(parseExpression(input.replace('cos', '').trim())));
    }

    if (input.includes('tan')) {
        return Math.tan(toRadians(parseExpression(input.replace('tan', '').trim())));
    }

    if (input.includes('log')) {
        const number = parseExpression(input.replace('log', '').trim());
        return Math.log10(number); // Ensure log base 10 is used
    }

    if (input.includes('factorial')) {
        const number = extractFactorialNumber(input);
        return factorial(number);
    }

    // Evaluate standard mathematical expressions, including parentheses
    return evaluateExpression(input);
}

// Helper function to safely evaluate expressions with parentheses
function evaluateExpression(expression) {
    try {
        // Only allow valid characters in the expression (basic mathematical operations)
        const validExpression = expression.replace(/[^0-9+\-*/().^%]/g, '');
        return eval(validExpression); // This evaluates the expression correctly with parentheses
    } catch (error) {
        throw new Error('Invalid expression');
    }
}

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Factorial function (only works for integers >= 0)
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) {
        throw new Error('Factorial only works for integers >= 0');
    }
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Extract number after "factorial of" in the input
function extractFactorialNumber(input) {
    // Look for the phrase "factorial of" and extract the number after it
    const match = input.match(/factorial of\s*(\d+)/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    } else {
        throw new Error('No valid number provided for factorial');
    }
}

// Function to parse the expression and handle potential extra spaces or characters
function parseExpression(expression) {
    return parseFloat(expression.replace(/\s+/g, ''));
}

// Factorial function (only works for integers >= 0)
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) {
        throw new Error('Factorial only works for integers >= 0');
    }
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Extract number after "factorial of" in the input
function extractFactorialNumber(input) {
    // Look for the phrase "factorial of" and extract the number after it
    const match = input.match(/factorial of\s*(\d+)/);
    if (match && match[1]) {
        return parseInt(match[1], 10);
    } else {
        throw new Error('No valid number provided for factorial');
    }
}

// Function to parse the expression and handle potential extra spaces or characters
function parseExpression(expression) {
    return parseFloat(expression.replace(/\s+/g, ''));
}

// Speak the result
function speakResult(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = parseFloat(volumeControl.value);
    utterance.rate = parseFloat(speedControl.value);
    synth.speak(utterance);
}
