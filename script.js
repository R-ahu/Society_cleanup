const pollutionData = {
  Hyderabad: { aqi: 90, requiredVolunteers: 10 },
  Mumbai: { aqi: 110, requiredVolunteers: 15 },
  Delhi: { aqi: 150, requiredVolunteers: 20 },
  Chennai: { aqi: 80, requiredVolunteers: 8 },
  Kolkata: { aqi: 130, requiredVolunteers: 12 },
  Bengaluru: { aqi: 95, requiredVolunteers: 9 },
  Pune: { aqi: 105, requiredVolunteers: 11 },
  Jaipur: { aqi: 120, requiredVolunteers: 14 }
};

async function init() {
  if (document.getElementById('pollutionIndex')) {
    try {
      const aqiResp = await fetch('https://api.waqi.info/feed/india/?token=demo');
      const aqiData = await aqiResp.json();
      document.getElementById('pollutionIndex').innerText = aqiData.data.aqi;
    } catch {
      document.getElementById('pollutionIndex').innerText = '82';
    }
  }

  if (document.getElementById('pollutionMap')) {
    const map = L.map('pollutionMap').setView([22.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OSM' }).addTo(map);

    Object.keys(pollutionData).forEach(city => {
      const { aqi, requiredVolunteers } = pollutionData[city];
      L.marker(getCityCoords(city)).addTo(map)
        .bindPopup(`<strong>${city}</strong><br>AQI: ${aqi}<br>Volunteers Needed: ${requiredVolunteers}`);
    });
  }

  if (document.getElementById('barGraph')) {
    updateLineGraph();
  }
}

function updateLineGraph() {
  const ctx = document.getElementById('barGraph').getContext('2d');
  const cities = Object.keys(pollutionData);
  const requiredVolunteers = cities.map(city => pollutionData[city].requiredVolunteers);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: cities,
      datasets: [
        {
          label: 'Required Volunteers',
          data: requiredVolunteers,
          borderColor: '#27ae60',
          backgroundColor: '#27ae60',
          fill: false,
          tension: 0.4
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Number of Volunteers' }
        },
        x: {
          title: { display: true, text: 'Cities' }
        }
      }
    }
  });
}

function getCityCoords(city) {
  const locations = {
    Hyderabad: [17.385, 78.4867],
    Mumbai: [19.076, 72.8777],
    Delhi: [28.6139, 77.209],
    Chennai: [13.0827, 80.2707],
    Kolkata: [22.5726, 88.3639],
    Bengaluru: [12.9716, 77.5946],
    Pune: [18.5204, 73.8567],
    Jaipur: [26.9124, 75.7873]
  };
  return locations[city];
}

document.addEventListener('DOMContentLoaded', init);