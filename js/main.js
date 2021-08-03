(function() {
    this.initializationTime = new Date();
    this.isRateGoingUp = true;

    const shutDownTime = 300000;
    const minRate = 1.0001;

    const currencyRatesRetriever = new CurrencyRatesRetriever();
    currencyRatesRetriever.get()
        .then(currencyData => {
            this.initializeState(currencyData);
        }, error => {
            // TODO: show some error
        });

    this.initializeState = function(currencyData) {
        this.currencyData = currencyData;
        this.updateRatesTimer = setInterval(this.updateRates, 5000); // 5 sec (5000 ms).
        this.ratesDirectionTimer = setInterval(this.changeRatesDirection, 60000); // 60 sec (60000 ms).
        CreateTable(this.currencyData.rates);
    }

    this.updateRates = function() {
        const executionTime = new Date();
        if (executionTime - this.initializationTime >= shutDownTime) {
            this.clearTimers();
            return;
        }

        const keys = Object.keys(this.currencyData.rates);
        keys.forEach(rateKey => {
            const rateValue = this.currencyData.rates[rateKey];
            let newRateValue = rateValue;
            let spanRateValue = document.getElementById(rateKey);
            if (this.isRateGoingUp) {

                if (newRateValue > minRate) {
                    newRateValue += 0.0001;
                    spanRateValue.innerHTML = newRateValue.toFixed(4);

                } else {
                    newRateValue += 0.0001;
                    spanRateValue.innerHTML = minRate;
                }

            } else {
                if (newRateValue > minRate) {
                    newRateValue -= 0.0001;
                    spanRateValue.innerHTML = newRateValue.toFixed(4);
                } else {
                    newRateValue -= 0.0001;
                    spanRateValue.innerHTML = minRate;
                }
            }


            if (rateValue < newRateValue) {
                spanRateValue.setAttribute("class", "up");

            } else if (rateValue > newRateValue) {
                spanRateValue.setAttribute("class", "down");

            }
            this.currencyData.rates[rateKey] = newRateValue;

        });
    }

    this.changeRatesDirection = function() {
        this.isRateGoingUp = !this.isRateGoingUp;
    }

    this.clearTimers = function() {
        clearInterval(this.updateRatesTimer);
        clearInterval(this.ratesDirectionTimer);
    }

    function CreateTable(currencies) {
        let grid = document.querySelector('.parent');

        const keys = Object.keys(currencies);
        keys.forEach(rateKey => {

            let div = document.createElement('div');
            let span = document.createElement('span');
            div.textContent = "EUR" + rateKey;
            span.textContent = currencies[rateKey].toFixed(4);
            span.setAttribute("id", rateKey);

            grid.append(div);
            grid.append(span);
        });
    }
  
    window.addEventListener('unload', function(event) {
        this.clearTimers();
    });
})();