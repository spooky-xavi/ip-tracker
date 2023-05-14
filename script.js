const api_key = "at_tzqdfeVZ1drjbGaDmM5XTF6wNMvpI";
let map;
const timezoneNames = {
    "-12": "AoE",
    "-11": "NUT, SST",
    "-10": "HST",
    "-9": "AKST",
    "-8": "PST",
    "-7": "MST",
    "-6": "CST",
    "-5": "EST",
    "-4": "AST",
    "-3": "ART, GST",
};

// Resolve Time Zone Names
const getTimezoneName = (timezone) => {
    return timezoneNames[timezone] || "";
};
// Generate Map
const createMap = (lat, long) => {
    if (map) {
        map.remove();
    }
    map = L.map('map').setView([lat, long], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.marker([lat, long]).addTo(map);
};
// Manage Search event
document.getElementById('ip-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const ip = document.getElementById('ip-address').value;
    const url = document.getElementById('ip-address').value;
    
    $(() => {
        $.ajax({
            url: "https://geo.ipify.org/api/v1",
            data: { apiKey: api_key, ipAddress: ip, domain: url },
            success: onFetchSuccess
        });
    });
});
// Manage API call
const onFetchSuccess = (data) => {
    //$("body").append("<pre>" + JSON.stringify(data, "", 2) + "</pre>");
    const { lat, lng: long, region: state, city, postalCode: zipcode, timezone } = data.location;
    const { isp, ip } = data; 
    
    const timezoneNum = Number(timezone.replace(":", "")) / 100;
    const timezoneName = getTimezoneName(timezoneNum);
    
    updateUI({ ip, state, city, zipcode, timezoneName, timezone, isp, ip });
    createMap(lat, long);
};
// Update UI
const updateUI = ({ ip, city, state, zipcode, timezoneName, timezone, isp }) => {
    document.getElementById('ip').textContent = ip;
    document.getElementById('location').textContent = `${city}, ${state} ${zipcode}`;
    document.getElementById('timezone').textContent = `${timezoneName} ${timezone}`;
    document.getElementById('isp').textContent = isp;
}
// Get User IP
const fetchUserIP = async () => {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error fetching user IP:", error);
    }
};
// Search user IP on page load
(async () => {
    const userIP = await fetchUserIP();
    $.ajax({
        url: "https://geo.ipify.org/api/v1",
        data: { apiKey: api_key, ipAddress: userIP },
        success: onFetchSuccess,
    });
})();


