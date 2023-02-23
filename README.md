# svelte-map

## Overview
This repository helps create scrollable or interactive maps. It's built in [Svelte](https://svelte.dev/) (based initially on [ONS svelte-maps](https://github.com/ONSvisual/svelte-maps) repository) and uses [MapLibre GL](https://maplibre.org/maplibre-gl-js-docs/api/) to power different map interactions. You can add different items to the map: raster tiles, images, topojson, lines, fills, circles, symbols. You can support custom fonts (see README.md in `fonts/` folder). And if you're making a scrollable map, the text and sections can be powered by an [AML](http://archieml.org/) to JSON workflow.

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run the following commands:

``` bash
# Install dependencies (only the first time)
npm install --dev
npm install

# Run the local server at localhost:3000
npm run dev

# Build for production in the dist/ directory
npm run build
```

## AML to JSON
The AML document will drive important parts of the map: the text, the placement of text, where the map will focus on and certain camera movements. For this pipeline, we're using an AML to JSON workflow. You could skip straight into the JSON if that's preferable, since that's what will be read by the code.

This is an example of an AML format for a scrollable map with 2 sections. You minimally need to define `id`, `bounds`, and `text` for each section. You could place this in a Google doc for instance and run the McClatchy NewsX add-on to output a JSON file. This file is placed in the `src/assets` folder.
```
[+content]

{.scrolling-map}
  id: statewide

  [.sections]
    id: one
    text: Across North Carolina, about 20 major firms own at least 40,000 single-family homes.
    bounds: north_carolina
    horizontalPosition: left
    pitch: 0
    bearing: 0
    speed: 1
    tooltip: true
    
    id: two
    text: Their portfolios are especially concentrated in the Charlotte metro area.
    bounds: charlotte
  []
{}
```

This is the format of an example output JSON
```
{
    "content": [
    {
        "type": "scrolling-map",
        "value":
        {
            // id for the scrolling-map content
            "id": "statewide",  
            "sections": [
            {
                // id for the section
                "id": "one", 
                
                // id for the bounds bbox (defined in the map-specific config)
                "bounds": "north_carolina", 
                
                // id for the section - HTML capable
                "text": "Across North Carolina, about 20 major firms own at least 40,000 single-family homes.",
                
                // CSS class indicating horizontal position of text box (default is center)
                "horizontalPosition": "left",
                
                // camera pitch in maplibre-gl (default is 0)
                "pitch": "0",
                
                // camera bearing in maplibre-gl (default is 0)
                "bearing": "0",
                
                // speed of movement in maplibre-gl (default is 0.6)
                "speed": "1",
                
                // whether this section should allow a tooltip (default is false)
                "tooltip": "true",
                
                // whether this section should allow interactivity - scrolling zoom, panning on click+drag (default is false)
                "interactive": "true"
            },
            {
                "id": "two",
                "text": "Their portfolios are especially concentrated in the Charlotte metro area.",
                "bounds": "charlotte"
            }
        }
    }
}
```

## Data
As is, the repository is set up to handle `topojson` files - you can convert most geo files into `topojson` with [Mapshaper](https://mapshaper.org/). The data files live in the `src/data` folder. If you add images, you can place them in the `src/images` folder - this framework should support the same image types that maplibre-gl supports.

## Map Config
The config file aims to centralize as much customization of a scrollable map into one file as possible. In this repository, that config file is found at `src/js/components/MapExample.svelte`. There are several customizable elements that can contribute to the map experience:

* `mapStyleUrl`
* `mapBounds`
* `mapIcons`
* `mapAttribution`
* `mapLegends`
* `mapLayerOrder`
* `mapSources`
* `mapTooltips`

#### mapStyleUrl
This is the skeleton of a style JSON that you might find for MapBox or other MapLibre vector maps. It minimally has a `version` (not sure why this is needed - worth looking up), `sources`, and `layers`. If you want to add text to the map, you also need a `glyphs` field. I use the following, and place `style.json` and `styleDev.json` in the `/src/data/` folder.

``` json
{
  "version": 8,
  "sources": {},
  "glyphs": "../fonts/{fontstack}/{range}.pbf",
  "layers": []
}
```

#### mapBounds
This is an Object in JS whose ids correspond to the `bounds` ids found in the AML / JSON document that drives the experience. Each entry has an array of arrays defining the bounding box of the bounds. Ultimately this gets passed to a maplibre-gl `fitBounds` function.

``` javascript
const mapBounds = {
  charlotte: [[ -81.090043, 35.551569], [ -80.491228, 34.9967]],
  fuquay: [[-78.916888, 35.697333], [-78.687336, 35.527515]]
};
```

#### mapIcons
This is an array of Objects that become symbols in the map through a maplibre-gl `addImage` function. Necessary fields are `filepath` and `imageName`. Optional ones are `width` and `height` (both default to 200). The `imageName` can be referenced in a maplibre-gl layout style, like the following: `'icon-image': ['get', 'type'],` where for that particular data layer, the "type" field can match an image name.

``` javascript
const mapIcons = [
  {
    filepath: `${imagePath}/airport.svg`,
    imageName: 'airport'
  },
  {
    filepath: `${imagePath}/interstate.svg`,
    imageName: 'interstate'
  },
  {
    filepath: `${imagePath}/intrastate.svg`,
    imageName: 'intrastate',
    width: 200,
    height: 171
  }
]
```

#### mapAttribution
This is an Object with required `text` field (accepts HTML) and optional `placement` (see maplibre-gl API for options). Adds an attribution to the map.

``` javascript
const mapAttribution = {
  placement: "bottom-left",
  text: `
    <div style=\"padding-left: 10px; padding-bottom: 10px;\">
      <span style="font-weight: bold">Map:</span>OpenStreetMap contributors
      <br>
      <span style="font-weight: bold">Data:</span>N&O/Observer analysis
    </div>
  `
}
```

#### mapLegends
This is also an array of Objects. It is currently configurable to allow map legends for categorical data, or for continuous data using a discrete color scale (I called it swatches). This is more of a template though for what you could do. If you wanted to change up the logic that applies to this config and use new legend types, or change those specific legend types to look different, you can create a new `MapLegend<YOUR TYPE HERE>.svelte` file and edit the `MapScroller.svelte` file to reference your preferred legends. The parameters are pretty specific to the legend components I made (`MapLegendSwatches.svelte`, `MapLegendCategorical.svelte`), and are reflected below in the example:

``` javascript
const mapLegends = [
  {
    type: "swatches",
    title: "Corporate landlord rental homes<br class='mobile'/> in Mecklenburg County",
    palette: primaryColorScale,
    splits: zoomedHexagonBreaks,
    sections: ["two", "six"],
    width: 450,
    annotations: [{label: "Lower Density", class: 'left'}, {label: "Rental Homes / sq. mi.", class: 'center'}, {label: "Higher Density", class: 'right'}]
  },{
    type: "categorical",
    title: "Corporate landlord rental homes<br class='mobile'/> in Charlotte Neighborhood",
    palette: ["#8ce38f", "#2c719f", "#ffa4b1", "#1f8166", "#cf307a", "#8dcaf0", "#d5cc80"],
    splits: ["Tricon Residential", "American Homes 4 Rent", "Progress Residential", "Firstkey", "Invitation Homes", "Amherst Residential", "Other"],
    sections: ["three", "four", "five"],
    width: 600,
    annotations: []
  }
}
```

#### mapLayerOrder
This is an array that centralizes the logic for which layers are on top of each other. First in the array lives second in the array, etc. The ids referenced here will be the ids you find in the `mapSources` array under `mapLayerId`.

``` javascript
const mapLayerOrder = [
  'state-names',
  'city-names',
  'medium-city-names',
  'small-city-names',
  'zoom-city-names',
  'area-names',
  'street-names',
  'icons'
]
```

#### mapSources
This is an array of Objects that does the majority of the work for the data that will appear on your map. It's similar to a maplibre-gl or mapbox-gl style JSON, and still makes use of the same `paint` and `layout` fields, with more support for switching styles with different sections. There are also other fields in the `source` and `layer` levels that define the data file URL, that can add color fields dynamically, or add image coordinates.

Each source entry in the array is an Object that minimally has fields for a `filepath` string (the data URL), a `sourceId` string (any id you want), a `dataType` string (topojson, image, raster) and a `layers` array. It can optionally have a `promoteId` (used for hovering/selecting/tooltips - indicates the id field in the topojson being used), a `colorData` Object (which can dynamically apply colors to layers using categorical, continuous or discrete color scales), a `coordinates` array (used for image layers), a `tileSize` field (used for raster tiles).

Each `layer` in the layer array is an object that minimally should have a `mapLayerId` (any id you want), a `layerType` (symbol, circle, image, raster, fill, line, etc.) and a `paint` object. It can also have a `layerId` (when you use a topojson this is necessary), or a `tooltip` Object if you want hoverability (`tooltip: { hover: true, select: true }` - in this scenario the source layer must have a `promoteId` which is the property field in the topojson that indicates what object is being hovered over).

For the `paint` and `layout` objects, you can define a `default` style as nested object.
```
paint: {
  default: {
     <YOUR STYLE HERE>
  }
}
```
However, you can also define a style tied to a specific section id, by using the section id found in the driving AML / JSON (like `one`) as a key to another nested object. Doing so will override the default when that section comes into the screen. If section `two` scrolls into view, it will revert to the `default`.
```
paint: {
  default: {
     <YOUR STYLE HERE>
  },
  one: {
     <YOUR STYLE HERE>
  }
}
```

#### Examples: mapSource & mapLayer 

*raster tiles* 

`dataType: "raster"`

`layerType: "raster"`

```javascript
{		
  filepath: 'https://cartodb-basemaps-b.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
  sourceId: "basetiles",
  dataType: "raster",
  tileSize: 256,
  maxZoom: 20,
  layers: [
    {
      mapLayerId: "basetiles",
      layerType: "raster",
      paint: {
        default: {
          "raster-saturation": -1,
          "raster-opacity": 1
        }
      }
    }
  ]
}
```

*image* 

`dataType: "image"`

`layerType: "raster"`

``` javascript
{		
  filepath: `${imagePath}/neighborhood.png`,
  sourceId: "neighborhood",
  dataType: "image",
  coordinates: 	[
    [-80.88558352499712, 35.297005839984934],
    [-80.87288535195562, 35.297005839984934],
    [-80.87288535195562, 35.29099449007646],
    [-80.88558352499712, 35.29099449007646]
  ],
  layers: [
    {
      mapLayerId: "neighborhood-image",
      layerType: "raster",
      paint: {
        default: {
          "raster-opacity": 0,
          "raster-opacity-transition": {"duration": 300,"delay": 0}
        },
        four: {
          "raster-opacity": 1
        },
        five: {
          "raster-opacity": 1
        }
      }
    }
  ]
},
```

*topojson*

`dataType: "topojson"`

`layerType: "fill"` OR `layerType: "line"` OR `layerType: "circle"` etc.

``` javascript
{		
  filepath: `${dataPath}/homes.json`,
  sourceId: "homes",
  dataType: "topojson",
  promoteId: "investor",
  colorData: {
    homes: {
      colorField: "investor",
      colorDict: investorColors,
      defaultColor: "#d5cc80"
    }
  },
  layers: [
    {
      mapLayerId: "home-fill",
      layerId: "homes",
      layerType: "fill",
      paint: {
        default: {
          'fill-color': ["interpolate",["linear"],["zoom"],3,"rgba(125,125,125,0)",13,"rgb(150,150,150)",14,['get', 'color'],15,['get', 'color']],
          'fill-opacity': ["interpolate",["linear"],["zoom"],3,0,13,0,14,1,15,1],
          "fill-opacity-transition": {"duration": 300,"delay": 0},
        }
      },
      tooltip: {
        hover: true,
        select: true
      }
    },
    {
      mapLayerId: "home-line",
      layerId: "homes",
      layerType: "line",
      paint: {
        default: {
          'line-color': ["interpolate",["linear"],["zoom"],3,"rgba(125,125,125,0)",13,"rgb(150,150,150)",14,['get', 'color'],15,['get', 'color']],
          'line-opacity': ["interpolate",["linear"],["zoom"],3,0,13,0,14,0.7,15,1],
          "line-opacity-transition": {"duration": 300,"delay": 0}
        }
      }
    }
  ]
}
```

#### mapTooltips
This is an object that takes a `layerId` as a key and a function as a value. The function defines what a tooltip should look like and takes a feature object as its only parameter. This means it can successfully access properties through the pattern `obj.feature.properties.address`, for instance, if address is a property in the topojson feature. The function should return an HTML string that dictates how the tooltip will appear.

Here's a simple example of the map layer named `home-fill` using the `getAddressTooltipHTML` to display a simple address string in its tooltip (activated by hover or selection).

``` javascript
function getAddressTooltipHTML(obj) {
  const tooltipHTML = `
    <p class="tooltip-address">
      ${obj.feature.properties.address}
    </p>
  `
  return tooltipHTML
}
  
const mapTooltips = {
  'home-fill': getAddressTooltipHTML
}
```

If you want to add specific styling onto your tooltip, you can add a `<style>` tag at the bottom of your config file. Here's a simple example for the address tooltip. Make sure to use `:global(<CLASS NAME>)` in order to ensure this styling gets applied to the templated HTML string returned by your tooltip function.

``` html
<style>
  :global(.tooltip-address) {
    color: red;
  }
</style>
```
