const DATA_URL = '/data';
const IP_URL = '/ip';
const TIME_TO_REQUEST = 100;
let defaultUrl = '192.168.1.220:8080';
let socket = null;
const buttonReset = document.querySelector('#button-reset');
const buttonGraph = document.querySelector('#button-graph');
const buttonSave = document.querySelector('#button-save');
const buttonGetData = document.querySelector('#button-get-data');
const bar = document.querySelector('#bar');

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
// настройки chart
var config = {
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
      }
    },
  },
};

var myChart = new Chart(ctx, config);

//Web Socket Socket
const openSocket = (onSuccess, url) => {
  try {
    socket = new WebSocket(`ws://${defaultUrl}`);
    socket.binaryType = 'arraybuffer';
    socket.onopen = function (event) {
      console.log('open');
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


const saveDataToArray = (data) => {
  let view = new Uint16Array(data);

  switch (view[0]) {
    case 1:
      for (let i = 0; i < view.length; i = i + 4) {
        saveData[1].push(Number(view[i + 1]));
        saveData[2].push(Number(view[i + 2]));
        saveData[3].push(Number(view[i + 3]));
        saveData[4].push(Number(view[i + 4]));
      }
      break;
    case 2:
      for (let i = 0; i < view.length; i = i + 4) {
        saveData[5].push(Number(view[i + 1]));
        saveData[6].push(Number(view[i + 2]));
      }
      break;
    case 3:
      for (let i = 0; i < view.length; i = i + 4) {
        saveData[7].push(Number(view[i + 1]));
        saveData[8].push(Number(view[i + 2]));
        saveData[9].push(Number(view[i + 3]));
        saveData[10].push(Number(view[i + 4]));
      }
      break;
    default:
      break;
  }

}

const viewProgressBar = (max,step) => {

}

const viewData = () => {

  let decim = 0;
  for (let i = 0; i < saveData[1].length; i++) {
    decim++;
    if (decim > 1000) {
      detectorsData[1].push(saveData[1][i + 1]);
      detectorsData[2].push(saveData[2][i + 1]);
      detectorsData[3].push(saveData[3][i + 1]);
      detectorsData[4].push(saveData[4][i + 1]);
      detectorsData[5].push(saveData[5][i + 1]);
      detectorsData[6].push(saveData[6][i + 1]);
      detectorsData[7].push(saveData[7][i + 1]);
      detectorsData[8].push(saveData[8][i + 1]);
      detectorsData[9].push(saveData[9][i + 1]);
      detectorsData[10].push(saveData[10][i + 1]);

      labels.push(i);
      decim = 0;
    }
  }
  myChart.update();
}

const resetData = () => {
  for (let i = 1; i <= 10; i++) {
    detectorsData[i].splice(0, detectorsData[i].length);
  }

  myChart.update();
}
const fsSaveData = () => {
  let dataString = "Детектор 1  Детектор 2  Детектор 3  Детектор 4 Детектор 5 Детектор 6 Детектор 7 Детектор 8 Детектор 9 Детектор 10\n";
  let detStr="\n";
  for (let i =0 ; i<saveData[1].length-1;i++)
  {
    detStr = detStr + saveData[1][i] +"\t"+ saveData[2][i] +"\t"+ saveData[3][i]+"\t" + saveData[4][i] +"\n" ;
  }
  dataString = dataString + detStr;
  //  dataString = JSON.stringify(saveData);
  //var obj = JSON.parse(dataString);
 // let OutStr;S
 // OutStr = obj.1;
  console.log("gfh");
//  console.log(obj);
  let blob = new Blob([dataString], {
    type: "text/plain;charset=utf-8"
  });
  buttonSave.setAttribute("href", URL.createObjectURL(blob));
  buttonSave.setAttribute("download", "rentgendata.txt")
}


let start = false;
buttonGetData.addEventListener('click', () => {
  if (!start) {
    buttonGetData.classList.add('get-button--start');
    var paramsString = window.location;
    console.log(paramsString);
    openSocket(saveDataToArray, defaultUrl); // start
    start = true;
  } else {
    buttonGetData.classList.remove('get-button--start');
    closeSocket();
    start = false;
  }
});

buttonReset.addEventListener('click', () => {
  resetData();
});

buttonGraph.addEventListener('click', () => {
  viewData();
});

buttonSave.addEventListener('click', () => {
  fsSaveData();
});



const form = document.querySelector('.settings__form');
const ipForm = document.querySelector('#ip');
ipForm.placeholder = `Дефолтный айпи: ${defaultUrl}`;

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
    fetch(url, {
        newIp,
      })
      .then((response) => response.json())
      .then((newIp) => {
        // При успешной отправке в инпут вывести сообщение
        ipForm.value = `Успешно! Новый айпи: ${newIp}`;
        defaultUrl = newIp;
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error)
  }
}

// Событие отправки формы
form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  getIp(defaultUrl, ipForm.value);
});
