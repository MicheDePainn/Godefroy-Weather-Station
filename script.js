function validateDateTime() {
    var input = document.getElementById("datetime-input");
    var errorMessage = document.getElementById("error-message");

    var inputDate = input.value ? new Date(input.value).getTime() : null;
    var now = new Date().getTime();

    if (!input.value || inputDate > now) {
        errorMessage.style.display = "block";
        errorMessage.textContent = inputDate > now ? "La date et l'heure doivent être dans le passé ou actuelle." : "Veuillez sélectionner une date et une heure.";
    } else {
        errorMessage.style.display = "none";
    }
}
document.querySelector(".PlusDInfos").addEventListener("click", function () {
    document.getElementById("modalOverlay").style.display = "flex";
});

document.getElementById("modalOverlay").addEventListener("click", function (e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const titles = document.querySelectorAll("[class^='title']");
    titles.forEach((title) => {
        title.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            document.querySelectorAll(".content").forEach((c) => c.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const titles = document.querySelectorAll(".title");
    titles.forEach((title) => {
        title.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            document.querySelectorAll(".content").forEach((c) => c.classList.remove("active"));
            document.getElementById(targetId).classList.add("active");
        });
    });

    document.querySelector(".PlusDInfos2").addEventListener("click", function () {
        document.getElementById("uvModal").style.display = "flex";
    });

    document.getElementById("uvModal").addEventListener("click", function (e) {
        if (e.target === this) this.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".PlusDInfos2").addEventListener("click", function () {
        const uvValue = parseFloat(document.getElementById("uv-value").textContent);
        let targetId = "";

        if (uvValue <= 2) targetId = "content-bas";
        else if (uvValue <= 5) targetId = "content-modere";
        else if (uvValue <= 7) targetId = "content-haut";
        else if (uvValue <= 10) targetId = "content-tres-haut";
        else targetId = "content-extreme";

        document.querySelectorAll(".content").forEach(c => c.classList.remove("active"));
        document.getElementById(targetId).classList.add("active");

        document.getElementById("uvModal").style.display = "block";
    });
});

let map;

function initMap() {
    const markerCoords = [45.779807308777585, 3.0934636114593017];

    if (map) {
        map.remove();
    }

    map = L.map("map", {
        center: markerCoords,
        zoom: 16,
        touchZoom: true,
        scrollWheelZoom: false
    });

    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const tileLayer = isDarkMode
        ? L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
            maxZoom: 19
        })
        : L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        })

    tileLayer.addTo(map);

    const marker = L.marker(markerCoords).addTo(map);
    marker.bindPopup("<b>Lycée Godefroy De Bouillon</b>").openPopup();
}

window.onload = initMap;

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    initMap();
});

fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
        updateWeatherData(data.valeurs[0]);

        document.getElementById("datetime-input").addEventListener("change", function (e) {
            const selectedDateTime = new Date(e.target.value);
            let foundData = data.valeurs.find((entry) => {
                const entryDateTime = new Date(entry.datetime);
                return entryDateTime.getTime() === selectedDateTime.getTime();
            });

            if (!foundData) {
                let closestEntry;
                let minDiff = Infinity;

                data.valeurs.forEach((entry) => {
                    const entryDateTime = new Date(entry.datetime);
                    const diff = Math.abs(entryDateTime - selectedDateTime);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestEntry = entry;
                    }
                });

                foundData = closestEntry;
            }

            if (foundData) {
                updateWeatherData(foundData);
                document.getElementById("error-message").style.display = "none";
            } else {
                document.getElementById("error-message").style.display = "block";
                document.getElementById("error-message").textContent = "Aucune donnée disponible pour cette date et heure.";
            }
        });
    })
    .catch((error) => console.error("Erreur:", error));

