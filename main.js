const spider = require('./spider');
const fs = require('fs');

const {google} = require('googleapis');

(async () => {
    spider.spiderFlights(
        "SFO",
        ["LAX", "SEA", "BZE", "FCO", "CHC", "AKL", "ZQN", "JFK", "LHR", "LGW", "BCN"],
        async (src, dest, flights) => {
            console.log(`Flights from ${src} to ${dest}`);
            let flightTxt = ""
            for(g of flights) {
                flightTxt += JSON.stringify(g) + ",\n";
            }

            await fs.appendFileSync('flights.json', flightTxt, 'utf8');
        });
})();
