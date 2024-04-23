const currencyCard = document.querySelector('.currency-card');
const firstCurrency = document.querySelector("#currency-first");
const secondCurrency = document.querySelector("#currency-second");
const firstAmount = document.querySelector(".currency-card__amount-first");
const secondAmount = document.querySelector(".currency-card__amount-second");
const swapBtn = document.querySelector(".currency-card__btn");
const chartBtn = document.querySelector('.currency-card__chart-btn');
const exitChartBtn = document.querySelector('.rates__xmark');
const result = document.querySelector(".currency-card__result");
const rates = document.querySelector('.rates');
const ratesBtns = document.querySelectorAll('.rates__btn')
const ratesAllBtns = document.querySelectorAll('.rates__class-btn');
const ratesColorBtns = document.querySelectorAll('.rates__btns')
const dateBtn = document.querySelector('.rates__period-btn');
const saveDateBtn = document.querySelector('.rates__date-btn--save');
const cancelDateBtn = document.querySelector('.rates__date-btn--cancel');
const datePannel = document.querySelector('.rates__date');
const startDateInput = document.querySelector('#start-date');
const endDateInput = document.querySelector('#end-date');
const errorDateMsg = document.querySelector('.rates__date-error');
let activeBtn;

const convertCurrency = () => {
	//const URL = `https://api.exchangerate.host/convert?from=${firstCurrency.value}&to=${secondCurrency.value}`;
	const URL = `https://api.frankfurter.app/latest?from=${firstCurrency.value}&to=${secondCurrency.value}`;
	
	fetch(URL)
		.then((res) => res.json())
		.then((data) => {
			result.classList.remove('currency-card__result-correct', result.classList.contains('currency-card__result-correct'));
			if(firstCurrency.value === secondCurrency.value){
				result.textContent = "Waluty nie mogą być identyczne";
			}else{
				if (firstAmount.value >= 0) {
					const convertResult = (firstAmount.value * data.rates[`${secondCurrency.value}`]).toFixed(2); //Wynik przeliczenia waluty
					
					result.classList.toggle('currency-card__result-correct', !result.classList.contains('currency-card__result-correct')); //Dodanie koloru czarnego - jeśli nie został nadany.
					result.textContent = `${firstAmount.value} ${firstCurrency.value} = ${convertResult} ${secondCurrency.value}`;
					secondAmount.value = convertResult;
				} else {
					result.textContent = "Podaj wartość dodatnią";
				}
			}
		})
		.catch(() => {
			result.textContent = 'Błąd serwera. Spróbuj ponownie.';
		});
};

const swapCurrencies = () => {
	//Do zmiennej należy przypisać wartośc pierwszej waluty aby przypisać ją do drugiej waluty ponieważ w 1 walucie już znajduje się wartość drugiej waluty.
	const firstCurrencyValue = firstCurrency.value;

	firstCurrency.value = secondCurrency.value;
	secondCurrency.value = firstCurrencyValue;

	convertCurrency();
};


const currencyTimeSeries = (numberOfDays = 7, period = 'tydzień') => {
	const date = new Date();

	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2 ,'0'); //Pad start zwraca 0 do momentu az liczba nie będzie miała 2 znaków (1 argument)
	const day = date.getDate().toString().padStart(2, '0');
	const currentDate = `${year}-${month}-${day}`;

	let startDate;
	let endDate;

	//Instrukcja, która sprawdza czy w panelu do zarzadzania datą są wartości. 
	//Jesli nie to ustalamy datę z przycisków (z zakresu tydzien, miesiąc, rok itp.)
	//Jeśli tak to ustalamy datę taką jaka jest w inputach (wartośc początkowa i końcowa)
	if(startDateInput.value && endDateInput.value){
		startDate = startDateInput.value;
		endDate = endDateInput.value;
		period = dateBtn.textContent;
	}else{
		startDate = getPreviousDate(numberOfDays);
		endDate = currentDate;
	}

	//const URL =`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}}&base=${firstCurrency.value}`;
	const URL = `https://api.frankfurter.app/${startDate}..${endDate}?from=${firstCurrency.value}`;
	fetch(URL)
		.then((res) => res.json())
		.then((data) => {
			const dataRates = data.rates;
			const dates = Object.keys(dataRates).map(key => key ); // Daty - map zwraca wszystkie daty z obiektu
			const rates = Object.keys(dataRates).map(key => dataRates[key][`${secondCurrency.value}`].toFixed(2));  //stawki z wybranego okresu.
		
			dates.shift();
			rates.shift(); //usunięcie pierwszego elementu z tablicy

			chart.updateSeries([{ data: rates }]);
			chart.updateOptions({
				title: {
					text: `Wykaz ${firstCurrency.value} na ${secondCurrency.value}`,
				  },
				subtitle: {
					text: `Okres: ${period.toLowerCase()}`
				},
				xaxis: {
					categories: [...dates],
				  }
			})

		}).catch(() => {
			chart.updateOptions({
				subtitle: {
				  text: 'Serwer nie odpowiada. Spróbuj ponownie',
				  style: {
					color: '#ff0000'
				  },
				},
			  });
		});
};

