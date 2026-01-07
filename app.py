from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__) # starts app

@app.route('/') # at route
def home():
    return render_template('index.html') # to display page

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    formula_type = data.get('formula')
    inputs = data.get('inputs')
    result = None
    unit = ""

    try:
        # --- Evapotranspiration (ET) ---
        if formula_type == "hargreaves":
            [cite_start]# [cite: 2] Hargreaves equation
            t_mean = float(inputs['T_mean'])
            t_max = float(inputs['T_max'])
            t_min = float(inputs['T_min'])
            ra = float(inputs['Ra']) # Extraterrestrial radiation
            
            # ET_o = 0.0023 * (T_mean + 17.8) * (T_max - T_min)**0.5 * Ra
            result = 0.0023 * (t_mean + 17.8) * math.sqrt(t_max - t_min) * ra
            unit = "mm/day"

        elif formula_type == "blaney_criddle":
            [cite_start]# [cite: 2] Blaney-Criddle method
            ta = float(inputs['Ta']) # Mean air temp
            kc = float(inputs['Kc']) # Crop coefficient
            p = float(inputs['p'])   # Mean daily percentage of annual daytime hours
            
            # PET = (0.0173 * Ta - 0.314) * Kc * Ta * (p/100) ... Simplified standard adaptation
            # Note: The PDF formula writes: (0.0173 Ta - 0.314) Kc * Ta ... 
            # Ideally requires specific local constants, implemented here as per PDF structure strictly:
            result = (0.0173 * ta - 0.314) * kc * ta 
            unit = "mm/day"

        # --- Growing Degree Days (GDD) ---
        elif formula_type == "gdd_arnold":
            [cite_start]# [cite: 11] Arnold (General)
            tm_big = float(inputs['TM']) # Max Temp
            tm_small = float(inputs['Tm']) # Min Temp
            tb = float(inputs['Tb']) # Base Temp
            
            # GDD = ((TM + Tm) / 2) - Tb
            result = ((tm_big + tm_small) / 2) - tb
            if result < 0: result = 0
            unit = "°C-days"

        # --- Vegetation Indices ---
        elif formula_type == "ndvi":
            [cite_start]# [cite: 16] NDVI
            nir = float(inputs['NIR'])
            red = float(inputs['Red'])
            
            # (NIR - Red) / (NIR + Red)
            if (nir + red) == 0:
                result = 0
            else:
                result = (nir - red) / (nir + red)
            unit = "Index Value"

        elif formula_type == "savi":
            [cite_start]# [cite: 19] SAVI
            nir = float(inputs['NIR'])
            red = float(inputs['Red'])
            l = float(inputs['L']) # Soil adjustment factor (usually 0.5)
            
            # ((1 + L) * (NIR - Red)) / (NIR + Red + L)
            denominator = nir + red + l
            if denominator == 0:
                result = 0
            else:
                result = ((1 + l) * (nir - red)) / denominator
            unit = "Index Value"
            
        else:
            return jsonify({'error': 'Formula not implemented yet.'})

        return jsonify({'result': round(result, 4), 'unit': unit})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
