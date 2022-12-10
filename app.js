"use strict";

const HTTP = require("http");
const URL = require("url").URL;
const PORT = 3000;
const APR = 5;

function getParams(path) {
  const myURL = new URL(path, `http://localhost:${PORT}`);
  return myURL.searchParams;
}

function getLoanInfo(params) {
  const amountInDollars = params.get("amount");
  const durationInYears = params.get("duration");
  const monthlyPayments = calculateMonthlyPayments(
    amountInDollars,
    APR,
    durationInYears
  );
  let body = `Amount: $${amountInDollars}\nDuration: ${durationInYears} years\nAPR: ${APR}%\nMonthly Payment: $${monthlyPayments}`;
  return body;
}

function calculateMonthlyPayments(amountInDollars, APR, durationInYears) {
  const monthlyInterest = APR / 100 / 12;
  const durationInMonths = durationInYears * 12;
  return (
    amountInDollars *
    (monthlyInterest / (1 - Math.pow(1 + monthlyInterest, -durationInMonths)))
  ).toFixed(2);
}

const SERVER = HTTP.createServer((req, res) => {
  let path = req.url;

  let loanInfo = getLoanInfo(getParams(path));

  if (path === "/favicon.ico") {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.write(loanInfo);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
