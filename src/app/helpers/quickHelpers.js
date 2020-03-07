const filterOutliers = (someArray) => {
    if(someArray.length < 4)
        return someArray;
    let values, q1, q3, iqr, maxValue, minValue;
    values = someArray.slice().sort( (a, b) => a - b);//copy array fast and sort
    if((values.length / 4) % 1 === 0){//find quartiles
        q1 = 1/2 * (values[(values.length / 4)] + values[(values.length / 4) + 1]);
        q3 = 1/2 * (values[(values.length * (3 / 4))] + values[(values.length * (3 / 4)) + 1]);
    } else {
        q1 = values[Math.floor(values.length / 4 + 1)];
        q3 = values[Math.ceil(values.length * (3 / 4) + 1)];
    }
    iqr = q3 - q1;
    maxValue = q3 + iqr * 1.5;
    minValue = q1 - iqr * 1.5;
    return values.filter((x) => (x >= minValue) && (x <= maxValue));
};

const getAverage = (someArray) => {
    let total = 0;
    someArray.forEach((float) => {
        total += parseFloat(float);
    });
    let average = total / someArray.length;
    return average;
};

const roundMoney = (float) => {
    return Math.ceil(float * 100) / 100;
};

const moneyRoundOfArray = (someArray) => {
    let total = 0;
    someArray.forEach(number => {
        total += parseFloat(number);
    });
    return roundMoney(total);
};

const firstNumber = (string) => {
    if(string.match(/\d+/)){
        if (string.match(/\d+/)[0] > 4) {
            return 1;
        } else {
            return string.match(/\d+/)[0];
        }
    } else {
        return 1;
    }
};

const priceByQTY = (number, price) => {
    return "$" + roundMoney(price / number);
};

const translate = (string, strings, lang) => { 
    if (strings[string] && strings[string][lang]) return strings[string][lang];
    return null;
};

module.exports = {
    filterOutliers,
    getAverage,
    roundMoney,
    firstNumber,
    priceByQTY,
    moneyRoundOfArray,
    translate
};
