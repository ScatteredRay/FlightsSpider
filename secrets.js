const AWS = require('aws-sdk');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function setSecrets(sheetId, sheetKey) {
    let secretsManager = new AWS.SecretsManager();

    let secret = await secretsManager.createSecret({
        'Description': 'Spreadsheet login information for flights.',
        'Name': 'FlightsSpreadsheetSecret',
        'SecretString': JSON.stringify({
            'SpreadsheetID' : sheetId,
            'SpreadsheetKey' : sheetKey
        })
    }).promise();
}

rl.question('Enter the Spreadsheet ID: ', (id) => {
    rl.question('Enter the Spreadsheet API key filename: ', (keyFile) => {
        fs.readFile(keyFile, (err, data) => {
            let key = JSON.parse(data);
            setSecrets(id, key);
        });
        rl.close();
    })
});
