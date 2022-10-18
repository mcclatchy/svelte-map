import {rgb} from "https://cdn.skypack.dev/d3-color@3";

// SOURCE: https://www.esri.com/arcgis-blog/products/arcgis-online/mapping/new-map-viewer-color-ramps-for-2021/
const palettesSubdued = {
  'light': {
    "bluePurple": ["#d3e5f3", "#aed1ea", "#b0bee1", "#b299d3", "#9a72b0"],
    "orangeRed": ["#eecb9b", "#e7b48f", "#e09c85", "#da867b", "#c16677"] 
  },
  'dark':  {
    "pinkPurple": ["#eeb0b1", "#cc7b7a", "#b66c79", "#a06078", "#8a5277"]
  }
}

// SOURCE: https://github.com/narroviz/article-wnba-season-history/blob/master/src/js/graphic.js
export function makeColors(primaryColor, numDarker=4, numLighter=4, pctDarker=0.64, pctLighter=0.64) {
  const rgbPrimaryColor = rgb(primaryColor)
  const primaryRed = rgbPrimaryColor.r
  const primaryGreen = rgbPrimaryColor.g
  const primaryBlue = rgbPrimaryColor.b

  const darkScale = [rgbPrimaryColor]
  const darkerColors = [primaryColor]
  const darkRedStep = primaryRed * pctDarker / numDarker
  const darkGreenStep = primaryGreen * pctDarker / numDarker
  const darkBlueStep = primaryBlue * pctDarker / numDarker
  for (var i = 0; i < numDarker; i++) {
    const darkerColor = rgb(
      darkScale[i].r - darkRedStep,
      darkScale[i].g - darkGreenStep,
      darkScale[i].b - darkBlueStep,
    )
    const darkerHexColor = rgbToHex(
      darkScale[i].r - darkRedStep,
      darkScale[i].g - darkGreenStep,
      darkScale[i].b - darkBlueStep,
    )
    darkScale.push(darkerColor)
    darkerColors.push(darkerHexColor)
  }

  const lightScale = [rgbPrimaryColor]
  const lighterColors = [primaryColor]
  const lightRedStep = (255 - primaryRed) * pctLighter / numLighter
  const lightGreenStep = (255 - primaryGreen) * pctLighter / numLighter
  const lightBlueStep = (255 - primaryBlue) * pctLighter / numLighter
  for (var i = 0; i < numLighter; i++) {
    const lighterColor = rgb(
      lightScale[i].r + lightRedStep,
      lightScale[i].g + lightGreenStep,
      lightScale[i].b + lightBlueStep,
    )
    const lighterHexColor = rgbToHex(
      lightScale[i].r + lightRedStep,
      lightScale[i].g + lightGreenStep,
      lightScale[i].b + lightBlueStep,
    )
    lightScale.push(lighterColor)
    lighterColors.push(lighterHexColor)
  }

  // Remove 1st element to avoid double inclusion
  darkScale.shift()
  darkerColors.shift()
  const colorScale = [lighterColors.reverse(), darkerColors].flat(1);
  return colorScale
}

// SOURCE: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
export function rgbToHex(r, g, b) {
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex
} 

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getColor(value, breaks, colors) {
  if (!value) {
    return null;
  }
  let color;
  let found = false;
  let i = 1;
  while (found == false) {
    if (value <= breaks[i]) {
      color = colors[i - 1];
      found = true;
    } else if (value >= breaks[breaks.length - 1]) {
      color = colors[breaks.length - 1];
      found = true;
    } else {
      i ++;
    }
  }
  return color ? color : null;
}
