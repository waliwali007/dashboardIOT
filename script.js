// Configuration Firebase - À remplacer par tes vraies infos
const firebaseConfig = {
    apiKey: "AIzaSyCboVzkc0qiaKCoTbbY8SZhfeozdUxmqxk",
    authDomain: "projetiot-d4d14.firebaseapp.com",
    projectId: "projetiot-d4d14",
    storageBucket: "projetiot-d4d14.firebasestorage.app",
    messagingSenderId: "561560484720",
    appId: "1:561560484720:web:34d2a71a851692d8f7edb5"
  };
  
  // Initialiser Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  
  let tempChart, humChart, gasChart;

  function updateCharts(labels, tempData, humData, gasData) {
    if (tempChart) tempChart.destroy();
    if (humChart) humChart.destroy();
    if (gasChart) gasChart.destroy();
  
    // Température (line chart)
    tempChart = new Chart(document.getElementById('temperatureChart'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Température (°C)',
          data: tempData,
          borderColor: 'red',
          fill: false,
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold'
            },
            anchor: 'end',
            align: 'top'
          }
        }
      }
    });
  
    // Humidité (pie chart) - On prend uniquement la dernière valeur
    const latestHumidity = humData[humData.length - 1];
    humChart = new Chart(document.getElementById('humidityChart'), {
      type: 'pie',
      data: {
        labels: ['Humidité', 'Air restant'],
        datasets: [{
          label: 'Humidité (%)',
          data: [latestHumidity, 100 - latestHumidity],
          backgroundColor: ['blue', '#ccc']
        }]
      },
      options: {
        plugins: {
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold'
            }
          }
        }
      }
    });
  
    // Niveau de Gaz (bar chart)
    const gasColors = gasData.map(val => val > 300 ? 'red' : 'green');
    gasChart = new Chart(document.getElementById('gasChart'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Niveau de Gaz',
          data: gasData,
          backgroundColor: gasColors
        }]
      },
      options: {
        plugins: {
          datalabels: {
            color: '#000',
            font: {
              weight: 'bold'
            },
            align: 'top'
          }
        }
      }
    });
  
    // Affichage des valeurs actuelles
    document.getElementById('tempValue').textContent = tempData[tempData.length - 1];
    document.getElementById('humValue').textContent = humData[humData.length - 1];
    document.getElementById('gasValue').textContent = gasData[gasData.length - 1];
  }
  
  // Lire les données Firebase
  db.ref("sensors").on("value", (snapshot) => {
    const data = snapshot.val();
    const labels = [];
    const tempData = [];
    const humData = [];
    const gasData = [];
  
    for (let timestamp in data) {
      labels.push(new Date(Number(timestamp)).toLocaleTimeString());
      tempData.push(data[timestamp].temperature);
      humData.push(data[timestamp].humidity);
      gasData.push(data[timestamp].gas);
    }
  
    updateCharts(labels, tempData, humData, gasData);
  });

 // Commandes robot
 const robotIP = "http://192.168.10.245";

 function sendCommand(cmd) {
   fetch(`${robotIP}/move?direction=${cmd}`)
     .then(res => console.log("Commande envoyée:", cmd))
     .catch(err => console.error("Erreur:", err));
 }

 document.getElementById('buttonA').addEventListener('click', () => sendCommand('a'));
 document.getElementById('buttonB').addEventListener('click', () => sendCommand('b'));
 document.getElementById('buttonC').addEventListener('click', () => sendCommand('c'));
 document.getElementById('backButton').addEventListener('click', () => sendCommand('init'));
  