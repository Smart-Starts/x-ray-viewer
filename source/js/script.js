// include chart.js
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// include zoom
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

const DATA_URL = '/data';
const IP_URL = '/ip';
const TIME_TO_REQUEST = 100;
//let defaultUrl = `192.168.66.220:8080`;
let defaultUrl = `${window.location.hostname}:8080`;

let socket = null;
const buttonReset = document.querySelector('#button-reset');
const buttonGraph = document.querySelector('#button-graph');
const buttonSave = document.querySelector('#button-save');
const buttonGetData = document.querySelector('#button-get-data');
const packets = document.querySelector('.quantity-packets');
const SET_IP_ADDRESS = '/setip';
let packetsCounter = 0;
let detectorsData = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
};

let saveData = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
};
let dataBuffer = {
  1: [],
  2: [],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: [],
  9: [],
  10: [],
};
let labels = [];

//graphics
let ctx = document.getElementById('myChart');

let data = {
  labels: labels,
  datasets: [{
      label: 'Детектор 1',
      data: detectorsData[1],
      borderColor: 'red',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'red',
    },
    {
      label: 'Детектор 2',
      data: detectorsData[2],
      borderColor: 'RoyalBlue',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'RoyalBlue',
    },
    {
      label: 'Детектор 3',
      data: detectorsData[3],
      borderColor: 'green',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'green',
    },
    {
      label: 'Детектор 4',
      data: detectorsData[4],
      borderColor: 'yellow',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'yellow',
    },
    {
      label: 'Детектор 5',
      data: detectorsData[5],
      borderColor: 'orange',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'orange',
    },
    {
      label: 'Детектор 6',
      data: detectorsData[6],
      borderColor: 'DeepPink',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'DeepPink',
    },
    {
      label: 'Детектор 7',
      data: detectorsData[7],
      borderColor: 'DarkKhaki',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'DarkKhaki',
    },
    {
      label: 'Детектор 8',
      data: detectorsData[8],
      borderColor: 'Indigo',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'Indigo',
    },
    {
      label: 'Детектор 9',
      data: detectorsData[9],
      borderColor: 'Aqua',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'Aqua',
    },
    {
      label: 'Детектор 10',
      data: detectorsData[10],
      borderColor: 'MidnightBlue',
      pointBorderColor: 'transparent',
      pointBackgroundColor: 'transparent',
      pointHoverBorderColor: 'blue',
      pointHoverBackgroundColor: 'MidnightBlue',
    },
  ]
};

// настройки zoom
const zoomOptions = {
  limits: {
    //x: {min: 0, minRange: 500},
  },
  pan: {
    enabled: true,
    mode: 'x',
  },
  zoom: {
    wheel: {
      enabled: true,
    },
    pinch: {
      enabled: true,
    },
    mode: 'x',
  },
}

// настройки chart
const config = {
  type: 'line',
  data: data,
  radius: 0,
  fill: false,
  options: {
    interaction: {
      intersect: false
    },
    responsive: true,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: false
      },
      title: {
        display: true,
        text: 'График значений детекторов'
      },
      zoom: zoomOptions,
    },
  },
};

let myChart = new Chart(ctx, config);
//Web Socket Socket
const openSocket = (onSuccess, url) => {
  try {
    socket = new WebSocket(`ws://${defaultUrl}`);
    socket.binaryType = 'arraybuffer';
    socket.onopen = function (event) {
    };
    socket.onmessage = function (event) {
      //console.log(event.data);
      onSuccess(event.data);
    };
  } catch (error) {
    console.log(error)
  }
}

// Web Socket Close
const closeSocket = () => {
  try {
    socket.close();
  } catch (error) {
    console.log(error)
  }
}

const viewPackets = () => {
  packets.textContent = '' + packetsCounter;
}
var cnt2buffer = 0;