//Funkcja, która oblicza wcześniejszą datę od aktualnej. Od aktualnej daty odejmuje pewną liczbę -  dayNumber(np 7). Przykładowo - jaka data była 7 dni temu.
const getPreviousDate = (dayNumber) => {
	const date = new Date();
	date.setDate(date.getDate() - dayNumber);
	const year = date.getFullYear();
	const month = (date.getMonth() + 1).toString().padStart(2 ,'0'); //Pad start zwraca 0 do momentu az liczba nie będzie miała 2 znaków (1 argument)
	const day = date.getDate().toString().padStart(2, '0');
	const previousDate = `${year}-${month}-${day}`;
	return previousDate;
}

//Z wykresu pobiera number do określenia okresu i przekazuje go do funkcji historal
const getNumberOfDays = (e) => {
	const numberOfDays = e.target.dataset.number;
	const period = e.target.textContent;
	currencyTimeSeries(numberOfDays, period);
}

const toggleChart = () => {
	//currencyCard.classList.toggle('currency__card-hide', )
	rates.classList.toggle('rates__show');
	currencyCard.classList.toggle('currency-card__hide');

	ratesAllBtns.forEach(btn => {
		btn.classList.toggle('rates__btn-active', btn.classList.contains('rates__btn-active')); //Jeśli jest aktywny to wyłączamy przycisk w momencie odpalenia wykresu
		btn.classList.toggle('rates__btn-active', btn.textContent === 'Tydzień');
	}); //Po włączeniu wykresu usuń kolor dla aktywnego przicksu, który wczesniej był kliknięty przed zamknięciem wykresu i standardowo dodaj aktywny przycisk dla kontentu tydzien
	currencyTimeSeries();
}

const hideChartByKey = () => {
	if(event.key == 'Escape'){
		toggleChart();
	}
}

const toggleDatePannel = () => {
	datePannel.classList.toggle('rates__date-show');
	errorDateMsg.classList.toggle('rates__date-error-show', errorDateMsg.classList.contains('rates__date-error-show')); //Usuń komunikat podczas togglowania panelu
}

//Funkcja, która pokazuje panel do wprowadzania daty oraz pobiera aktywny przycisk - aby w momencie anulowania można było go przywrócić w funkcji hideDataPanel.
const showDatePanel = () => {
	activeBtn = document.querySelector('.rates__btn-active');
	toggleDatePannel();
}

//Funkcja, która umożliwia ustawienie własnej daty (początkowej i końowej).
const setPanelDate = () => {
	if(startDateInput.value && endDateInput.value){
		currencyTimeSeries();
		toggleDatePannel();
		startDateInput.value = '';
		endDateInput.value = '';
	}else{
		errorDateMsg.classList.add('rates__date-error-show');
	}
	
}

//Funkcja, która zamyka panel oraz przywraca poprzedni aktywny przycisk. Po anulowaniu nie chcemy aby przycisk ,,zakres" był aktywny (tylko w przypadku kiedy daty zostana zatwierdzone).
const hideDatePanel = () => {
	//Zabezpieczenie, które nie powoduje wyłączenia aktywnego przycisku - Zakres(dateBtn) w momencie kliknięcia anuluj, gdyż przycisk ,,Zakres'' wywołuje panel z zakresem.
	if(activeBtn !== dateBtn){
		activeBtn.classList.add('rates__btn-active');
		dateBtn.classList.remove('rates__btn-active');
	}
	toggleDatePannel();
}


const setButtonColor = (e) => {
	const activeBtns = document.querySelectorAll('.rates__btn-active');
	const btn = e.target.closest('button');

	activeBtns.forEach(activeBtn => activeBtn.classList.remove('rates__btn-active'));
	btn.classList.add('rates__btn-active');
}

convertCurrency(); //Po odpaleniu aplikacji pokaż wartości


//-------------------------------------------------------Listeners-------------------------------------------------
firstAmount.addEventListener("change", convertCurrency);
firstCurrency.addEventListener("change", convertCurrency);
secondCurrency.addEventListener("change", convertCurrency);
swapBtn.addEventListener("click", swapCurrencies);

chartBtn.addEventListener('click', toggleChart);
exitChartBtn.addEventListener('click', toggleChart);
document.addEventListener('keydown', hideChartByKey);

dateBtn.addEventListener('click', showDatePanel);
cancelDateBtn.addEventListener('click', hideDatePanel);

ratesBtns.forEach(ratesBtn => ratesBtn.addEventListener('click', getNumberOfDays)); //Pobranie z przycisków numeru do funkcji
ratesAllBtns.forEach(ratesBtn => ratesBtn.addEventListener('click', setButtonColor));
saveDateBtn.addEventListener('click', setPanelDate);
