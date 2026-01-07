// Configuration: Define what inputs are needed for each formula
const formulaConfig = {
    hargreaves: [
        { id: 'T_mean', label: 'Mean Temperature (T_mean) [°C]', placeholder: 'e.g., 25' },
        { id: 'T_max', label: 'Max Temperature (T_max) [°C]', placeholder: 'e.g., 30' },
        { id: 'T_min', label: 'Min Temperature (T_min) [°C]', placeholder: 'e.g., 20' },
        { id: 'Ra', label: 'Extraterrestrial Radiation (Ra)', placeholder: 'MJ m-2 day-1' }
    ],
    blaney_criddle: [
        { id: 'Ta', label: 'Mean Air Temperature (Ta) [°F]', placeholder: 'e.g., 70' },
        { id: 'Kc', label: 'Crop Coefficient (Kc)', placeholder: 'e.g., 0.85' }
    ],
    gdd_arnold: [
        { id: 'TM', label: 'Max Daily Temp (TM)', placeholder: '°C' },
        { id: 'Tm', label: 'Min Daily Temp (Tm)', placeholder: '°C' },
        { id: 'Tb', label: 'Base Temperature (Tb)', placeholder: '°C' }
    ],
    ndvi: [
        { id: 'NIR', label: 'Near-Infrared (NIR)', placeholder: 'Reflectance (0-1)' },
        { id: 'Red', label: 'Red Band', placeholder: 'Reflectance (0-1)' }
    ],
    savi: [
        { id: 'NIR', label: 'Near-Infrared (NIR)', placeholder: 'Reflectance' },
        { id: 'Red', label: 'Red Band', placeholder: 'Reflectance' },
        { id: 'L', label: 'Soil Adjustment Factor (L)', placeholder: 'Usually 0.5' }
    ]
};

const select = document.getElementById('formula-select');
const container = document.getElementById('inputs-container');
const resultArea = document.getElementById('result-area');
const resultDisplay = document.getElementById('result-display');
const unitDisplay = document.getElementById('unit-display');

// Listen for dropdown changes
select.addEventListener('change', function() {
    const method = this.value;
    const inputs = formulaConfig[method];
    
    // Clear previous inputs and result
    container.innerHTML = '';
    resultArea.classList.add('hidden');

    // Generate new inputs
    if (inputs) {
        inputs.forEach(field => {
            const div = document.createElement('div');
            div.className = 'input-group';
            
            const label = document.createElement('label');
            label.innerText = field.label;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.id = field.id;
            input.placeholder = field.placeholder;
            
            div.appendChild(label);
            div.appendChild(input);
            container.appendChild(div);
        });
    }
});

// Send data to Flask backend
async function calculate() {
    const method = select.value;
    if (!method) return;

    const inputs = {};
    const config = formulaConfig[method];
    let valid = true;

    // Gather values
    config.forEach(field => {
        const val = document.getElementById(field.id).value;
        if (val === '') valid = false;
        inputs[field.id] = val;
    });

    if (!valid) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formula: method, inputs: inputs })
        });

        const data = await response.json();

        if (data.error) {
            alert("Error: " + data.error);
        } else {
            resultDisplay.innerText = data.result;
            unitDisplay.innerText = data.unit;
            resultArea.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
