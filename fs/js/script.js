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
const getData = (onSuccess, url) => {
  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        onSuccess(data);
      })
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error)
  }
};

const inputs = document.querySelectorAll('.detector-input');

const viewData = (data) => {
  data.data.map((value, index) => {
    inputs[index].value = value;
    detectorsData[index+1].push(Number(value));
    counter = counter + 1;
    labels.push = counter + 1;
    myChart.update();
  })
}

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
    resetData();
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
    buttonGetData.classList.add('viewer__get-button--start');
    startTimer(); // start
    start = true;
  } else {
    buttonGetData.classList.remove('viewer__get-button--start');
    stopTimer(); // stop
    start = false;
  }
});

//graphics
const ctx = document.getElementById('myChart');
const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};



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
        text: 'Надеюсь заработает!'
      }
    }
  },
};


var myChart = new Chart(ctx, config);
