// --- STEP 1: DEFINING VARIABLES (STATE) ---

// We store all our split objects here
let allocations = []; 

// We store the exchange rates fetched from the API here
let exchangeRates = {};

// DOM Elements (Variables that point to HTML tags)
const totalBudgetInput = document.getElementById('totalBudgetInput');
const allocationAmountInput = document.getElementById('allocationAmount');
const targetCurrencySelect = document.getElementById('targetCurrency');
const addSplitBtn = document.getElementById('addSplitBtn');
const allocationList = document.getElementById('allocationList');
const totalAllocatedDisplay = document.getElementById('totalAllocatedDisplay');
const remainingDisplay = document.getElementById('remainingDisplay');
const errorMessage = document.getElementById('errorMessage');
const progressBar = document.getElementById('progressBar');

// --- STEP 2: FETCHING DATA ---

// We fetch data when the page loads
async function fetchRates() {
    try {
        // Using a free API for demo purposes (USD base)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        exchangeRates = data.rates;
        console.log("Rates fetched successfully");
    } catch (error) {
        console.error("Error fetching rates:", error);
        errorMessage.textContent = "Failed to load exchange rates. Please refresh.";
        errorMessage.classList.remove('hidden');
    }
}

// Call the function immediately
fetchRates();

// --- STEP 3: HELPER FUNCTIONS ---

// Helper to calculate total used budget
// Constraint Checklist: Using 'for' loop instead of .reduce()
function calculateTotalAllocated() {
    let sum = 0;
    for (let i = 0; i < allocations.length; i++) {
        // accessing the 'amountUSD' property of the object at index i
        sum = sum + allocations[i].amountUSD;
    }
    return sum;
}

// Function to update the HTML (The View)
function updateUI() {
    // 1. Get the current total budget from input
    const totalBudget = parseFloat(totalBudgetInput.value) || 0;
    
    // 2. Calculate how much we have spent so far
    const usedAmount = calculateTotalAllocated();
    
    // 3. Calculate remaining
    const remaining = totalBudget - usedAmount;

    // 4. Update text on screen
    totalAllocatedDisplay.textContent = usedAmount.toFixed(2);
    remainingDisplay.textContent = remaining.toFixed(2);

    // 5. Update the Progress Bar width
    // Math logic: (used / total) * 100 gives percentage
    let percentage = 0;
    if (totalBudget > 0) {
        percentage = (usedAmount / totalBudget) * 100;
    }
    // Clamp percentage to max 100%
    if (percentage > 100) percentage = 100;
    progressBar.style.width = percentage + "%";

    // 6. Render the list of items
    // Constraint Checklist: Using 'for' loop instead of .map()
    allocationList.innerHTML = ""; // Clear list first
    
    for (let i = 0; i < allocations.length; i++) {
        const item = allocations[i];
        
        // Create list item element
        const li = document.createElement('li');
        li.className = "bg-gray-50 p-3 rounded border border-gray-200 flex justify-between items-center";
        
        // Create inner HTML for the list item
        li.innerHTML = `
            <div>
                <span class="font-bold text-gray-700">$${item.amountUSD.toFixed(2)}</span>
                <span class="text-gray-400 mx-2"><i class="fa-solid fa-arrow-right"></i></span>
                <span class="text-blue-600 font-bold">${item.convertedAmount.toFixed(2)} ${item.currency}</span>
            </div>
            <button onclick="removeAllocation(${i})" class="text-red-500 hover:text-red-700 text-sm">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        
        allocationList.appendChild(li);
    }
}

// --- STEP 4: EVENT LISTENERS (INTERACTION) ---

// Function called when user clicks "Add Split"
addSplitBtn.addEventListener('click', function() {
    // Reset error message
    errorMessage.classList.add('hidden');

    // Get values
    const amountUSD = parseFloat(allocationAmountInput.value);
    const targetCurr = targetCurrencySelect.value;
    const totalBudget = parseFloat(totalBudgetInput.value);

    // Validation 1: Is it a real number?
    if (!amountUSD || amountUSD <= 0) {
        errorMessage.textContent = "Please enter a valid amount greater than 0.";
        errorMessage.classList.remove('hidden');
        return; // Stop execution
    }

    // Validation 2: Do we have enough budget left?
    const currentUsed = calculateTotalAllocated();
    if (currentUsed + amountUSD > totalBudget) {
        errorMessage.textContent = "Error: This allocation exceeds your total budget!";
        errorMessage.classList.remove('hidden');
        return; // Stop execution
    }

    // Calculation
    // Get rate from our fetched object
    const rate = exchangeRates[targetCurr];
    if (!rate) {
        errorMessage.textContent = "Error: Exchange rate not found.";
        errorMessage.classList.remove('hidden');
        return;
    }

    const result = amountUSD * rate;

    // Create the object to store
    const newAllocation = {
        amountUSD: amountUSD,
        currency: targetCurr,
        convertedAmount: result
    };

    // Add to our list
    allocations.push(newAllocation);

    // Clear input field
    allocationAmountInput.value = "";

    // Refresh the screen
    updateUI();
});

// Function to handle removing an item
// We attached this to the button in the HTML string above: onclick="removeAllocation(${i})"
function removeAllocation(index) {
    // Constraint Checklist: Using .splice() to remove specific item
    allocations.splice(index, 1);
    updateUI();
}

// Update UI if user changes the total budget input manually
totalBudgetInput.addEventListener('input', function() {
    updateUI();
});