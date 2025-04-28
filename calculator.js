// Constants for carbon footprint calculations
const CARBON_FACTORS = {
    electricity: 0.000423, // metric tons CO2e per kWh
    naturalGas: 0.000183, // metric tons CO2e per kWh
    heatingOil: 0.010, // metric tons CO2e per gallon
    coal: 0.000341, // metric tons CO2e per kWh
    lpg: 0.00579, // metric tons CO2e per therm
    propane: 0.00583, // metric tons CO2e per gallon
    woodenPellets: 0.159, // metric tons CO2e per metric ton
    
    // Transport factors
    car: {
        small: 0.000192, // metric tons CO2e per mile
        medium: 0.000229, // metric tons CO2e per mile
        large: 0.000331, // metric tons CO2e per mile
        average: 0.00025, // metric tons CO2e per mile
    },
    motorbike: 0.00012, // metric tons CO2e per mile
    
    // Public transport
    bus: 0.000105, // metric tons CO2e per mile
    coach: 0.000068, // metric tons CO2e per mile
    localTrain: 0.000085, // metric tons CO2e per mile
    longDistanceTrain: 0.00006, // metric tons CO2e per mile
    tram: 0.00007, // metric tons CO2e per mile
    subway: 0.00007, // metric tons CO2e per mile
    taxi: 0.000238, // metric tons CO2e per mile
    
    // Flight factors
    flight: {
        shortHaul: 0.00025, // metric tons CO2e per mile
        mediumHaul: 0.00018, // metric tons CO2e per mile
        longHaul: 0.00016, // metric tons CO2e per mile
        radiativeFactor: 1.9, // Multiplier for radiative forcing
        classFactors: {
            economy: 1,
            business: 2.0,
            first: 3.5
        }
    },
    
    // Secondary footprint spending factors (metric tons CO2e per $)
    spending: {
        food: 0.00058,
        pharmaceuticals: 0.00043,
        clothes: 0.00054,
        paper: 0.00056,
        computers: 0.00082,
        tv: 0.00065,
        vehicles: 0.00064,
        furniture: 0.00051,
        hotels: 0.00044,
        phone: 0.00066,
        banking: 0.00051,
        insurance: 0.00051,
        education: 0.00051,
        recreational: 0.00051
    }
};

// Airports database (simplified)
const AIRPORTS = {
    "LHR": { name: "London Heathrow", lat: 51.4700, lng: -0.4543 },
    "JFK": { name: "New York JFK", lat: 40.6413, lng: -73.7781 },
    "LAX": { name: "Los Angeles", lat: 33.9416, lng: -118.4085 },
    "CDG": { name: "Paris Charles De Gaulle", lat: 49.0097, lng: 2.5479 },
    "SYD": { name: "Sydney", lat: -33.9399, lng: 151.1753 },
    "DXB": { name: "Dubai", lat: 25.2528, lng: 55.3644 },
    "SIN": { name: "Singapore Changi", lat: 1.3644, lng: 103.9915 },
    "HKG": { name: "Hong Kong", lat: 22.3080, lng: 113.9185 },
    "BKK": { name: "Bangkok", lat: 13.6900, lng: 100.7501 },
    "AMS": { name: "Amsterdam", lat: 52.3105, lng: 4.7683 },
    "FRA": { name: "Frankfurt", lat: 50.0379, lng: 8.5622 },
    "IST": { name: "Istanbul", lat: 41.2608, lng: 28.7418 },
    "MAD": { name: "Madrid", lat: 40.4983, lng: -3.5676 },
    "BCN": { name: "Barcelona", lat: 41.2971, lng: 2.0785 },
    "FCO": { name: "Rome Fiumicino", lat: 41.8003, lng: 12.2389 },
    "MUC": { name: "Munich", lat: 48.3537, lng: 11.7750 },
    "ZRH": { name: "Zurich", lat: 47.4647, lng: 8.5492 },
    "VIE": { name: "Vienna", lat: 48.1103, lng: 16.5697 },
    "CPH": { name: "Copenhagen", lat: 55.6180, lng: 12.6508 },
    "ARN": { name: "Stockholm", lat: 59.6498, lng: 17.9239 },
    "OSL": { name: "Oslo", lat: 60.1975, lng: 11.1004 },
    "HEL": { name: "Helsinki", lat: 60.3183, lng: 24.9497 },
    "SVO": { name: "Moscow", lat: 55.9736, lng: 37.4125 }
};

