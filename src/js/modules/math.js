// SOURCE https://stackoverflow.com/questions/48719873/how-to-get-median-and-quartiles-percentiles-of-an-array-in-javascript-or-php

// sort array ascending
const asc = arr => arr.sort((a, b) => a - b);

const sum = arr => arr.reduce((a, b) => a + b, 0);

const mean = arr => sum(arr) / arr.length;

// sample standard deviation
const std = (arr) => {
    const mu = mean(arr);
    const diffArr = arr.map(a => (a - mu) ** 2);
    return Math.sqrt(sum(diffArr) / (arr.length - 1));
};

export function quantile(arr, q) {
    const sorted = asc(arr);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    } else {
        return sorted[base];
    }
};

export function deg2rad(deg) {
  return deg * (Math.PI/180)
}

export function roundNum(number, decPlaces=0) {
  const multiplier = Math.pow(10, decPlaces)
  const rounded = Math.round(number * multiplier) / multiplier;
  return rounded
}

export function tweenValue(start, end, current, startValue=0, endValue=1) {
  let range = end - start;
  let value = current - start;
  let tweenedPct = Math.round(value / range * 100) / 100;
  let tweenedValue = startValue + (endValue - startValue) * tweenedPct

  if (tweenedPct < 0) {
    return startValue;
  } else if (tweenedPct > 1) {
    return endValue;
  } else {
    return tweenedValue;
  }
}