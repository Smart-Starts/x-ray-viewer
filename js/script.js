const url = '192.168.0.1/data';

// Get
const getData = (onSuccess) => {
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

const inputs = document.querySelectorAll('input');

const viewData = (data) => {
  data.data.map((value,index) => {
    inputs[index].value = value;
  })
}

getData(viewData);
