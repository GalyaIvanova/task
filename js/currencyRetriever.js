function CurrencyRatesRetriever() {
    this.get = function(){
        return new Promise(function (resolve, reject) {
            fetch("./js/currencies.json")
            .then(res => {
                if (res.status === 200) {
                    const jsonData = res.json();
                    resolve(jsonData);
                }
                else {
                    reject(res);
                }
            }, error => {
                reject(error);
            });
        });
    }
}