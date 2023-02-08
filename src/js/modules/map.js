import { feature } from 'topojson-client';
import { deg2rad } from './math.js'
import { getColor } from './color.js'

export async function getMapDataDict(sources) {
  const data = {};
  for (const source of sources) {
    const sourceId = source?.sourceId
    const sourceDataType = source?.dataType
    const sourceFilepath = source?.filepath
    const sourcePromoteId = source?.promoteId
    const colorData = source?.colorData || {};
    const layers = source?.layers

    if (sourceDataType === "topojson") {
      const jsonData = await getJsonData(sourceFilepath)

      // Get the data by layer
      for (const layer of layers) {
        const layerId = layer?.layerId
        const mapLayerId = layer?.mapLayerId
        const sourceMapId = `${sourceId}-${mapLayerId}`;
        if (!data.hasOwnProperty(sourceMapId)) {
          const layerColorData = colorData.hasOwnProperty(layerId) ? colorData[layerId] : {};
          const formattedData = await formatTopojsonLayer(
            jsonData,
            layerId, 
            layerColorData?.colorField,
            layerColorData?.colorScale,
            layerColorData?.colorBreaks,
            layerColorData?.colorDict,
            layerColorData?.defaultColor,
          )
          data[sourceMapId] = {
            data: formattedData,
            type: sourceDataType,
            promoteId: sourcePromoteId,
            layers: [layer]
          }
        } else {
          data[sourceMapId].layers.push(layer)
        }
      }
    } else if (sourceDataType === "image") {
      for (const layer of layers) {
        const mapLayerId = layer?.mapLayerId
        const sourceMapId = `${sourceId}-${mapLayerId}`;
        if (!data.hasOwnProperty(sourceMapId)) {
          data[sourceMapId] = {
            url: sourceFilepath,
            type: sourceDataType,
            coordinates: source?.coordinates,
            layers: [layer]
          }
        } else {
          data[sourceMapId].layers.push(layer)
        }
      }
    } else if (sourceDataType === "raster") {
      for (const layer of layers) {
        const mapLayerId = layer?.mapLayerId
        const sourceMapId = `${sourceId}-${mapLayerId}`;
        if (!data.hasOwnProperty(sourceMapId)) {
          data[sourceMapId] = {
            url: sourceFilepath,
            type: sourceDataType,
            tileSize: source?.tileSize,
            minZoom: source?.minZoom,
            maxZoom: source?.maxZoom,
            layers: [layer]
          }
        } else {
          data[sourceMapId].layers.push(layer)
        }
      }
    } else {
      for (const layer of layers) {
        const mapLayerId = layer?.mapLayerId
        const sourceMapId = `${sourceId}-${mapLayerId}`;
        if (!data.hasOwnProperty(sourceMapId)) {
          data[sourceMapId] = {
            type: sourceDataType,
            layers: [layer]
          }
        } else {
          data[sourceMapId].layers.push(layer)
        }
      }
    }    
  }
  return data;
}  

export async function getTopoLayer(url, layer) {
  let response = await fetch(url);
  let json = await response.json();
  let geojson = await feature(json, layer);
  return geojson;
}

export async function getJsonData(url) {
  let response = await fetch(url);
  let json = await response.json();
  return json;
}

export async function formatTopojsonLayer(json, layer, colorField=null, colorScale=null, colorBreaks=null, colorDict=null, defaultColor="rgba(242,242,242,1)") {
  let topojson = await feature(json, layer);
  if (colorField) {
    topojson.features.forEach(d => {
      let colorValue = d.properties[colorField]
      if (colorScale && colorBreaks) {
        d.properties.color = getColor(colorValue, colorBreaks, colorScale)
      } else if (colorDict) {
        d.properties.color = colorDict.hasOwnProperty(colorValue) ? colorDict[colorValue] : defaultColor;
      }
    });
  }
  return topojson;
}

export async function getAndFormatTopojsonData(url, layer, colorField=null, colorScale=null, colorBreaks=null, colorDict=null, defaultColor="rgba(242,242,242,1)") {
  let json = await getJsonData(url);
  let formattedTopojson = formatTopojsonLayer(json, layer, colorField, colorScale, colorBreaks, colorDict, defaultColor)
  return formattedTopojson;
}

// Expects bbox to be this format: [[lon,lat], [lon,lat]]
export function getBBoxAspectRatio(bbox) {
  const lon1 = bbox[0][0];
  const lon2 = bbox[1][0];

  const lat1 = bbox[0][1];
  const lat2 = bbox[1][1];

  const horizontalSide = getDistanceFromLatLonInKm(lon1, lat1, lon2, lat1);
  const verticalSide = getDistanceFromLatLonInKm(lon1, lat1, lon1, lat2);

  const aspectRatio = Math.round(horizontalSide / verticalSide * 100) / 100;
  return aspectRatio;
}

function getDistanceFromLatLonInKm(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

export function setupIcon(map, filepath, imageName, width=200, height=200, sdf=false) {
  let img = new Image(width, height)
  img.crossOrigin = "Anonymous";
  img.onload = ()=> map.addImage(imageName, img, {sdf})
  img.src = filepath
}