// Car database (simplified)
const CARS = {
    "Small Car (Up to 1.4L)": 35,
    "Medium Car (1.4L - 2.0L)": 30,
    "Large Car (Over 2.0L)": 25,
    "Small Hybrid": 55,
    "Medium Hybrid": 45,
    "Large Hybrid": 40,
    "Electric Vehicle": 95,
    "SUV": 20,
    "Pickup Truck": 18,
    "Minivan": 22
};

// Motorbike types
const MOTORBIKES = {
    "Small (Up to 125cc)": 85,
    "Medium (125cc - 500cc)": 65,
    "Large (Over 500cc)": 45,
    "Electric": 95
};

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    setupTabs();
    
    // Initialize forms
    initializeForms();
    
    // Set up car and motorbike dropdowns
    populateVehicleDropdowns();
    
    // Initialize date pickers
    setupDatePickers();
    
    // Set up event listeners for calculation
    setupEventListeners();
    
    // Add airport autocomplete
    setupAirportAutocomplete();
});

// Set up tab navigation
function setupTabs() {
    // Hide all calculator forms initially
    const forms = document.querySelectorAll('.calculator-form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Show household form by default
    document.getElementById('household').style.display = 'block';
    
    // Highlight the household tab button
    document.querySelector('.tab-button').classList.add('active');
}

// Function to switch between tabs
function showTab(tabId) {
    // Hide all calculator forms
    const forms = document.querySelectorAll('.calculator-form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Show the selected form
    document.getElementById(tabId).style.display = 'block';
    
    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase().includes(tabId.toLowerCase())) {
            button.classList.add('active');
        }
    });
}

// Initialize forms
function initializeForms() {
    // Set current date for date pickers
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    
    document.getElementById('start-date').valueAsDate = oneMonthAgo;
    document.getElementById('end-date').valueAsDate = today;
}

// Populate vehicle dropdowns
function populateVehicleDropdowns() {
    // Car dropdown
    const carSelect = document.getElementById('car-vehicle');
    carSelect.innerHTML = '<option value="manual">Enter efficiency manually</option>';
    
    for (const car in CARS) {
        const option = document.createElement('option');
        option.value = car;
        option.textContent = `${car} (approx. ${CARS[car]} mpg)`;
        carSelect.appendChild(option);
    }
    
    // Car dropdown change handler
    carSelect.addEventListener('change', function() {
        const efficiencyInput = document.getElementById('car-efficiency');
        if (this.value !== 'manual') {
            efficiencyInput.value = CARS[this.value];
            efficiencyInput.disabled = true;
        } else {
            efficiencyInput.value = '';
            efficiencyInput.disabled = false;
        }
    });
    
    // Motorbike dropdown
    const motorbikeSelect = document.getElementById('motorbike-type');
    motorbikeSelect.innerHTML = '<option value="manual">Enter efficiency manually</option>';
    
    for (const motorbike in MOTORBIKES) {
        const option = document.createElement('option');
        option.value = motorbike;
        option.textContent = `${motorbike} (approx. ${MOTORBIKES[motorbike]} mpg)`;
        motorbikeSelect.appendChild(option);
    }
    
    // Motorbike dropdown change handler
    motorbikeSelect.addEventListener('change', function() {
        const efficiencyInput = document.getElementById('motorbike-efficiency');
        if (this.value !== 'manual') {
            efficiencyInput.value = MOTORBIKES[this.value];
            efficiencyInput.disabled = true;
        } else {
            efficiencyInput.value = '';
            efficiencyInput.disabled = false;
        }
    });
}

// Setup date pickers
function setupDatePickers() {
    // Add event listeners to update period text when dates change
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    
    startDate.addEventListener('change', updatePeriodText);
    endDate.addEventListener('change', updatePeriodText);
    
    // Initial update
    updatePeriodText();
}

// Update period text
function updatePeriodText() {
    const startDate = document.getElementById('start-date').valueAsDate;
    const endDate = document.getElementById('end-date').valueAsDate;
    
    if (startDate && endDate) {
        // Calculate days in period
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Update period text in each calculator form
        const forms = document.querySelectorAll('.calculator-form h3');
        forms.forEach(formTitle => {
            const formName = formTitle.textContent.split(' ')[0];
            formTitle.textContent = `${formName} Carbon Footprint (${diffDays} days)`;
        });
    }
}

