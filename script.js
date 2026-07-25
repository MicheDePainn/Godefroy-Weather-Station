let map;
let isRotating = false;
let weatherEntries = [];
let lastWeatherData = null;

const translations = {
    en: {
        "modal-title-settings": "Settings",
        "languetext": "Language",
        "datetime-btn": "Select a date and time",
        "error-message": "The date and time must be in the past or current.",
        "error-no-data": "No data available for this date and time.",
        "error-select-datetime": "Please select a date and time.",
        "error-future-date": "The date and time must be in the past or current.",
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
        "pollution-good": "Good",
        "pollution-moderate": "Moderate",
        "pollution-poor": "Poor",
        "pollution-severe": "Dangerous",
        "InfoPrefix": "Info from",
        "conn-connected": "Connected",
        "conn-just-now": "(just now)",
        "conn-day": "day",
        "conn-days": "days",
        "conn-hour": "hour",
        "conn-hours": "hours",
        "conn-min": "min",
        "conn-mins": "mins"
    },
    fr: {
        "modal-title-settings": "Paramètres",
        "languetext": "Langue",
        "datetime-btn": "Sélectionner une date et une heure",
        "error-message": "La date et l'heure doivent être dans le passé ou actuelle.",
        "error-no-data": "Aucune donnée disponible pour cette date et heure.",
        "error-select-datetime": "Veuillez sélectionner une date et une heure.",
        "error-future-date": "La date et l'heure doivent être dans le passé ou actuelle.",
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
        "pollution-good": "Bon",
        "pollution-moderate": "Modéré",
        "pollution-poor": "Mauvais",
        "pollution-severe": "Dangereux",
        "InfoPrefix": "Infos du",
        "conn-connected": "Connecté",
        "conn-just-now": "(à l'instant)",
        "conn-day": "jour",
        "conn-days": "jours",
        "conn-hour": "heure",
        "conn-hours": "heures",
        "conn-min": "min",
        "conn-mins": "mins"
    }
};

