let map;
let isRotating = false;
let weatherEntries = [];
let lastWeatherData = null;

function validateDateTime() {
    const input = document.getElementById("datetime-input");
    const errorMessage = document.getElementById("error-message");

    if (!input) {
        return;
    }

    const inputDate = input.value ? new Date(input.value).getTime() : null;
    const now = new Date().getTime();

    if (!input.value || inputDate > now) {
        errorMessage.style.display = "block";
        errorMessage.textContent = inputDate > now
            ? "La date et l'heure doivent être dans le passé ou actuelle."
            : "Veuillez sélectionner une date et une heure.";
    } else {
        errorMessage.style.display = "none";
    }
}

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
        });

    tileLayer.addTo(map);

    const marker = L.marker(markerCoords).addTo(map);
    marker.bindPopup("<b>Lycée Godefroy De Bouillon</b>").openPopup();

    const mapHeight = map.getSize().y;
    const offset = mapHeight * 0.5;

    const newCenter = [
        markerCoords[0] + (offset / 100000),
        markerCoords[1]
    ];

    map.setView(newCenter, 16, { animate: true });
}

window.onload = initMap;

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    initMap();
});

function getPollutionLevel(pollution) {
    if (pollution < 20) return "Bon";
    if (pollution < 50) return "Modéré";
    if (pollution < 100) return "Mauvais";
    return "Dangereux";
}

function updatePollutionClasses(level) {
    const pollutionCard = document.querySelector(".pollution-card");
    if (!pollutionCard) {
        return;
    }

    pollutionCard.classList.remove("level-good", "level-moderate", "level-poor", "level-severe");

    switch (level) {
        case "Bon":
            pollutionCard.classList.add("level-good");
            break;
        case "Modéré":
            pollutionCard.classList.add("level-moderate");
            break;
        case "Mauvais":
            pollutionCard.classList.add("level-poor");
            break;
        default:
            pollutionCard.classList.add("level-severe");
    }
}

function updateProgressBar(pollution) {
    const progressTargets = [
        document.getElementById("progress-level"),
        document.getElementById("modal-progress-level")
    ];

    const arrowTargets = [
        document.getElementById("arrow"),
        document.getElementById("modal-arrow")
    ];

    const percentage = Math.min(100, Math.max(0, Math.round((pollution / 120) * 100)));

    progressTargets.forEach((target) => {
        if (target) {
            target.style.width = `${percentage}%`;
        }
    });

    arrowTargets.forEach((arrow) => {
        if (arrow) {
            arrow.style.left = `${percentage}%`;
        }
    });
}

function updateWeatherData(weatherData) {
    lastWeatherData = weatherData;

    const temperatureValue = Number(weatherData.temperature);
    const windValue = Number(weatherData.vent);
    const rainValue = Number(weatherData.pluie);
    const pressureValue = Number(weatherData.pression);
    const uvValue = Number(weatherData.uv);
    const pollutionValue = Number(weatherData.pollution);

    document.getElementById("temperature").textContent = Number.isFinite(temperatureValue)
        ? `${temperatureValue}°C`
        : `${weatherData.temperature}°C`;
    document.getElementById("wind-speed").textContent = Number.isFinite(windValue)
        ? `${windValue} km/h`
        : `${weatherData.vent} km/h`;
    document.getElementById("rain-amount").textContent = Number.isFinite(rainValue)
        ? `${rainValue} mm`
        : `${weatherData.pluie} mm`;
    document.getElementById("pressure").textContent = Number.isFinite(pressureValue)
        ? `${pressureValue} hPa`
        : `${weatherData.pression} hPa`;
    document.getElementById("uv-value").textContent = Number.isFinite(uvValue)
        ? uvValue
        : weatherData.uv;

    const pollutionElement = document.getElementById("pollution-value");
    const pollutionDisplayValue = Number.isFinite(pollutionValue) ? pollutionValue : weatherData.pollution;
    pollutionElement.innerHTML = `${pollutionDisplayValue} <span class="pollution-unit">µg/m³</span>`;

    const pollutionLevel = getPollutionLevel(Number.isFinite(pollutionValue) ? pollutionValue : 0);
    updatePollutionClasses(pollutionLevel);

    const dateTime = new Date(weatherData.datetime);
    const formattedDateTime = dateTime.toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    document.getElementById("weather-date").textContent = `Infos du ${formattedDateTime}`;

    const modalLabel = document.querySelector(".modal-dropdown-pollution");
    if (modalLabel) {
        modalLabel.textContent = `${pollutionDisplayValue} µg/m³ (${pollutionLevel})`;
    }

    updateProgressBar(Number.isFinite(pollutionValue) ? pollutionValue : 0);
}

