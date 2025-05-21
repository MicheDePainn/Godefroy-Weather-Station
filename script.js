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

fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
        // updateWeatherData(data.valeurs[0]);

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

document.addEventListener('DOMContentLoaded', () => {

    const langBtn = document.getElementById('langSwitcher');
    const langDropdown = document.getElementById('langDropdown');
    const currentFlag = document.getElementById('currentFlag');
    const htmlElement = document.documentElement;

    if (!langBtn || !langDropdown || !currentFlag) {
        console.error("Erreur: Un ou plusieurs éléments du sélecteur de langue sont introuvables.");
        return;
    }

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
                } else {
                    console.warn(`Clé de traduction manquante pour "${key}" en langue "${lang}"`);
                }
            });

            langDropdown.classList.add('hidden');

        } else {
            console.error(`Langue non supportée : ${lang}`);
        }
    }

    langBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        langDropdown.classList.toggle('hidden');
    });

    langDropdown.addEventListener('click', (event) => {
        event.preventDefault();

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

    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mainNavLinks = document.getElementById('mainNavLinks');

    if (mobileMenuButton && mainNavLinks) {
        mobileMenuButton.addEventListener('click', () => {
            mainNavLinks.classList.toggle('mobile-menu-open');
            const isExpanded = mainNavLinks.classList.contains('mobile-menu-open');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            if (isExpanded) {
                mobileMenuButton.setAttribute('aria-label', 'Fermer le menu');
            } else {
                mobileMenuButton.setAttribute('aria-label', 'Ouvrir le menu');
            }
        });

        mainNavLinks.addEventListener('click', (event) => {
            if (event.target.matches('.nav-link')) {
                if (mainNavLinks.classList.contains('mobile-menu-open')) {
                    mainNavLinks.classList.remove('mobile-menu-open');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    mobileMenuButton.setAttribute('aria-label', 'Ouvrir le menu');
                }
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

    } else {
        console.error("Erreur: Le bouton du menu mobile ou les liens de navigation principaux sont introuvables dans le DOM.");
    }

    const projectOverlays = document.querySelectorAll('.project-overlay');

    projectOverlays.forEach(overlay => {
        overlay.addEventListener('click', function(event) {
            const projectLink = this.querySelector('.project-link');
            if (projectLink && projectLink.href) {
                window.location.href = projectLink.href;
            }
        });
    });
});