function validateDateTime() {
    const input = document.getElementById("datetime-input");
    const errorMessage = document.getElementById("error-message");

    if (!input || !errorMessage) {
        return;
    }

    const lang = document.documentElement.lang || "fr";
    const inputDate = input.value ? new Date(input.value).getTime() : null;
    const now = new Date().getTime();

    if (!input.value || inputDate > now) {
        errorMessage.style.display = "block";
        const key = inputDate > now ? "error-future-date" : "error-select-datetime";
        errorMessage.textContent = (translations[lang] && translations[lang][key])
            ? translations[lang][key]
            : (inputDate > now ? "La date et l'heure doivent être dans le passé ou actuelle." : "Veuillez sélectionner une date et une heure.");
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
    if (pollution < 20) return "pollution-good";
    if (pollution < 50) return "pollution-moderate";
    if (pollution < 100) return "pollution-poor";
    return "pollution-severe";
}

function updatePollutionClasses(level) {
    const pollutionCard = document.querySelector(".pollution-card");
    const pollutionModal = document.getElementById("modalOverlay");

    [pollutionCard, pollutionModal].forEach(el => {
        if (!el) return;
        el.classList.remove("level-good", "level-moderate", "level-poor", "level-severe");

        switch (level) {
            case "pollution-good":
                el.classList.add("level-good");
                break;
            case "pollution-moderate":
                el.classList.add("level-moderate");
                break;
            case "pollution-poor":
                el.classList.add("level-poor");
                break;
            case "pollution-severe":
            default:
                el.classList.add("level-severe");
                break;
        }
    });
}

function updateUVClasses(uvValue) {
    const uvCard = document.querySelector(".uv-card");
    if (!uvCard) return;

    uvCard.classList.remove("uv-bas", "uv-modere", "uv-haut", "uv-tres-haut", "uv-extreme");
    
    if (uvValue <= 2) uvCard.classList.add("uv-bas");
    else if (uvValue <= 5) uvCard.classList.add("uv-modere");
    else if (uvValue <= 7) uvCard.classList.add("uv-haut");
    else if (uvValue <= 10) uvCard.classList.add("uv-tres-haut");
    else uvCard.classList.add("uv-extreme");
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
            target.style.width = `${100 - percentage}%`;
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

    const pollutionLevelKey = getPollutionLevel(Number.isFinite(pollutionValue) ? pollutionValue : 0);
    updatePollutionClasses(pollutionLevelKey);
    
    const uvValueParsed = Number.isFinite(uvValue) ? uvValue : parseFloat(weatherData.uv) || 0;
    updateUVClasses(uvValueParsed);

    const dateTime = new Date(weatherData.datetime);
    const lang = document.documentElement.lang || "fr";
    const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
    const formattedDateTime = dateTime.toLocaleString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
    
    const infoPrefix = translations[lang] && translations[lang]["InfoPrefix"] ? translations[lang]["InfoPrefix"] : (lang === 'en' ? "Info from" : "Infos du");
    document.getElementById("weather-date").textContent = `${infoPrefix} ${formattedDateTime}`;

    const modalLabel = document.querySelector(".modal-dropdown-pollution");
    if (modalLabel) {
        const pollutionLevelText = translations[lang] ? translations[lang][pollutionLevelKey] : "Inconnu";
        modalLabel.textContent = `${pollutionDisplayValue} µg/m³ (${pollutionLevelText})`;
    }

    updateProgressBar(Number.isFinite(pollutionValue) ? pollutionValue : 0);
}

function updateConnectionStatus(entries) {
    if (!Array.isArray(entries) || entries.length === 0) {
        return;
    }

    const lastEntry = entries[entries.length - 1];
    if (!lastEntry || !lastEntry.datetime) {
        return;
    }

    const lang = document.documentElement.lang || "fr";
    const t = translations[lang] || translations.fr;

    const lastDate = new Date(lastEntry.datetime);
    const now = new Date();
    const diffMs = Math.max(0, now - lastDate);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeAgo = "";
    if (diffDays > 0) {
        const unit = diffDays > 1 ? t["conn-days"] : t["conn-day"];
        timeAgo = `(${diffDays} ${unit})`;
    } else if (diffHours > 0) {
        const unit = diffHours > 1 ? t["conn-hours"] : t["conn-hour"];
        timeAgo = `(${diffHours} ${unit})`;
    } else if (diffMinutes > 0) {
        const unit = diffMinutes > 1 ? t["conn-mins"] : t["conn-min"];
        timeAgo = `(${diffMinutes} ${unit})`;
    } else {
        timeAgo = t["conn-just-now"];
    }

    const connectElement = document.querySelector(".Connect");
    if (connectElement) {
        connectElement.textContent = `${t["conn-connected"]} ${timeAgo}`;
    }
}

function findClosestWeatherEntry(targetTimestamp) {
    if (!weatherEntries.length) return null;

    let low = 0;
    let high = weatherEntries.length - 1;
    let closest = weatherEntries[0];
    let minDiff = Math.abs(weatherEntries[0].timestamp - targetTimestamp);

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const midTime = weatherEntries[mid].timestamp;
        const diff = Math.abs(midTime - targetTimestamp);

        if (diff < minDiff) {
            minDiff = diff;
            closest = weatherEntries[mid];
        }

        if (midTime === targetTimestamp) {
            return weatherEntries[mid];
        } else if (midTime < targetTimestamp) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const checkStart = Math.max(0, low - 2);
    const checkEnd = Math.min(weatherEntries.length - 1, high + 2);
    for (let i = checkStart; i <= checkEnd; i++) {
        const diff = Math.abs(weatherEntries[i].timestamp - targetTimestamp);
        if (diff < minDiff) {
            minDiff = diff;
            closest = weatherEntries[i];
        }
    }

    return closest;
}

function closeAllModals() {
    const settingsModal = document.getElementById("settingsModal");
    const pollutionModal = document.getElementById("modalOverlay");
    const uvModal = document.getElementById("uvModal");

    if (settingsModal) settingsModal.style.display = "none";
    if (pollutionModal) pollutionModal.style.display = "none";
    if (uvModal) uvModal.style.display = "none";
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

        function handleDateTimeSelection(val) {
            validateDateTime();

            if (!weatherEntries.length || !val) {
                return;
            }

            let targetTimestamp;
            if (val.length === 10 && val.includes("-")) {
                targetTimestamp = new Date(val + "T12:00").getTime();
            } else {
                targetTimestamp = new Date(val).getTime();
            }

            if (isNaN(targetTimestamp)) {
                return;
            }

            const foundData = findClosestWeatherEntry(targetTimestamp);

            if (foundData) {
                datetimeInput.value = foundData.datetime.slice(0, 16);
                updateWeatherData(foundData);
                if (errorMessage) errorMessage.style.display = "none";
            } else {
                if (errorMessage) {
                    const lang = document.documentElement.lang || "fr";
                    errorMessage.style.display = "block";
                    errorMessage.textContent = translations[lang] && translations[lang]["error-no-data"]
                        ? translations[lang]["error-no-data"]
                        : "Aucune donnée disponible pour cette date et heure.";
                }
            }
        }

        datetimeInput.addEventListener("input", (e) => handleDateTimeSelection(e.target.value));
        datetimeInput.addEventListener("change", (e) => handleDateTimeSelection(e.target.value));
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
            document.querySelectorAll(".uv-tab").forEach(t => t.classList.remove("active"));

            const target = document.getElementById(targetId);
            if (target) {
                target.classList.add("active");
                const activeTab = document.querySelector(`.uv-tab[data-target="${targetId}"]`);
                if (activeTab) activeTab.classList.add("active");
                
                uvModal.classList.remove("uv-bas", "uv-modere", "uv-haut", "uv-tres-haut", "uv-extreme");
                if (targetId === "content-bas") uvModal.classList.add("uv-bas");
                else if (targetId === "content-modere") uvModal.classList.add("uv-modere");
                else if (targetId === "content-haut") uvModal.classList.add("uv-haut");
                else if (targetId === "content-tres-haut") uvModal.classList.add("uv-tres-haut");
                else if (targetId === "content-extreme") uvModal.classList.add("uv-extreme");
            }

            uvModal.style.display = "flex";
        });

        uvModal.addEventListener("click", (event) => {
            if (event.target === uvModal) {
                uvModal.style.display = "none";
            }
        });

        const uvTabs = document.querySelectorAll(".uv-tab");
        uvTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                const targetId = tab.getAttribute("data-target");
                document.querySelectorAll(".uv-tab").forEach(t => t.classList.remove("active"));
                document.querySelectorAll(".uvModal .content").forEach(c => c.classList.remove("active"));

                tab.classList.add("active");
                const target = document.getElementById(targetId);
                if (target) {
                    target.classList.add("active");
                    uvModal.classList.remove("uv-bas", "uv-modere", "uv-haut", "uv-tres-haut", "uv-extreme");
                    if (targetId === "content-bas") uvModal.classList.add("uv-bas");
                    else if (targetId === "content-modere") uvModal.classList.add("uv-modere");
                    else if (targetId === "content-haut") uvModal.classList.add("uv-haut");
                    else if (targetId === "content-tres-haut") uvModal.classList.add("uv-tres-haut");
                    else if (targetId === "content-extreme") uvModal.classList.add("uv-extreme");
                }
            });
        });
    }

    document.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeAllModals();
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeAllModals();
        }
    });

    const langBtn = document.getElementById('langSwitcher');
    const langDropdown = document.getElementById('langDropdown');
    const currentLangText = document.getElementById('currentLangText');
    const htmlElement = document.documentElement;

    if (langBtn && langDropdown && currentLangText) {

        function switchLang(lang) {
            if (translations[lang]) {
                htmlElement.lang = lang;
                localStorage.setItem('preferredLang', lang);
                currentLangText.textContent = lang === 'en' ? 'English' : 'Français';

                document.querySelectorAll('[data-lang]').forEach(element => {
                    const key = element.getAttribute('data-lang');
                    if (translations[lang][key]) {
                        element.textContent = translations[lang][key];
                    }
                });

                langDropdown.classList.add('hidden');
                langBtn.setAttribute('aria-expanded', 'false');
                
                if (typeof lastWeatherData !== 'undefined' && lastWeatherData) {
                    updateWeatherData(lastWeatherData);
                }
                if (weatherEntries.length) {
                    updateConnectionStatus(weatherEntries);
                }
            }
        }

        langBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isHidden = langDropdown.classList.toggle('hidden');
            langBtn.setAttribute('aria-expanded', !isHidden);
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
                langBtn.setAttribute('aria-expanded', 'false');
            }
        });

        const savedLang = localStorage.getItem('preferredLang');
        const browserLang = navigator.language.startsWith('en') ? 'en' : 'fr';
        const initialLang = savedLang || browserLang;
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

            const parsedEntries = data.valeurs.map((entry) => ({
                ...entry,
                timestamp: new Date(entry.datetime).getTime()
            })).filter(entry => !isNaN(entry.timestamp));

            if (parsedEntries.length > 0) {
                parsedEntries.sort((a, b) => a.timestamp - b.timestamp);
                weatherEntries = parsedEntries;
                const latestEntry = weatherEntries[weatherEntries.length - 1];
                updateWeatherData(latestEntry);
                updateConnectionStatus(weatherEntries);
            }
        })
        .catch((error) => console.error("Erreur:", error));
});
