(() => {
  let numsArr = [];
  let firstCard = null;
  let secondCard = null;
  let timerFunc;
  let time;
  let loseTimeout;

  const button = document.createElement('button');//const, потому что переменная не изменяется.
  const container = document.querySelector('.container');
  const input = document.querySelector('.input');
  const startBtn = document.querySelector('.startBtn');
  const timer = document.createElement('span');
  let cardsCount = null;//let, потому что мы изменяем эту переменную.

  //Создание массива с параметром count, где count это колличество столбцов
  function createNumbersArray(count) {

    let countOfPairs = Math.pow(count, 2) / 2;

    for (let i = 1; i <= countOfPairs; i++) {

      numsArr.push(i);
      numsArr.push(i);

    }

  }

  //Перемешивание массива
  function shuffle(arr) {

    let numsArrLength = arr.length;

    let randEl;

    let currEl;

    // Пока есть элементы для перемешивания
    while (numsArrLength) {

      // Взять оставшийся элемент
      randEl = Math.floor(Math.random() * numsArrLength--);

      // И поменять его местами с текущим элементом
      currEl = arr[numsArrLength];
      arr[numsArrLength] = arr[randEl];
      arr[randEl] = currEl;
    }

    return arr;
  }


  //Создаём карточку
  function createCard(arr, order, count) {
    const card = document.createElement('div');//Обёртка карточки
    const front = document.createElement('div');//Сторона,которую видно изначально
    const back = document.createElement('div');//Обратная сторона

    card.classList.add('card');
    front.classList.add('card__front');
    back.classList.add('card__back');

    //Count нужен,чтобы вычислить колличество столбцов и ширину карточек через css.

    if (count > 4) {
      card.style.setProperty('height', 150 + 'px');
    }
    if (count > 6) {
      card.style.setProperty('height', 100 + 'px');
    }

    card.style.setProperty('--cardsCount', count);

    back.textContent = arr[order];//Заполняем карточку числом

    //Добавляем карточку в разметку
    container.append(card);
    card.append(front);
    card.append(back);


    card.addEventListener('click', () => {
      card.classList.add('active');
      card.classList.add('true');

      if (firstCard === null) {
        firstCard = back;
      } else {
        secondCard = back;
        container.classList.add('true');
      }

      //Проверка на совпадение карточек
      if (firstCard !== null && secondCard !== null) {
        //Timeout нужен,чтобы сработала анимация открытия карточек,
        // без необходимости нажимать на 3 карточку, что мне показалось более логичным.
        setTimeout(() => {
          if (firstCard.textContent !== secondCard.textContent) {
            firstCard.parentNode.classList.toggle('active');
            secondCard.parentNode.classList.toggle('active');
            firstCard.parentNode.classList.remove('true');
            secondCard.parentNode.classList.remove('true');
            firstCard = null;
            secondCard = null;
            container.classList.remove('true');
          } else {
            firstCard = null;
            secondCard = null;
            container.classList.remove('true');
          }
        }, 500);
      }

      //Проверка на конец игры.
      if (numsArr.length === document.querySelectorAll('.active').length) {
        //Очищаем таймер и интервал, если игра закончилась раньше таймера
        clearInterval(timerFunc);
        clearTimeout(loseTimeout);
        //Добавление кнопки при завершении игры
        setTimeout(() => {
          button.textContent = 'Сыграть ещё раз';
          button.classList.add('btn');
          container.append(button);
        }, 1000)
      }
    },);
  }

  document.addEventListener("DOMContentLoaded", () => {

    //Функция создания игры count колличество столбцов
    function startGame(count) {
      time = 60;
      clearInterval(timerFunc);//Очищаем таймер и интервал при старте игры
      clearTimeout(loseTimeout);
      //Создаем задержку в 1 минуту, после которого игра автоматически завершается
      loseTimeout = setTimeout(() => {
        //Создаем оповещение о завершении игры
        let loseAlert = document.createElement('span');
        loseAlert.classList.add('lose');
        loseAlert.textContent = 'Вы не успели открыть все карточки за 1 минуту.';
        //Добавление кнопки при завершении игры
        button.textContent = 'Сыграть ещё раз';
        button.classList.add('btn');

        container.innerHTML = '';

        container.append(loseAlert);
        container.append(button);

      }, 60000);

      //Добавление таймера в разметку
      timer.innerHTML = `Осталось ${time}с`;
      timer.style.width = '100%';
      timer.style.textAlign = 'center';
      timer.style.fontSize = '60px';
      container.append(timer);
      //Функция таймера
      timerFunc = setInterval(() => {
        time--;
        timer.innerHTML = `Осталось ${time}с`;
      }, 1000);



      createNumbersArray(count);//Создаём массив пар в колличестве count
      shuffle(numsArr);//Перемешиваем массив по алгоритму Фишера

      //Создаём поле с карточками
      for (const num in numsArr) {
        createCard(numsArr, num, count);
      }
    }
    //Обработчик кнопки начала игры
    startBtn.addEventListener('click', (e) => {
      e.preventDefault();//Нужен,чтобы страница не перезагружалась при отправке формы
      //Очищаем дерево
      container.innerHTML = '';
      numsArr = [];
      //Проверка на вводимое значение
      if (input.value > 0 && input.value % 2 === 0 && input.value <= 10) {
        cardsCount = input.value;
        startGame(cardsCount);
      } else {
        cardsCount = 4;
        startGame(cardsCount);
      }
      input.value = '';
    });

    button.addEventListener('click', () => {
      //Задержка, для анимации клика по кнопке.
      setTimeout(() => {
        container.innerHTML = '';
        numsArr = [];
        startGame(cardsCount);
      }, 500)
    });
  });


})();