function updateWeatherData(weatherData) {
    document.getElementById("temperature").textContent = `${weatherData.temperature}°C`;
    document.getElementById("wind-speed").textContent = `${weatherData.vent} km/h`;
    document.getElementById("rain-amount").textContent = `${weatherData.pluie} mm`;
    document.getElementById("pressure").textContent = `${weatherData.pression} hPa`;
    document.getElementById("uv-value").textContent = weatherData.uv;

    const pollutionElement = document.getElementById("pollution-value");
    pollutionElement.innerHTML = `${weatherData.pollution} <span class="pollution-unit">µg/m³</span>`;

    const rectangle16 = document.querySelector(".Rectangle16");
    const pollution = weatherData.pollution;

    if (pollution < 20) {
        rectangle16.style.background = "#889e8e";
    } else if (pollution < 50) {
        rectangle16.style.background = "#9ba383";
    } else if (pollution < 100) {
        rectangle16.style.background = "#a48283";
    } else {
        rectangle16.style.background = "#a48283";
    }

    const dateTime = new Date(weatherData.datetime);
    const formattedDateTime = dateTime.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    document.getElementById("weather-date").textContent = `Infos du ${formattedDateTime}`;

    document.querySelector(".modal-dropdown-pollution").textContent = `${weatherData.pollution} µg/m³ (${getPollutionLevel(weatherData.pollution)})`;

    updateProgressBar(pollution);
}

function getPollutionLevel(pollution) {
    if (pollution < 20) return "Bon";
    if (pollution < 50) return "Modéré";
    if (pollution < 100) return "Mauvais";
    return "Dangereux";
}

function updateProgressBar(pollution) {
    const progressLevel = document.getElementById("progress-level");
    const arrow = document.getElementById("arrow");

    let levelWidth;
    if (pollution < 20) {
        levelWidth = (pollution / 20) * 20;
    } else if (pollution < 50) {
        levelWidth = 20 + ((pollution - 20) / 30) * 30;
    } else if (pollution < 100) {
        levelWidth = 50 + ((pollution - 50) / 50) * 50;
    } else {
        levelWidth = 100;
    }

    progressLevel.style.width = `${levelWidth * 2}%`;
    arrow.style.left = `${levelWidth * 2}%`;
}

function toggleRotation(element) {
    const svg = element.querySelector("svg");
    isRotating = !isRotating;

    if (isRotating) {
        svg.style.animation = "spin 2s linear 1";
    } else {
        svg.style.animation = "none";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    fetch("data.json")
        .then(response => response.json())
        .then(data => {
            if (!data.valeurs || data.valeurs.length === 0) {
                console.error("Aucune donnée disponible dans data.json");
                return;
            }

            const lastEntry = data.valeurs.reduce((latest, entry) => {
                return new Date(entry.datetime) > new Date(latest.datetime) ? entry : latest;
            }, data.valeurs[0]);
            
            if (!lastEntry.datetime) {
                console.error("Champ 'datetime' manquant dans la dernière entrée");
                return;
            }

            const lastDate = new Date(lastEntry.datetime);
            const now = new Date();
            const diffMs = now - lastDate;
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            let timeAgo = "";
            if (diffDays > 0) {
                timeAgo = `(${diffDays} jour${diffDays > 1 ? 's' : ''})`;
            } else if (diffHours > 0) {
                timeAgo = `(${diffHours} heure${diffHours > 1 ? 's' : ''})`;
            } else if (diffMinutes > 0) {
                timeAgo = `(${diffMinutes} min${diffMinutes > 1 ? 's' : ''})`;
            }

            const connectElement = document.querySelector(".Connect");
            if (connectElement) {
                connectElement.textContent = `Connecté ${timeAgo}`;
            } else {
                console.error("Élément .Connect introuvable dans le DOM");
            }
        })
        .catch(error => console.error("Erreur lors du chargement des données:", error));
});
let isRotating = false;

function toggleRotation(element) {
    const svg = element.querySelector("svg");
    isRotating = !isRotating;

    if (isRotating) {
        svg.style.animation = "spin 1s linear 1";
        svg.addEventListener('animationend', function() {
            location.reload();
        }, { once: true });
    } else {
        svg.style.animation = "none";
    }
}

document.querySelector(".settings_icon").addEventListener("click", function () {
    document.getElementById("settingsModal").style.display = "flex";
});

document.getElementById("settingsModal").addEventListener("click", function (e) {
    if (e.target === this) {
        this.style.display = "none";
    }
});
