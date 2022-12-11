"use strict";

const HTTP = require("http");
const URL = require("url").URL;
const PORT = 3000;
const APR = 5;

const HTML_START = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Loan Calculator</title>
    <style type="text/css">
    body {
      background: rgba(250, 250, 250);
      font-family: sans-serif;
      color: rgb(50, 50, 50);
    }

    article {
      width: 100%;
      max-width: 40rem;
      margin: 0 auto;
      padding: 1rem 2rem;
    }

    h1 {
      font-size: 2.5rem;
      text-align: center;
    }

    table {
      font-size: 2rem;
    }

    th {
      text-align: right;
    }
  </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>`;

const HTML_END = `
        </tbody>
      </table>
    </article>
  </body>
</html>`;

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
  return `<tr><th>Amount:</th><td>$${amountInDollars}</td></tr>
  <tr><th>Duration:</th><td>${durationInYears} years</td></tr>
  <tr><th>APR:</th><td>${APR}%</td></tr>
  <tr><th>Monthly payment:</th><td>$${monthlyPayments}</td></tr>`;
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

  let HTML_MIDDLE = getLoanInfo(getParams(path));
  let content = HTML_START + HTML_MIDDLE + HTML_END;

  if (path === "/favicon.ico") {
    res.statusCode = 404;
    res.end();
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.write(content);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
