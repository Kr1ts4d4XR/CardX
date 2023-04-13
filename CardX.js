const fs = require('fs');
const { randomInt } = require('crypto');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Enter BIN : ', bin => {
  readline.question('How Many Cards Do You Want? : ', numCards => {
    readline.question('Do you want to customize the year of expiration date? (Y/N)', ans => {
      let customizedYear = false;
      if (ans.toLowerCase() === 'y') {
        readline.question('Enter a specific year (YY format) : ', year => {
          const parsedYear = parseInt(year, 10);
          if (isNaN(parsedYear) || parsedYear < 0 || parsedYear > 99) {
            console.log('Invalid year input, using random year between 1966 and 1970 instead.');
          } else {
            customizedYear = true;
            console.log(`Using Custom Year : ${parsedYear}`);
          }
          generateCards(bin, numCards, customizedYear, parsedYear);
        });
      } else {
        generateCards(bin, numCards, customizedYear);
      }
    });
  });
});

function generateCards(bin, numCards, customizedYear = false, customYear = 66) {
  const cards = [];

  for (let i = 0; i < numCards; i++) {
    const card = {
      cardNumber: generateCardNumber(bin),
      expDate: generateExpDate(customizedYear, customYear),
      cvv: generateCVV()
    };
    cards.push(card);
  }

  const json = JSON.stringify(cards, null, 2); // Use JSON pretty
  fs.writeFileSync('card.json', json);

  console.log(`${numCards} credit cards generated and saved to Card.json`);
  readline.close();
}

function generateCardNumber(bin) {
  const accountNum = `${randomInt(1e8)}`.padStart(8, '0'); // Random account number
  const checkDigit = generateCheckDigit(`${bin}${accountNum}`); // Generate check digit
  return `${bin}${accountNum}${checkDigit}`;
}

function generateCheckDigit(cardNumber) {
  const digits = cardNumber.split('').map(Number);
  const sum = digits.reduceRight((acc, digit, i) => {
    const doubled = digit * (i % 2 === 0 ? 2 : 1);
    return acc + (doubled > 8 ? doubled - 8 : doubled);
  }, 0);
  return ((Math.ceil(sum / 10) * 10) - sum).toString();
}

function generateExpDate(customizedYear, customYear) {
  let year;
  if (customizedYear) {
    year = customYear;
  } else {
    year = randomInt(66, 70); // Random year between 1966 and 1970 (inclusive)
  }
  const month = randomInt(1, 12); // Random month between 1 and 12 (inclusive)
  return `${month.toString().padStart(2, '0')}/${year.toString().padStart(2, '0')}`;
}

function generateCVV() {
  return `${randomInt(100, 999)}`; // Random 3-digit number
}
