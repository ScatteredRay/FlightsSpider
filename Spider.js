const puppeteer = require('puppeteer');
const dateFormat = require('dateformat');
const fs = require('fs');

function ExtractFlights() {

    function extractInnerText(elems) {
        if(elems.length === 0) return null;
        let elem = elems[0];
        return elem.innerText.trim();
    }

    let Booking = Date();
    let Departure = extractInnerText(document.getElementsByClassName("gws-flights-form__departure-input"))
    let Return = extractInnerText(document.getElementsByClassName("gws-flights-form__return-input"))

    fr = document.getElementsByClassName("gws-flights-results__result-item")
    let flights = [];
    for(let f of fr) {
        let flInfo = {};

        flInfo["bookingDate"] = Booking;
        flInfo["departureDate"] = Departure;
        flInfo["returnDate"] = Return;
        flInfo["price"] = extractInnerText(f.getElementsByClassName("gws-flights-results__price"));
        flInfo["carrier"] = extractInnerText(f.getElementsByClassName("gws-flights-results__carriers"));
        flInfo["duration"] = extractInnerText(f.getElementsByClassName("gws-flights-results__duration"));
        flInfo["flightTime"] = extractInnerText(f.getElementsByClassName("gws-flights-results__times"));
        flInfo["airports"] = extractInnerText(f.getElementsByClassName("gws-flights-results__airports"));
        flInfo["stops"] = extractInnerText(f.getElementsByClassName("gws-flights-results__stops"));
        flights.push(flInfo);
    }
    return flights;
}

function FlightURL(sourceAirport, destAirport, departureDate, returnDate) {

    let depStr = dateFormat(departureDate, "yyyy-mm-dd");
    let retStr = dateFormat(returnDate, "yyyy-mm-dd");

    let url = "https://www.google.com/flights#flt=a" + sourceAirport + ".a" + destAirport + 
        "." + depStr + "*" + destAirport + ".a" + sourceAirport + "." + retStr + ";c:USD;e:1;sd:1;t:f";

    return url;
}


async function spiderFlights(SourceAirportCode, DestAirportCodes, cb) {
    const browser = await puppeteer.launch({
        headless: false,
        args: []
    });

    const now = new Date();

    const dep = new Date(now);
    dep.setMonth(dep.getMonth() + 1);
    dep.setDate(dep.getDate() + 5);

    const ret = new Date(dep);
    ret.setDate(ret.getDate() + 7);

    let DestAirports = DestAirportCodes;

    for(dest of DestAirports) {
        const page = await browser.newPage();

        const url = FlightURL(SourceAirportCode, dest, dep, ret);

        await page.goto(url, {'waitUntil': 'networkidle0'});

        let flights = await page.evaluate(ExtractFlights);

        await cb(SourceAirportCode, dest, flights);

        await page.waitFor(10 * 1000);
        await page.close();
    }
    await browser.close();
}

exports.spiderFlights = spiderFlights;
