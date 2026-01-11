document.addEventListener('DOMContentLoaded', function() {
    console.log("Agricultural Calculator Script Loaded.");

    // Configuration: Define inputs for every formula
    const formulaConfig = {
        // --- Evapotranspiration ---
        hargreaves: [
            { id: 'T_mean', label: 'Mean Temp (T_mean) [°C]', placeholder: 'e.g., 25' },
            { id: 'T_max', label: 'Max Temp (T_max) [°C]', placeholder: 'e.g., 30' },
            { id: 'T_min', label: 'Min Temp (T_min) [°C]', placeholder: 'e.g., 20' },
            { id: 'Ra', label: 'Extraterrestrial Radiation (Ra)', placeholder: 'MJ m-2 day-1' }
        ],
        blaney_criddle: [
            { id: 'Ta', label: 'Mean Air Temp (Ta) [°C]', placeholder: 'e.g., 25' },
            { id: 'Kc', label: 'Crop Coefficient (Kc)', placeholder: 'e.g., 0.85' }
        ],
        fao56: [
            { id: 'Rn', label: 'Net Radiation (Rn)', placeholder: 'MJ m-2 day-1' },
            { id: 'G', label: 'Soil Heat Flux (G)', placeholder: 'MJ m-2 day-1' },
            { id: 'T_mean', label: 'Mean Air Temp (T) [°C]', placeholder: 'at 2m height' },
            { id: 'u2', label: 'Wind Speed (u2) [m/s]', placeholder: 'at 2m height' },
            { id: 'es_ea', label: 'Vapour Pressure Deficit (es-ea)', placeholder: 'kPa' },
            { id: 'Delta', label: 'Slope Vapour Curve (Δ)', placeholder: 'kPa °C-1' },
            { id: 'Gamma', label: 'Psychrometric Constant (γ)', placeholder: 'kPa °C-1' }
        ],
        stephens_stewart: [
            { id: 'Ta', label: 'Mean Temp (Ta) [°F]', placeholder: 'Formula uses °F' },
            { id: 'Rl', label: 'Solar Radiation (Rl)', placeholder: 'Langleys/day or equivalent' }
        ],
        grassi: [
            { id: 'Ta', label: 'Mean Temp (Ta) [°F]', placeholder: 'Formula uses °F' },
            { id: 'Rl', label: 'Solar Radiation (Rl)', placeholder: 'Langleys/day' },
            { id: 'Cloud', label: 'Cloud Cover Factor (Optional)', placeholder: 'Default 1 if unknown' }
        ],
        linarce: [
            { id: 'Ta', label: 'Mean Temp (Ta) [°C]', placeholder: 'e.g., 20' },
            { id: 'Td', label: 'Dew Point Temp (Td) [°C]', placeholder: 'e.g., 15' },
            { id: 'z', label: 'Elevation (z) [m]', placeholder: 'e.g., 100' },
            { id: 'lat', label: 'Latitude (φ) [Degrees]', placeholder: 'e.g., 30' }
        ],

        // --- GDD ---
        gdd_arnold: [
            { id: 'TM', label: 'Max Daily Temp (TM)', placeholder: '°C' },
            { id: 'Tm', label: 'Min Daily Temp (Tm)', placeholder: '°C' },
            { id: 'Tb', label: 'Base Temperature (Tb)', placeholder: '°C' }
        ],
        gdd_villa_nova: [
            { id: 'TM', label: 'Max Daily Temp (TM)', placeholder: '°C' },
            { id: 'Tm', label: 'Min Daily Temp (Tm)', placeholder: '°C' },
            { id: 'Tb', label: 'Base Temperature (Tb)', placeholder: '°C' }
        ],
        gdd_ometto: [
            { id: 'TM', label: 'Max Daily Temp (TM)', placeholder: '°C' },
            { id: 'Tm', label: 'Min Daily Temp (Tm)', placeholder: '°C' },
            { id: 'Tb', label: 'Min Threshold (Tb)', placeholder: '°C' },
            { id: 'TB', label: 'Max Threshold (TB)', placeholder: '°C' }
        ],
        gdd_snyder: [
            { id: 'TM', label: 'Max Daily Temp (TM)', placeholder: '°C' },
            { id: 'Tm', label: 'Min Daily Temp (Tm)', placeholder: '°C' },
            { id: 'Tb', label: 'Min Threshold (Tb)', placeholder: '°C' },
            { id: 'TB', label: 'Max Threshold (TB)', placeholder: '°C' }
        ],

        // --- Chill Units ---
        chill_utah: [
            { id: 'T_current', label: 'Current Hourly Temp [°C]', placeholder: 'Input hourly reading' }
        ],
        chill_nc: [
            { id: 'T_current', label: 'Current Hourly Temp [°C]', placeholder: 'Input hourly reading' }
        ],

        // --- Vegetation Indices ---
        ndvi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }],
        gndvi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Green', label: 'Green', placeholder: 'Reflectance' }],
        pri: [{ id: 'R531', label: 'R531', placeholder: 'Reflectance' }, { id: 'R570', label: 'R570', placeholder: 'Reflectance' }],
        ndre: [{ id: 'R790', label: 'R790 (NIR)', placeholder: 'Reflectance' }, { id: 'R720', label: 'R720 (Red Edge)', placeholder: 'Reflectance' }],
        ccci: [{ id: 'NDRE', label: 'NDRE', placeholder: 'Index Value' }, { id: 'NDRE_min', label: 'NDRE_min', placeholder: 'Soil baseline' }, { id: 'NDRE_max', label: 'NDRE_max', placeholder: 'Max canopy' }],
        rvi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }],
        evi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }, { id: 'Blue', label: 'Blue', placeholder: 'Reflectance' }],
        evi2: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }],
        varigreen: [{ id: 'Green', label: 'Green', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }, { id: 'Blue', label: 'Blue', placeholder: 'Reflectance' }],
        vari700: [{ id: 'R700', label: 'R700', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }, { id: 'Blue', label: 'Blue', placeholder: 'Reflectance' }],
        tvi: [{ id: 'R750', label: 'R750 (NIR)', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550 (Green)', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670 (Red)', placeholder: 'Reflectance' }],
        mtvi1: [{ id: 'R800', label: 'R800', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }],
        mtvi2: [{ id: 'R800', label: 'R800', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }],
        mtci: [{ id: 'R753', label: 'R753.75', placeholder: 'Reflectance' }, { id: 'R708', label: 'R708.75', placeholder: 'Reflectance' }, { id: 'R681', label: 'R681.25', placeholder: 'Reflectance' }],
        car: [{ id: 'R700', label: 'R700', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }],
        cari: [{ id: 'R700', label: 'R700', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }],
        mcari: [{ id: 'R700', label: 'R700', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }],
        mcari1: [{ id: 'R800', label: 'R800', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }],
        mcari2: [{ id: 'R800', label: 'R800', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }],
        tcari: [{ id: 'R700', label: 'R700', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }, { id: 'R550', label: 'R550', placeholder: 'Reflectance' }],
        wdvi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }, { id: 'a', label: 'Slope of Soil Line (a)', placeholder: 'Constant' }],
        pvi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }, { id: 'a', label: 'Slope (a)', placeholder: 'Constant' }, { id: 'b', label: 'Intercept (b)', placeholder: 'Constant' }],
        savi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }, { id: 'L', label: 'Soil Factor (L)', placeholder: 'Usually 0.5' }],
        tsavi: [{ id: 'R800', label: 'R800', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }, { id: 'a', label: 'Slope (a)', placeholder: 'Constant' }, { id: 'b', label: 'Intercept (b)', placeholder: 'Constant' }],
        osavi: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }],
        msavi: [{ id: 'R800', label: 'R800', placeholder: 'Reflectance' }, { id: 'R670', label: 'R670', placeholder: 'Reflectance' }],
        sarvi: [{ id: 'R800', label: 'R800', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }, { id: 'Blue', label: 'Blue', placeholder: 'Reflectance' }],
        msavi2: [{ id: 'NIR', label: 'NIR', placeholder: 'Reflectance' }, { id: 'Red', label: 'Red', placeholder: 'Reflectance' }]
    };

    const select = document.getElementById('formula-select');
    const container = document.getElementById('inputs-container');
    const resultArea = document.getElementById('result-area');
    const resultDisplay = document.getElementById('result-display');
    const unitDisplay = document.getElementById('unit-display');
    const calcBtn = document.getElementById('calc-btn');

    if (!select || !container || !calcBtn) {
        console.error("Critical Error: Elements not found in DOM.");
        return;
    }

    // Event Listener for Dropdown Change
    select.addEventListener('change', function() {
        console.log("Selection changed to:", this.value);
        const method = this.value;
        const inputs = formulaConfig[method];
        
        // Clear previous inputs
        container.innerHTML = '';
        resultArea.classList.add('hidden');

        // Generate new inputs
        if (inputs) {
            inputs.forEach(field => {
                const div = document.createElement('div');
                div.className = 'input-group';
                div.innerHTML = `
                    <label for="${field.id}">${field.label}</label>
                    <input type="number" step="any" id="${field.id}" placeholder="${field.placeholder}">
                `;
                container.appendChild(div);
            });
            console.log("Inputs generated.");
        } else {
            console.error("No configuration found for:", method);
        }
    });

    // Event Listener for Calculate Button
    calcBtn.addEventListener('click', async function() {
        console.log("Calculate button clicked.");
        const method = select.value;
        if (!method) {
            alert("Please select a formula.");
            return;
        }

        const inputs = {};
        const config = formulaConfig[method];
        let valid = true;

        if (!config) return;

        config.forEach(field => {
            const inputEl = document.getElementById(field.id);
            if (inputEl) {
                const val = inputEl.value;
                if (val === '') valid = false;
                inputs[field.id] = val;
            }
        });

        if (!valid) {
            alert("Please fill in all fields.");
            return;
        }

        console.log("Sending data:", inputs);

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formula: method, inputs: inputs })
            });
            
            const data = await response.json();
            console.log("Response received:", data);

            if (data.error) {
                alert("Error: " + data.error);
            } else {
                resultDisplay.innerText = data.result;
                unitDisplay.innerText = data.unit;
                resultArea.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            alert("Failed to connect to the calculator backend.");
        }
    });
});