// Setup airport autocomplete
function setupAirportAutocomplete() {
    const fromInput = document.getElementById('flights-from');
    const toInput = document.getElementById('flights-to');
    const viaInput = document.getElementById('flights-via');
    
    [fromInput, toInput, viaInput].forEach(input => {
        input.addEventListener('input', function() {
            const value = this.value.toUpperCase();
            let matches = [];
            
            // Clear existing datalist if present
            const existingDatalist = document.getElementById(`${this.id}-list`);
            if (existingDatalist) {
                existingDatalist.remove();
            }
            
            // Create new datalist
            const datalist = document.createElement('datalist');
            datalist.id = `${this.id}-list`;
            
            // If input is at least 2 characters, search for matches
            if (value.length >= 2) {
                for (const code in AIRPORTS) {
                    const airport = AIRPORTS[code];
                    if (code.includes(value) || airport.name.toUpperCase().includes(value)) {
                        matches.push({ code, name: airport.name });
                    }
                    
                    // Limit to 10 suggestions
                    if (matches.length >= 10) break;
                }
                
                // Add matches to datalist
                matches.forEach(match => {
                    const option = document.createElement('option');
                    option.value = match.code;
                    option.textContent = `${match.code} - ${match.name}`;
                    datalist.appendChild(option);
                });
                
                // Add datalist to document
                document.body.appendChild(datalist);
                this.setAttribute('list', datalist.id);
            }
        });
    });
}

// Setup event listeners for calculation
function setupEventListeners() {
    // Add click event to calculate button in each form
    document.getElementById('offset-now').addEventListener('click', calculateTotal);
}

// Calculate household footprint
function calculateHousehold() {
    const people = parseFloat(document.getElementById('household-people').value) || 1;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const naturalGas = parseFloat(document.getElementById('natural-gas').value) || 0;
    const heatingOil = parseFloat(document.getElementById('heating-oil').value) || 0;
    const coal = parseFloat(document.getElementById('coal').value) || 0;
    const lpg = parseFloat(document.getElementById('lpg').value) || 0;
    const propane = parseFloat(document.getElementById('propane').value) || 0;
    const woodenPellets = parseFloat(document.getElementById('wooden-pellets').value) || 0;
    
    // Calculate carbon footprint
    let footprint = 0;
    footprint += electricity * CARBON_FACTORS.electricity;
    footprint += naturalGas * CARBON_FACTORS.naturalGas;
    footprint += heatingOil * CARBON_FACTORS.heatingOil;
    footprint += coal * CARBON_FACTORS.coal;
    footprint += lpg * CARBON_FACTORS.lpg;
    footprint += propane * CARBON_FACTORS.propane;
    footprint += woodenPellets * CARBON_FACTORS.woodenPellets;
    
    // Per person footprint
    const perPersonFootprint = footprint / people;
    
    // Update result
    const resultElement = document.getElementById('household-result');
    resultElement.innerHTML = `
        <h4>Household Carbon Footprint:</h4>
        <p>Total: ${footprint.toFixed(2)} metric tons CO2e</p>
        <p>Per person: ${perPersonFootprint.toFixed(2)} metric tons CO2e</p>
    `;
    
    // Update summary
    document.getElementById('household-footprint').textContent = perPersonFootprint.toFixed(2);
    
    // Calculate total
    calculateTotal();
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    return perPersonFootprint;
}

