const DATA_URL = '/data';
const IP_URL = '/ip';
const TIME_TO_REQUEST = 100;
let defaultUrl = '192.168.66.220';
let counter = 0;

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

let labels = [];

//graphics
const ctx = document.getElementById('myChart');

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Детектор 1',
      data: detectorsData[1],
      borderColor: 'red',
    },
    {
      label: 'Детектор 2',
      data: detectorsData[2],
      borderColor: 'RoyalBlue',
    },
    {
      label: 'Детектор 3',
      data: detectorsData[3],
      borderColor: 'green',
    },
    {
      label: 'Детектор 4',
      data: detectorsData[4],
      borderColor: 'yellow',
    },
    {
      label: 'Детектор 5',
      data: detectorsData[5],
      borderColor: 'orange',
    },
    {
      label: 'Детектор 6',
      data: detectorsData[6],
      borderColor: 'DeepPink',
    },
    {
      label: 'Детектор 7',
      data: detectorsData[7],
      borderColor: 'DarkKhaki',
    },
    {
      label: 'Детектор 8',
      data: detectorsData[8],
      borderColor: 'Indigo',
    },
    {
      label: 'Детектор 9',
      data: detectorsData[9],
      borderColor: 'Aqua',
    },
    {
      label: 'Детектор 10',
      data: detectorsData[10],
      borderColor: 'MidnightBlue',
    },
  ]
};

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'График значений детекторов'
      }
    }
  },
};

var myChart = new Chart(ctx, config);

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

// Get
// const getData = (onSuccess, url) => {
//   try {
//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         onSuccess(data);
//       })
//       .catch((error) => console.log(error));
//   } catch (error) {
//     console.log(error)
//   }
// };
let socket = null;

//Web Socket Socket
const openSocket = (onSuccess, url) => {
  try {
    socket = new WebSocket(`ws://${url}/data`);
    socket.addEventListener('message', function (event) {
      onSuccess(event.data.json());
    });
  } catch (error) {
    console.log(error)
  }
}

const closeSocket = () => {
  try {
    socket.send('/close')
    socket.close();
  } catch (error) {
    console.log(error)
  }
}

const inputs = document.querySelectorAll('.detector-input');

const viewData = (data) => {
  data.data.map((value, index) => {
    inputs[index].value = value;
    detectorsData[index+1].push(Number(value));
  })
  counter = counter + 1;
  labels.push(counter);
  myChart.update();
}


// const mokData = [Math.random(2),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random(),Math.random()];

// document.querySelector('#send').addEventListener('click',() => {
//   mokData.map((value, index) => {
//     inputs[index].value = value;
//     detectorsData[index+1].push(Number(value));
//   })
//   counter = counter + 1;
//   labels.push(counter);
//   myChart.update();
// })

const resetData = () => {
  counter = 0; // Сбросить счетчик;
  labels = [];
  detectorsData = {
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
  myChart.update();
}

let timer = null;

const startTimer = () => {
  timer = setTimeout(function tick() {
    getData(viewData, DATA_URL);
    timer = setTimeout(tick, TIME_TO_REQUEST);
  }, TIME_TO_REQUEST);
};


const stopTimer = () => {
  clearTimeout(timer); // Stop
}

const buttonGetData = document.querySelector('#button-get-data');

let start = false;
buttonGetData.addEventListener('click', () => {
  if (!start) {
  //  resetData();
    buttonGetData.classList.add('get-button--start');
    openSocket(viewData,defaultUrl); // start
    start = true;
  } else {
    buttonGetData.classList.remove('get-button--start');
    closeSocket();
    stopTimer(); // stop
    start = false;
  }
});
