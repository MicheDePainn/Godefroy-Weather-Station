import requests
import json
import time
from datetime import datetime


HASS_API_URL = "http://localhost:8123/api/states"  # url de l'api home assistant
HASS_API_KEY = "YOUR_API_KEY"  # mettre clé d'api

# mettre le nom des capteurs
SENSORS = {
    "temperature": "sensor.temperature",
    "vent": "sensor.wind_speed",
    "pluie": "sensor.rain",
    "pollution": "sensor.pollution",
    "pression": "sensor.pressure",
    "uv": "sensor.uv_index"
}

JSON_FILE = "data.json"

# récupérer données de home assistant
def get_sensor_data():
    headers = {"Authorization": f"Bearer {HASS_API_KEY}"}
    sensor_data = {}

    for sensor_name, sensor_id in SENSORS.items():
        response = requests.get(f"{HASS_API_URL}/{sensor_id}", headers=headers)
        if response.status_code == 200:
            data = response.json()
            sensor_data[sensor_name] = data['state']
        else:
            print(f"Erreur lors de la récupération de {sensor_name} : {response.status_code}")
            sensor_data[sensor_name] = None

    return sensor_data

# enregistrer et modifier le json
def save_data_to_json(data):
    try:
        with open(JSON_FILE, "r") as f:
            json_data = json.load(f)
    except FileNotFoundError:
        json_data = {"valeurs": []}

    # données
    new_entry = {
        "datetime": datetime.now().strftime("%Y-%m-%dT%H:%M"),
        "temperature": data.get("temperature"),
        "vent": data.get("vent"),
        "pluie": data.get("pluie"),
        "pollution": data.get("pollution"),
        "pression": data.get("pression"),
        "uv": data.get("uv")
    }
    
    json_data["valeurs"].append(new_entry)

    # sauvegarder
    with open(JSON_FILE, "w") as f:
        json.dump(json_data, f, indent=4)

# Boucle pour exécuter toutes les 5 minutes
if __name__ == "__main__":
    while True:
        print("récupération des données")
        sensor_data = get_sensor_data()
        save_data_to_json(sensor_data)

        # attendre 5 minutes
        time.sleep(300)