// Calculate flights footprint
function calculateFlights() {
    const from = document.getElementById('flights-from').value.trim();
    const to = document.getElementById('flights-to').value.trim();
    const via = document.getElementById('flights-via').value.trim();
    const flightClass = document.getElementById('flights-class').value;
    const trips = parseInt(document.getElementById('flights-trips').value) || 1;
    const includeRadiative = document.getElementById('flights-radiative').checked;
    
    // Validate inputs
    if (!from || !to) {
        alert('Please enter departure and arrival airports');
        return 0;
    }
    
    // Calculate distances
    let totalDistance = 0;
    
    if (AIRPORTS[from] && AIRPORTS[to]) {
        // Direct flight
        totalDistance = calculateDistance(AIRPORTS[from], AIRPORTS[to]);
        
        // Via flight
        if (via && AIRPORTS[via]) {
            totalDistance = calculateDistance(AIRPORTS[from], AIRPORTS[via]) + 
                            calculateDistance(AIRPORTS[via], AIRPORTS[to]);
        }
    } else {
        // Fallback: estimate distance based on flight type
        // Short haul < 1000 miles, Long haul > 3000 miles
        if (confirm('Airport codes not found. Would you like to estimate based on flight type?')) {
            const flightType = prompt('Enter flight type (short, medium, or long):');
            switch (flightType.toLowerCase()) {
                case 'short':
                    totalDistance = 500;
                    break;
                case 'medium':
                    totalDistance = 2000;
                    break;
                case 'long':
                    totalDistance = 5000;
                    break;
                default:
                    totalDistance = 1000;
            }
        } else {
            alert('Please enter valid airport codes (e.g., LHR for London Heathrow)');
            return 0;
        }
    }
    
    // Calculate emissions
    let emissionFactor;
    if (totalDistance <= 1000) {
        emissionFactor = CARBON_FACTORS.flight.shortHaul;
    } else if (totalDistance <= 3000) {
        emissionFactor = CARBON_FACTORS.flight.mediumHaul;
    } else {
        emissionFactor = CARBON_FACTORS.flight.longHaul;
    }
    
    // Apply class factor
    emissionFactor *= CARBON_FACTORS.flight.classFactors[flightClass];
    
    // Apply radiative forcing if selected
    if (includeRadiative) {
        emissionFactor *= CARBON_FACTORS.flight.radiativeFactor;
    }
    
    // Calculate total emissions
    const emissions = totalDistance * emissionFactor * trips * 2; // Return trip
    
    // Update result
    const resultElement = document.getElementById('flights-result');
    resultElement.innerHTML = `
        <h4>Flight Carbon Footprint:</h4>
        <p>Distance: ${Math.round(totalDistance)} miles one way</p>
        <p>Emissions: ${emissions.toFixed(2)} metric tons CO2e for ${trips} round-trip(s)</p>
    `;
    
    // Update summary
    document.getElementById('flights-footprint').textContent = emissions.toFixed(2);
    
    // Calculate total
    calculateTotal();
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    return emissions;
}

// Calculate car footprint
function calculateCar() {
    const mileage = parseFloat(document.getElementById('car-mileage').value) || 0;
    const vehicle = document.getElementById('car-vehicle').value;
    let efficiency = parseFloat(document.getElementById('car-efficiency').value) || 0;
    
    // Get efficiency if a vehicle type is selected
    if (vehicle !== 'manual' && CARS[vehicle]) {
        efficiency = CARS[vehicle];
    }
    
    // Validate inputs
    if (mileage <= 0) {
        alert('Please enter valid mileage');
        return 0;
    }
    
    if (efficiency <= 0) {
        alert('Please enter valid fuel efficiency or select a vehicle type');
        return 0;
    }
    
    // Calculate emissions
    // Convert mpg to emissions factor (based on average gasoline carbon content)
    const emissionFactor = 19.6 / efficiency; // 19.6 lbs CO2 per gallon of gasoline
    const emissions = (mileage * emissionFactor) / 2204.62; // Convert lbs to metric tons
    
    // Update result
    const resultElement = document.getElementById('car-result');
    resultElement.innerHTML = `
        <h4>Car Carbon Footprint:</h4>
        <p>Mileage: ${mileage} miles</p>
        <p>Efficiency: ${efficiency} mpg</p>
        <p>Emissions: ${emissions.toFixed(2)} metric tons CO2e</p>
    `;
    
    // Update summary
    document.getElementById('car-footprint').textContent = emissions.toFixed(2);
    
    // Calculate total
    calculateTotal();
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    return emissions;
}

// Calculate motorbike footprint
function calculateMotorbike() {
    const mileage = parseFloat(document.getElementById('motorbike-mileage').value) || 0;
    const type = document.getElementById('motorbike-type').value;
    let efficiency = parseFloat(document.getElementById('motorbike-efficiency').value) || 0;
    
    // Get efficiency if a motorbike type is selected
    if (type !== 'manual' && MOTORBIKES[type]) {
        efficiency = MOTORBIKES[type];
    }
    
    // Validate inputs
    if (mileage <= 0) {
        alert('Please enter valid mileage');
        return 0;
    }
    
    if (efficiency <= 0) {
        alert('Please enter valid fuel efficiency or select a motorbike type');
        return 0;
    }
    
    // Calculate emissions
    // Convert mpg to emissions factor (based on average gasoline carbon content)
    const emissionFactor = 19.6 / efficiency; // 19.6 lbs CO2 per gallon of gasoline
    const emissions = (mileage * emissionFactor) / 2204.62; // Convert lbs to metric tons
    
    // Update result
    const resultElement = document.getElementById('motorbike-result');
    resultElement.innerHTML = `
        <h4>Motorbike Carbon Footprint:</h4>
        <p>Mileage: ${mileage} miles</p>
        <p>Efficiency: ${efficiency} mpg</p>
        <p>Emissions: ${emissions.toFixed(2)} metric tons CO2e</p>
    `;
    
    // Update summary
    document.getElementById('motorbike-footprint').textContent = emissions.toFixed(2);
    
    // Calculate total
    calculateTotal();
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    return emissions;
}

