"use strict";

const HTTP = require("http");
const URL = require("url").URL;
const PORT = 3000;
const APR = 5;

const TEMPLATE = `
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
        font-size: 1.5rem;
      }
      th {
        text-align: right;
      }
      td {
        text-align: center;
      }
      th,
      td {
        padding: 0.5rem;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>
          <tr>
            <th>Amount:</th>
            <td>
              <a href='/?amount=${amount - 100}&duration=${duration}'>- $100</a>
            </td>
            <td>$${amount}</td>
            <td>
              <a href='/?amount=${amount + 100}&duration=${duration}'>+ $100</a>
            </td>
          </tr>
          <tr>
            <th>Duration:</th>
            <td>
              <a href='/?amount=${amount}&duration=${duration - 1}'>- 1 year</a>
            </td>
            <td>${duration} years</td>
            <td>
              <a href='/?amount=${amount}&duration=${duration + 1}'>+ 1 year</a>
            </td>
          </tr>
          <tr>
            <th>APR:</th>
            <td colspan='3'>${APR}%</td>
          </tr>
          <tr>
            <th>Monthly payment:</th>
            <td colspan='3'>$${payment}</td>
          </tr>
        </tbody>
      </table>
    </article>
  </body>
</html>
`;

function getParams(path) {
  const myURL = new URL(path, `http://localhost:${PORT}`);
  return myURL.searchParams;
}

function getLoanInfo(params) {
  const amount = Number(params.get("amount"));
  const duration = Number(params.get("duration"));
  const payment = calculateMonthlyPayments(
    amountInDollars,
    APR,
    durationInYears
  );
  return TEMPLATE;
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
