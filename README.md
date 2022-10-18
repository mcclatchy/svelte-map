# svelte-map

## Overview
This repository helps create scrollable or interactive maps. It's built in [Svelte](https://svelte.dev/) (based initially on [ONS svelte-maps](https://github.com/ONSvisual/svelte-maps) repository) and uses [MapLibre GL](https://maplibre.org/maplibre-gl-js-docs/api/) to power different map interactions. You can add different items to the map: raster tiles, images, topojson, lines, fills, circles, symbols. You can support custom fonts (see README.md in `fonts/` folder). And if you're making a scrollable map, the text and sections can be powered by an [AML](http://archieml.org/) to JSON workflow.

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
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
    hoverable: false
    
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
                
                // whether this section should allow hovering (default is false)
                "hoverable": "false"
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