// Calculate public transport footprint
function calculatePublic() {
    const bus = parseFloat(document.getElementById('bus').value) || 0;
    const coach = parseFloat(document.getElementById('coach').value) || 0;
    const localTrain = parseFloat(document.getElementById('local-train').value) || 0;
    const longDistanceTrain = parseFloat(document.getElementById('long-distance-train').value) || 0;
    const tram = parseFloat(document.getElementById('tram').value) || 0;
    const subway = parseFloat(document.getElementById('subway').value) || 0;
    const taxi = parseFloat(document.getElementById('taxi').value) || 0;
    
    // Calculate emissions
    const busEmissions = bus * CARBON_FACTORS.bus;
    const coachEmissions = coach * CARBON_FACTORS.coach;
    const localTrainEmissions = localTrain * CARBON_FACTORS.localTrain;
    const longDistanceTrainEmissions = longDistanceTrain * CARBON_FACTORS.longDistanceTrain;
    const tramEmissions = tram * CARBON_FACTORS.tram;
    const subwayEmissions = subway * CARBON_FACTORS.subway;
    const taxiEmissions = taxi * CARBON_FACTORS.taxi;
    
    const totalEmissions = busEmissions + coachEmissions + localTrainEmissions + 
                          longDistanceTrainEmissions + tramEmissions + subwayEmissions + taxiEmissions;
    
    // Update result
    const resultElement = document.getElementById('public-result');
    resultElement.innerHTML = `
        <h4>Public Transport Carbon Footprint:</h4>
        <p>Bus: ${busEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Coach: ${coachEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Local Train: ${localTrainEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Long Distance Train: ${longDistanceTrainEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Tram: ${tramEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Subway: ${subwayEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Taxi: ${taxiEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Total: ${totalEmissions.toFixed(2)} metric tons CO2e</p>
    `;
    
    // Update summary
    document.getElementById('public-footprint').textContent = totalEmissions.toFixed(2);
    
    // Calculate total
    calculateTotal();
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    return totalEmissions;
}

