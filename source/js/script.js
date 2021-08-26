const DATA_URL = '/data';
const IP_URL = '/ip';
const TIME_TO_REQUEST = 100;
let defaultUrl = '192.168.66.220';

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
  })
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
    buttonGetData.classList.add('viewer__get-button--start');
    startTimer(); // start
    start = true;
  } else {
    buttonGetData.classList.remove('viewer__get-button--start');
    stopTimer(); // stop
    start = false;
  }
});
