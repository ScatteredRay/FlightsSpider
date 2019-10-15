const spider = require('./spider');
const fs = require('fs');

const AWS = require('aws-sdk');
const {google} = require('googleapis');

async function getSecrets() {
    let secretsManager = new AWS.SecretsManager();

    let secret = await secretsManager.getSecretValue({'SecretId': 'FlightsSpreadsheetSecret'}).promise();
    console.dir(JSON.parse(secret.SecretString));
}

getSecrets();

(async () => {
    const auth = {};
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        spreadsheetId: '[SpreadSheetID]',
        range: 'Class Data!A2:E',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;
        if (rows.length) {
            console.log('Name, Major:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                console.log(`${row[0]}, ${row[4]}`);
            });
        } else {
            console.log('No data found.');
        }
    });
});//();



(async () => {
    console.log("D");
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
});//();