function updateConnectionStatus(entries) {
    if (!Array.isArray(entries) || entries.length === 0) {
        return;
    }

    const lastEntry = entries.reduce((latest, entry) => {
        return new Date(entry.datetime) > new Date(latest.datetime) ? entry : latest;
    }, entries[0]);

    if (!lastEntry.datetime) {
        return;
    }

    const lastDate = new Date(lastEntry.datetime);
    const now = new Date();
    const diffMs = Math.max(0, now - lastDate);
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
    } else if (diffMs === 0) {
        timeAgo = `(à l'instant)`;
    }

    const connectElement = document.querySelector(".Connect");
    if (connectElement) {
        connectElement.textContent = `Connecté ${timeAgo}`;
    }
}

function toggleRotation(button) {
    if (isRotating) {
        return;
    }

    isRotating = true;
    button.classList.add("refreshing");

    const svg = button.querySelector("svg");
    if (svg) {
        svg.addEventListener("animationend", () => {
            location.reload();
        }, { once: true });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const datetimeBtn = document.getElementById("datetime-btn");
    const datetimeInput = document.getElementById("datetime-input");
    const errorMessage = document.getElementById("error-message");

    if (datetimeBtn && datetimeInput) {
        datetimeBtn.addEventListener("click", () => {
            datetimeInput.style.display = "block";
            datetimeInput.focus();
        });

        datetimeInput.addEventListener("change", (e) => {
            validateDateTime();

            if (!weatherEntries.length) {
                return;
            }

            const selectedDateTime = new Date(e.target.value);
            let foundData = weatherEntries.find((entry) => {
                const entryDateTime = new Date(entry.datetime);
                return entryDateTime.getTime() === selectedDateTime.getTime();
            });

            if (!foundData) {
                let closestEntry;
                let minDiff = Infinity;

                weatherEntries.forEach((entry) => {
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
                errorMessage.style.display = "none";
            } else {
                errorMessage.style.display = "block";
                errorMessage.textContent = "Aucune donnée disponible pour cette date et heure.";
            }
        });
    }

    const refreshButton = document.getElementById("refreshButton");
    if (refreshButton) {
        refreshButton.addEventListener("click", () => toggleRotation(refreshButton));
    }

    const settingsButton = document.querySelector(".settings_icon");
    const settingsModal = document.getElementById("settingsModal");
    if (settingsButton && settingsModal) {
        settingsButton.addEventListener("click", () => {
            settingsModal.style.display = "flex";
        });

        settingsModal.addEventListener("click", (event) => {
            if (event.target === settingsModal) {
                settingsModal.style.display = "none";
            }
        });
    }

    const pollutionButton = document.querySelector(".PlusDInfos");
    const pollutionModal = document.getElementById("modalOverlay");
    if (pollutionButton && pollutionModal) {
        pollutionButton.addEventListener("click", () => {
            if (lastWeatherData) {
                const pollutionValue = Number(lastWeatherData.pollution);
                updateProgressBar(Number.isFinite(pollutionValue) ? pollutionValue : 0);
            }
            pollutionModal.style.display = "flex";
        });

        pollutionModal.addEventListener("click", (event) => {
            if (event.target === pollutionModal) {
                pollutionModal.style.display = "none";
            }
        });
    }

    const uvButton = document.querySelector(".PlusDInfos2");
    const uvModal = document.getElementById("uvModal");
    if (uvButton && uvModal) {
        uvButton.addEventListener("click", () => {
            const uvValue = parseFloat(document.getElementById("uv-value").textContent);
            let targetId = "";

            if (uvValue <= 2) targetId = "content-bas";
            else if (uvValue <= 5) targetId = "content-modere";
            else if (uvValue <= 7) targetId = "content-haut";
            else if (uvValue <= 10) targetId = "content-tres-haut";
            else targetId = "content-extreme";

            document.querySelectorAll(".content").forEach((c) => c.classList.remove("active"));
            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add("active");
            }

            uvModal.style.display = "flex";
        });

        uvModal.addEventListener("click", (event) => {
            if (event.target === uvModal) {
                uvModal.style.display = "none";
            }
        });
    }

    const langBtn = document.getElementById('langSwitcher');
    const langDropdown = document.getElementById('langDropdown');
    const currentFlag = document.getElementById('currentFlag');
    const htmlElement = document.documentElement;

    if (langBtn && langDropdown && currentFlag) {
        const translations = {
            en: {
                "modal-title-settings": "Settings",
                "languetext": "Language",
                "datetime-btn": "Select a date and time",
                "error-message": "The date and time must be in the past or current.",
                "VitesseDuVent": "Wind Speed",
                "QuantitDePluie": "Rain Amount",
                "PollutionDansLAir": "Air Pollution",
                "PlusDInfos": "More info",
                "modal-title-pollution": "Air Pollution",
                "PressionAtmosphRique": "Atmos. Pressure",
                "PlusDInfos2": "More info",
                "IndiceUv": "UV Index",
                "title6": "LOW",
                "title7": "MODERATE",
                "title8": "HIGH",
                "title9": "VERY HIGH",
                "title10": "EXTREME",
                "content-bas2": "Low: 0-2",
                "content-bas3": "Minimal sun protection required for normal activities. Wear sunglasses on sunny days. If you stay outside for more than an hour, cover up and use sunscreen. Snow reflection can almost double UV strength. Wear sunglasses and apply sunscreen to your face.",
                "content-modere2": "Moderate: 3-5",
                "content-modere3": "Take precautions: cover up, wear a hat and sunglasses, and apply sunscreen, especially if you are outdoors for 30 minutes or more. Seek shade during midday when the sun is strongest.",
                "content-haut2": "High: 6-7",
                "content-haut3": "Protection needed - UV rays damage the skin and can cause sunburn. Avoid the sun between 11 a.m. and 3 p.m. and take full precautions: seek shade, cover up, wear a hat and sunglasses, and apply sunscreen.",
                "content-tres-haut2": "Very High: 8-10",
                "content-tres-haut3": "Extra precautions needed: unprotected skin will be damaged and can burn quickly. Avoid the sun between 11 a.m. and 3 p.m. and seek shade, cover up, wear a hat and sunglasses, and apply sunscreen.",
                "content-extreme2": "Extreme: 11+",
                "content-extreme3": "Take all precautions. Unprotected skin will be damaged and can burn in minutes. Avoid the sun between 11 a.m. and 3 p.m., cover up, wear a hat and sunglasses, and apply sunscreen. Remember that white sand and other bright surfaces reflect UV rays and increase UV exposure.",
                "EmplacementDeLaStationMTO": "Weather station location:",
                "fr": "French",
                "en": "English",
            },
            fr: {
                "modal-title-settings": "Paramètres",
                "languetext": "Langue",
                "datetime-btn": "Sélectionner une date et une heure",
                "error-message": "La date et l'heure doivent être dans le passé ou actuelle.",
                "VitesseDuVent": "Vitesse du vent",
                "QuantitDePluie": "Quantité de pluie",
                "PollutionDansLAir": "Pollution dans l’air",
                "PlusDInfos": "Plus d’infos",
                "modal-title-pollution": "Pollution dans l’air",
                "PressionAtmosphRique": "Pression atmo.",
                "PlusDInfos2": "Plus d’infos",
                "IndiceUv": "Indice UV",
                "title6": "BAS",
                "title7": "MODERE",
                "title8": "HAUT",
                "title9": "TRES HAUT",
                "title10": "EXTREME",
                "content-bas2": "Bas: 0-2",
                "content-bas3": "Protection solaire minime requise pour les activités normales. Portez des lunettes de soleil les journées ensoleillées. Si vous restez à l’extérieur pendant plus d’une heure, couvrez-vous et utilisez un écran solaire. La réflexion par la neige peut presque doubler l’intensité des rayons UV. Portez des lunettes de soleil et appliquez un écran solaire sur votre visage.",
                "content-modere2": "Modéré: 3-5",
                "content-modere3": "Prenez des précautions : couvrez-vous, portez un chapeau et des lunettes de soleil, et appliquez un écran solaire, surtout si vous êtes à l’extérieur pendant 30 minutes ou plus. Cherchez l’ombre à la mi-journée, quand le soleil est à son plus fort.",
                "content-haut2": "Haut: 6-7",
                "content-haut3": "Protection nécessaire - les rayons UV endommagent la peau et peuvent causer des coups de soleil. Évitez le soleil entre 11 h et 15 h et prenez toutes les précautions : cherchez l’ombre, couvrez-vous, portez un chapeau et des lunettes de soleil, et appliquez un écran solaire.",
                "content-tres-haut2": "Très haut: 8-10",
                "content-tres-haut3": "Précautions supplémentaires nécessaires : la peau non protégée sera endommagée et peut brûler rapidement. Évitez le soleil entre 11 h et 15 h et cherchez l’ombre, couvrez-vous, portez un chapeau et des lunettes de soleil, et appliquez un écran solaire.",
                "content-extreme2": "Extrême: 11+",
                "content-extreme3": "Prenez toutes les précautions. La peau non protégée sera endommagée et peut brûler en quelques minutes. Évitez le soleil entre 11 h et 15 h, couvrez-vous, portez un chapeau et des lunettes de soleil, et appliquez un écran solaire. N’oubliez pas que le sable blanc et les autres surfaces brillantes réfléchissent les rayons UV et augmentent l’exposition à ces rayons.",
                "EmplacementDeLaStationMTO": "Emplacement de la station météo :",
                "fr": "Français",
                "en": "Anglais",
            }
        };

        function switchLang(lang) {
            if (translations[lang]) {
                htmlElement.lang = lang;
                currentFlag.src = `https://flagcdn.com/${lang === 'en' ? 'gb' : 'fr'}.svg`;
                currentFlag.alt = lang === 'en' ? 'English Flag' : 'Drapeau Français';

                document.querySelectorAll('[data-lang]').forEach(element => {
                    const key = element.getAttribute('data-lang');
                    if (translations[lang][key]) {
                        element.textContent = translations[lang][key];
                    }
                });

                langDropdown.classList.add('hidden');
            }
        }

        langBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });

        langDropdown.addEventListener('click', (event) => {
            const targetLink = event.target.closest('a.lang-item[data-lang]');
            if (targetLink) {
                event.preventDefault();
                const selectedLang = targetLink.getAttribute('data-lang');
                switchLang(selectedLang);
            }
        });

        document.addEventListener('click', (event) => {
            if (!langBtn.contains(event.target) && !langDropdown.contains(event.target)) {
                langDropdown.classList.add('hidden');
            }
        });

        const initialLang = htmlElement.lang || 'fr';
        switchLang(initialLang);
    }

    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mainNavLinks = document.getElementById('mainNavLinks');
    if (mobileMenuButton && mainNavLinks) {
        mobileMenuButton.addEventListener('click', () => {
            mainNavLinks.classList.toggle('mobile-menu-open');
            const isExpanded = mainNavLinks.classList.contains('mobile-menu-open');
            mobileMenuButton.setAttribute('aria-expanded', String(isExpanded));
            mobileMenuButton.setAttribute('aria-label', isExpanded ? 'Fermer le menu' : 'Ouvrir le menu');
        });

        mainNavLinks.addEventListener('click', (event) => {
            if (event.target.matches('.nav-link') && mainNavLinks.classList.contains('mobile-menu-open')) {
                mainNavLinks.classList.remove('mobile-menu-open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });

        document.addEventListener('click', (event) => {
            const isClickInsideNav = mainNavLinks.contains(event.target);
            const isClickOnToggleButton = mobileMenuButton.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggleButton && mainNavLinks.classList.contains('mobile-menu-open')) {
                mainNavLinks.classList.remove('mobile-menu-open');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                mobileMenuButton.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });
    }

    fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
            if (!data.valeurs || data.valeurs.length === 0) {
                console.error("Aucune donnée disponible dans data.json");
                return;
            }

            weatherEntries = [...data.valeurs].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
            updateWeatherData(weatherEntries[0]);
            updateConnectionStatus(weatherEntries);
        })
        .catch((error) => console.error("Erreur:", error));
});