// Calculate secondary footprint
function estimateSecondary() {
    const food = parseFloat(document.getElementById('food').value) || 0;
    const pharmaceuticals = parseFloat(document.getElementById('pharmaceuticals').value) || 0;
    const clothes = parseFloat(document.getElementById('clothes').value) || 0;
    const paper = parseFloat(document.getElementById('paper').value) || 0;
    const computers = parseFloat(document.getElementById('computers').value) || 0;
    const tv = parseFloat(document.getElementById('tv').value) || 0;
    const vehicles = parseFloat(document.getElementById('vehicles').value) || 0;
    const furniture = parseFloat(document.getElementById('furniture').value) || 0;
    const hotels = parseFloat(document.getElementById('hotels').value) || 0;
    const phone = parseFloat(document.getElementById('phone').value) || 0;
    const banking = parseFloat(document.getElementById('banking').value) || 0;
    const insurance = parseFloat(document.getElementById('insurance').value) || 0;
    const education = parseFloat(document.getElementById('education').value) || 0;
    const recreational = parseFloat(document.getElementById('recreational').value) || 0;
    
    // Calculate emissions
    const foodEmissions = food * CARBON_FACTORS.spending.food;
    const pharmaceuticalsEmissions = pharmaceuticals * CARBON_FACTORS.spending.pharmaceuticals;
    const clothesEmissions = clothes * CARBON_FACTORS.spending.clothes;
    const paperEmissions = paper * CARBON_FACTORS.spending.paper;
    const computersEmissions = computers * CARBON_FACTORS.spending.computers;
    const tvEmissions = tv * CARBON_FACTORS.spending.tv;
    const vehiclesEmissions = vehicles * CARBON_FACTORS.spending.vehicles;
    const furnitureEmissions = furniture * CARBON_FACTORS.spending.furniture;
    const hotelsEmissions = hotels * CARBON_FACTORS.spending.hotels;
    const phoneEmissions = phone * CARBON_FACTORS.spending.phone;
    const bankingEmissions = banking * CARBON_FACTORS.spending.banking;
    const insuranceEmissions = insurance * CARBON_FACTORS.spending.insurance;
    const educationEmissions = education * CARBON_FACTORS.spending.education;
    const recreationalEmissions = recreational * CARBON_FACTORS.spending.recreational;
    
    const totalEmissions = foodEmissions + pharmaceuticalsEmissions + clothesEmissions + 
                          paperEmissions + computersEmissions + tvEmissions + 
                          vehiclesEmissions + furnitureEmissions + hotelsEmissions + 
                          phoneEmissions + bankingEmissions + insuranceEmissions + 
                          educationEmissions + recreationalEmissions;
    
    // Update result
    const resultElement = document.getElementById('secondary-result');
    resultElement.innerHTML = `
        <h4>Secondary Carbon Footprint:</h4>
        <p>Food: ${foodEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Pharmaceuticals: ${pharmaceuticalsEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Clothes: ${clothesEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Paper: ${paperEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Computers: ${computersEmissions.toFixed(2)} metric tons CO2e</p>
        <p>TV & Electronics: ${tvEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Vehicles: ${vehiclesEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Furniture: ${furnitureEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Hotels & Restaurants: ${hotelsEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Phone: ${phoneEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Banking: ${bankingEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Insurance: ${insuranceEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Education: ${educationEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Recreational: ${recreationalEmissions.toFixed(2)} metric tons CO2e</p>
        <p>Total: ${totalEmissions.toFixed(2)} metric tons CO2e</p>
    `;
    
    // Update summary
    document.getElementById('secondary-footprint').textContent = totalEmissions.toFixed(2);
    
    // Calculate total
    calculateTotal();
    
    // Show results section
    document.getElementById('results').style.display = 'block';
    
    return totalEmissions;
}

// Calculate total footprint
function calculateTotal() {
    const household = parseFloat(document.getElementById('household-footprint').textContent) || 0;
    const flights = parseFloat(document.getElementById('flights-footprint').textContent) || 0;
    const car = parseFloat(document.getElementById('car-footprint').textContent) || 0;
    const motorbike = parseFloat(document.getElementById('motorbike-footprint').textContent) || 0;
    const publicTransport = parseFloat(document.getElementById('public-footprint').textContent) || 0;
    const secondary = parseFloat(document.getElementById('secondary-footprint').textContent) || 0;
    
    const total = household + flights + car + motorbike + publicTransport + secondary;
    
    // Update total
    document.getElementById('total-footprint').textContent = total.toFixed(2);
    
    // Add visual indicator of carbon footprint
    const totalElement = document.getElementById('total-footprint');
    totalElement.className = '';
    
    if (total < 5) {
        totalElement.classList.add('low-carbon');
    } else if (total < 10) {
        totalElement.classList.add('medium-carbon');
    } else {
        totalElement.classList.add('high-carbon');
    }
    
    // Show comparison to global average
    const averageComparison = total / 4.5; // Global average is about 4.5 tons CO2e per person
    
    const comparisonElement = document.createElement('p');
    comparisonElement.innerHTML = `Your carbon footprint is ${averageComparison.toFixed(1)}x the global average per person.`;
    
    // Get the existing comparison element or create a new one
    const existingComparison = document.getElementById('average-comparison');
    if (existingComparison) {
        existingComparison.innerHTML = comparisonElement.innerHTML;
    } else {
        comparisonElement.id = 'average-comparison';
        document.getElementById('results-summary').appendChild(comparisonElement);
    }
    
    // Calculate offset cost (approximately $15 per ton)
    const offsetCost = total * 15;
    
    const offsetElement = document.createElement('p');
    offsetElement.innerHTML = `Estimated cost to offset: $${offsetCost.toFixed(2)}`;
    
    // Get the existing offset element or create a new one
    const existingOffset = document.getElementById('offset-cost');
    if (existingOffset) {
        existingOffset.innerHTML = offsetElement.innerHTML;
    } else {
        offsetElement.id = 'offset-cost';
        document.getElementById('results-summary').appendChild(offsetElement);
    }
    
    // Show offset button
    document.getElementById('offset-section').style.display = 'block';
    
    return total;
}