const saveDataToArray = (data) => {
  let view = new Uint16Array(data);
  
  for (let i = 0; i < 1024; i = i + 4) {

    saveData[1].push(Number(view[i+1]));
    saveData[2].push(Number(view[i])); 
    saveData[3].push(Number(view[i+3]));
    saveData[4].push(Number(view[i+2]));
    
    packetsCounter++;
  }
  for (let i = 1024; i < 1024+512; i = i + 2) {
    saveData[5].push(Number(view[i+1]));
    saveData[6].push(Number(view[i])); 
  }
  for (let i = 1536; i < 1536+1024; i = i + 4) {
    saveData[7].push(Number(view[i+1]));
    saveData[8].push(Number(view[i])); 
    saveData[9].push(Number(view[i+3]));
    saveData[10].push(Number(view[i+2])); 
  } 
    
  viewPackets();
  //console.log(saveData);
}

const viewData = () => {
  let decim = 0; 
  resetData();
  for (let i = 0; i < saveData[1].length; i++) {
    decim++;
    if (decim > 1000) {
      detectorsData[1].push(saveData[1][i]);
      detectorsData[2].push(saveData[2][i]);
      detectorsData[3].push(saveData[3][i]);
      detectorsData[4].push(saveData[4][i]);
      detectorsData[5].push(saveData[5][i]);
      detectorsData[6].push(saveData[6][i]);
      detectorsData[7].push(saveData[7][i]);
      detectorsData[8].push(saveData[8][i]);
      detectorsData[9].push(saveData[9][i]);
      detectorsData[10].push(saveData[10][i]);
      labels.push(i);
      decim = 0;
    }
  }
 
  myChart.resetZoom();
  myChart.update();
}

const resetData = () => {
  for (let i = 1; i <= 10; i++) {
    detectorsData[i].splice(0, detectorsData[i].length);
  }
  labels.splice(0,labels.length);
  viewPackets();
  myChart.update();
}

const createBeautifullString = () => {
  let dataString = 'Дет. 1  Дет. 2  Дет. 3  Дет. 4  Дет. 5  Дет. 6  Дет. 7  Дет. 8  Дет. 9  Дет. 10\n';
  let detStr = '\n';
  for (let i = 0; i < saveData[1].length - 1; i++) {
    for (let j = 1; j <= 10; j++) {
      if ( Number.isNaN(saveData[j][i]) || saveData[j][i] === undefined) {
        saveData[j][i] = 0;
      }
      detStr = detStr + saveData[j][i] + '\t';
      if (j === 10) {
        detStr = detStr + '\n';
      }
    }
  }
  dataString = dataString + detStr;
  return dataString;
}

const fsSaveData = () => {
  const dataString = createBeautifullString();
  let blob = new Blob([dataString], {
    type: 'text/plain;charset=utf-8'
  });
  buttonSave.setAttribute('href', URL.createObjectURL(blob));
  buttonSave.setAttribute('download', 'rentgendata.txt')
}


let start = false;
buttonGetData.addEventListener('click', () => {
  if (!start) {
    buttonGetData.classList.add('get-button--start');
    var paramsString = window.location;
    openSocket(saveDataToArray, defaultUrl); // start
    start = true;
  } else {
    buttonGetData.classList.remove('get-button--start');
    closeSocket();
    start = false;
  }
});
const resetAll =() =>
{
  for (let i = 1; i <= 10; i++) {
    detectorsData[i].splice(0, detectorsData[i].length);
    saveData[i].splice(0, saveData[i].length);
  }
  packetsCounter = 0;
  labels.splice(0,labels.length);
  viewPackets();
  myChart.update();
}
buttonReset.addEventListener('click', () => {
  resetAll();
});

buttonGraph.addEventListener('click', () => {
  viewData();
});

buttonSave.addEventListener('click', () => {
  fsSaveData();
});


const form = document.querySelector('.settings__form');
const ipForm = document.querySelector('#ip');
ipForm.placeholder = ` `;

// Валидация формы
ipForm.addEventListener('invalid', () => {
  if (ipForm.validity.valueMissing) {
    ipForm.setCustomValidity('Обязательное поле');
  } else {
    ipForm.setCustomValidity('');
  }
});

const getIp = (url, newIp) => {
  try {
    fetch(url + ':' + newIp + ".")
      .then((response) => response.json())
      .then((newAddress) => alert(`Успешно! Новый айпи: ${newAddress["ip"]}, перезагрузите устройство!`))
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error)
  }
}

// Событие отправки формы
form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  getIp(SET_IP_ADDRESS, ipForm.value);
});
