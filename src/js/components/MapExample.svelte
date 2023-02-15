<script>
	import MapScroller from './MapScroller.svelte';
  import { isPortrait } from '../modules/store.js';
  import { isMobile } from "../modules/utils.js";
  import { makeColors } from "../modules/color.js";

  export let dataPath;
  export let imagePath;
  export let scrollY;
  export let mapSectionData;
  export let mapId;

  // Setting map style JSON and fonts
  const mapStyleUrl = import.meta.env.PROD ? `${dataPath}/style.json` : `${dataPath}/styleDev.json`
	const fontRegular = "Lato Regular"
	const fontBold = "Lato Bold"

	// Setting some color scales with splits
	const primaryColor = "#d93a4c"
  const primaryColorScale = makeColors(primaryColor, 1, 3, 0.1, 0.8)
	const backgroundColorScale = ["#FAFAFA", "#F4F4F4", "#EFEFEF", "#EAEAEA","#EAEAEA", "#EAEAEA", "#EAEAEA"]
	const hexagonBreaks = [1, 5, 10, 50, 150, 1100]
	const zoomedHexagonBreaks = [1, 2, 5, 10, 15, 175]
  const investorColors = {
    "AMERICAN HOMES 4 RENT": "#2c719f", //dark blue
    "PROGRESS RESIDENTIAL": "#ffa4b1", //light pink
    "INVITATION HOMES": "#cf307a", //dark pink
    "AMHERST RESIDENTIAL": "#8dcaf0", //light blue
    "TRICON RESIDENTIAL": "#8ce38f", //light green
    "FIRSTKEY": "#1f8166" //dark green
  }


  const mapBounds = {
    charlotte: [[ -81.090043, 35.551569], [ -80.491228, 34.9967]],
    fuquay: [[-78.916888, 35.697333], [-78.687336, 35.527515]]
  };

  $: if ($isPortrait) {
    mapBounds.north_carolina = [[-81.606,33.613 ], [-77.460,36.547]];
    mapBounds.neighborhood = [[-80.88675,35.29707], [-80.87697,35.28754]];
    mapBounds.neighborhood_zoom = [[-80.878612,35.294037], [-80.880125,35.293901]];
    mapBounds.raleigh = [[-79.0864,36.1579], [-78.2025,35.4883]];
  } else {
    mapBounds.north_carolina = [[ -84.521988, 33.645 ], [-75.1994, 37.2881695]];
    mapBounds.neighborhood = [[-80.88741,35.29696], [-80.87243,35.28751]];
    mapBounds.neighborhood_zoom = [[-80.883474,35.294037], [-80.877985,35.293901]];
    mapBounds.raleigh = [[-79.1445,36.1579], [-78.1306,35.4883]];
  }

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

	const mapAttribution = {
		placement: "bottom-left",
		text: `
	    <div style=\"padding-left: 10px; padding-bottom: 10px;\">
	      <span style="font-weight: bold">Map:</span> <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">&copy; OpenStreetMap contributors</a>
	      <br>
	      <span style="font-weight: bold">Data:</span> <a href='https://www.nconemap.gov/pages/parcels' target='_blank'>NC OneMap</a>, <a href=\"https://github.com/mcclatchy-southeast/security_for_sale\" target=\"_blank\">N&O/Observer analysis</a>
	    </div>
	  `
	}

  const mapLegends = [
  	{
  		type: "swatches",
  		title: "Corporate landlord rental homes<br class='mobile'/> in North Carolina",
  		palette: primaryColorScale,
  		splits: hexagonBreaks,
  		position: "sticky",
  		sections: ["one"],
  		width: 450,
  		annotations: [{label: "Lower Density", class: 'left'}, {label: "Rental Homes / sq. mi.", class: 'center'}, {label: "Higher Density", class: 'right'}]
  	},{
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
  	},{
  		type: "swatches",
  		title: "Corporate landlord rental homes<br class='mobile'/> in The Triangle",
  		palette: primaryColorScale,
  		splits: zoomedHexagonBreaks,
  		sections: ["seven"],
  		width: 450,
  		annotations: [{label: "Lower Density", class: 'left'}, {label: "Rental Homes / sq. mi.", class: 'center'}, {label: "Higher Density", class: 'right'}]
  	},{
  		type: "swatches",
  		title: "Corporate landlord rental homes<br class='mobile'/> in Southeast Wake County",
  		palette: primaryColorScale,
  		splits: zoomedHexagonBreaks,
  		sections: ["eight"],
  		width: 450,
  		annotations: [{label: "Lower Density", class: 'left'}, {label: "Rental Homes / sq. mi.", class: 'center'}, {label: "Higher Density", class: 'right'}]
  	}
  ]

	const mapLayerOrder = [
    'state-names',
    'city-names',
    'medium-city-names',
    'small-city-names',
    'zoom-city-names',
    'area-names',
    'street-names',
    'icons',

    'mecklenburg-outline',
    'the-triangle-outline',
    'north-carolina-outline',
    'surrounding-state-line',
    'surrounding-state-fill',

    "investor-sfr-hexagon-line",
    "mecklenburg-hexagon-line",
    "the-triangle-hexagon-line",

    "investor-sfr-hexagon-fill",
    "mecklenburg-hexagon-fill",
    "the-triangle-hexagon-fill",
    "home-fill",

    'mecklenburg-highway',
    'mecklenburg-highway-border',
    'the-triangle-highway',
    'the-triangle-highway-border',

    "zoomed-hexagon-line",
    "zoomed-hexagon-fill",

    "mecklenburg-grid-line",
    "the-triangle-grid-line",

    "mecklenburg-grid-fill",
    "the-triangle-grid-fill",
    
    'nc-highway',
    'nc-highway-border',

    'neighborhood-image',
    'basetiles'
  ]

	const mapSources = [
		// MAP LABELS
		{
			filepath: `${dataPath}/labelsExample.json`,
			sourceId: "labelsExample",
			dataType: "topojson",
			layers: [
				// STATE NAMES
				{
					mapLayerId: "state-names",
					layerId: "state",
					layerType: "symbol",
					paint: {
						default: {
							"text-color": "rgba(118, 116, 108, 1)",
				      "text-halo-color": "rgba(255,255,255,0.7)",
				      "text-halo-width": 0.8
						}
					},
					layout: {
						default: {
							"text-font": [fontRegular],
							"text-size": ["interpolate", ["linear"], ["zoom"],3,10,5,11,6,16],
							'text-field': ['format', ['upcase', ['get', 'description']]],
							"visibility": "visible",
							"text-padding": 2,
							"text-transform": "uppercase",
							"text-letter-spacing": 0.1,
							"text-allow-overlap": true
						}
					}
				},
				// CITY NAMES
				{
					mapLayerId: "city-names",
					layerId: "city",
					layerType: "symbol",
					paint: {
						default: {
					    'text-color': "#333",
					    'text-halo-color': "rgba(255,255,255,0.8)",
					    "text-halo-width": 2,
					    'text-opacity': ["interpolate",["linear"],["zoom"],8,1,9,1,12,1,14,0]
						}
					},
					layout: {
						default: {
				      "text-font": ["step", ["zoom"], ["literal", [fontRegular]], 8, ["literal", [fontRegular]], 9, ["literal", [fontBold]] ],
				      "text-size": {
				        "base": 1.2,
				        "stops": [[7, 17], [9, 22], [11, 22]]
				      },
				      'text-field': ['get', 'description'],
				      "text-anchor": ['get', 'anchor'],
				      "text-offset": [0, 0],
				      "text-max-width": 8,
				      "text-allow-overlap": true
						}
					}
				},
				// MEDIUM CITY NAMES
				{
					mapLayerId: "medium-city-names",
					layerId: "city-medium",
					layerType: "symbol",
					paint: {
						default: {
				      'text-color': "#333",
				      'text-halo-color': "rgba(255,255,255,0.8)",
				      "text-halo-width": 2,
				      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					},
					layout: {
						default: {
				      "text-font": [fontBold],
				      "text-size": {
				        "base": 1.2,
				        "stops": [[7, 14], [9, 19], [11, 19]]
				      },
				      'text-field': ['get', 'description'],
				      "text-anchor": ['get', 'anchor'],
				      "text-offset": [0, 0],
				      "text-max-width": 8,
				      "text-allow-overlap": true
						}
					}
				},
				// SMALL CITY NAMES
				{
					mapLayerId: "small-city-names",
					layerId: "city-small",
					layerType: "symbol",
					paint: {
						default: {
				      'text-color': "#333",
				      'text-halo-color': "rgba(255,255,255,0.8)",
				      "text-halo-width": 2,
				      'text-opacity': isMobile.any() ? 0 : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					},
					layout: {
						default: {
				      "text-font": [fontRegular],
				      "text-size": {
				        "base": 1.2,
				        "stops": [[7, 10], [9, 14], [11, 14]]
				      },
				      'text-field': ['get', 'description'],
				      "text-anchor": ['get', 'anchor'],
				      "text-offset": [0, 0],
				      "text-max-width": 8,
				      "text-allow-overlap": true
						}
					}
				},
				// ZOOM CITY NAMES
				{
					mapLayerId: "zoom-city-names",
					layerId: "city-zoom",
					layerType: "symbol",
					paint: {
						default: {
				      'text-color': "#333",
				      'text-halo-color': "rgba(255,255,255,0.8)",
				      "text-halo-width": 2,
				      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					},
					layout: {
						default: {
				      "text-font": [fontRegular],
				      "text-size": {
				        "base": 1.2,
				        "stops": [[7, 10], [9, 14], [11, 17]]
				      },
				      'text-field': ['get', 'description'],
				      "text-anchor": ['get', 'anchor'],
				      "text-offset": [0, 0],
				      "text-max-width": 8,
				      "text-allow-overlap": true
						}
					}
				},
				// AREA NAMES
				{
					mapLayerId: "area-names",
					layerId: "area",
					layerType: "symbol",
					paint: {
						default: {
				      'text-color': primaryColor,
				      'text-halo-color': "rgba(255,255,255,0.8)",
				      "text-halo-width": 2,
				      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					},
					layout: {
						default: {
				      "text-font": [fontBold],
				      "text-size": {
				        "base": 1.2,
				        "stops": [[7, 16], [11, 22], [11, 22]]
				      },
				      'text-field': ['get', 'description'],
				      "text-anchor": ['get', 'anchor'],
				      "text-offset": [0, 0],
				      "text-max-width": 2,
				      "text-transform": "uppercase",
				      "text-allow-overlap": true
						}
					}
				},
				// STREET NAMES
				{
					mapLayerId: "street-names",
					layerId: "street",
					layerType: "symbol",
					paint: {
						default: {
				      'text-color': "rgba(118, 116, 108, 1)",
							'text-halo-color': "rgba(255,255,255,0.8)",
				      "text-halo-width": 2,
				      'text-opacity': ["interpolate",["linear"],["zoom"],3,0,13,0,14,1,15,1]
						}
					},
					layout: {
						default: {
				      "text-font": [fontRegular],
				      "text-size": {
				        "base": 1.2,
				        "stops": [[7, 10], [9, 14], [11, 14]]
				      },
				      'text-rotate': -40,
				      'text-field': ['get', 'description'],
				      "text-anchor": ['get', 'anchor'],
				      "text-allow-overlap": true
						}
					}
				},
				// ICON NAMES
				{
					mapLayerId: "icons",
					layerId: "icons",
					layerType: "symbol",
					paint: {
						default: {
				      'text-color': '#a1a1a1',
				      'text-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
				      'icon-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
						}
					},
					layout: {
						default: {
				      "text-font": [fontRegular],
				      "text-size": isMobile.any() ? ["interpolate", ["linear"], ["zoom"],3,5,5,6,6,7] : ["interpolate", ["linear"], ["zoom"],3,5,5,6,6,10],
				      'text-field': ['format', ['upcase', ['get', 'description']]],
				      'text-offset': ['match', ['get', 'type'], 'interstate', ["literal", [0, 0.125]], 'intrastate', ["literal", [0, 0]], ["literal", [0, 0.25]]],
				      "visibility": "visible",
				      "text-padding": 2,
				      "text-transform": "uppercase",
				      "text-letter-spacing": 0.05,
				      "text-allow-overlap": true,
				      'icon-allow-overlap': true,
				      'text-anchor': ['get', 'anchor'],
				      'icon-anchor': ['get', 'anchor'],
				      'icon-image': ['get', 'type'],
				      'icon-size': isMobile.any() ? 0.08 : 0.13
						}
					}
				}
			]
		},

		// NORTH CAROLINA
		{		
			filepath: `${dataPath}/northCarolina.json`,
			sourceId: "northCarolina",
			dataType: "topojson",
			layers: [
				// NORTH CAROLINA OUTLINE
				{
					mapLayerId: "north-carolina-outline",
					layerId: "northCarolina",
					layerType: "line",
					paint: {
						default: {
				      'line-color': "rgb(150,150,150)",
				      'line-width': 1,
						}
					}
				}
			]
		},

		// SURROUNDING STATES
		{		
			filepath: `${dataPath}/surroundingStates.json`,
			sourceId: "surroundingStates",
			dataType: "topojson",
			layers: [
				// SURROUNDING STATE LINE
				{
					mapLayerId: "surrounding-state-line",
					layerId: "surroundingStates",
					layerType: "line",
					paint: {
						default: {
				      'line-color': "rgba(210,210,210,1)",
				      'line-width': 0.5
						}
					}
				},
				// SURROUNDING STATE FILL
				{
					mapLayerId: "surrounding-state-fill",
					layerId: "surroundingStates",
					layerType: "fill",
					paint: {
						default: {
				      'fill-color': '#FCFCFC',
				      'fill-opacity': 0.8,
				      "fill-opacity-transition": {
				        "duration": 300,
				        "delay": 0
				      }
						}
					}
				}
			]
		},

		// NC HIGHWAYS
		{		
			filepath: `${dataPath}/northCarolinaHighways.json`,
			sourceId: "northCarolinaHighways",
			dataType: "topojson",
			layers: [
				// NC HIGHWAY
				{
					mapLayerId: "nc-highway",
					layerId: "northCarolinaHighways",
					layerType: "line",
					paint: {
						default: {
				      'line-color': "white",
				      'line-width': isMobile.any() ? 1 : 2.5,
				      'line-opacity': ["interpolate", ["linear"], ["zoom"], 3, 1, 8, 1, 11, 0, 14, 0]
						}
					},
					layout: {
						default: {
							'line-cap': 'round'
						}
					}
				},
				// NC HIGHWAY BORDERS
				{
					mapLayerId: "nc-highway-border",
					layerId: "northCarolinaHighways",
					layerType: "line",
					paint: {
						default: {
				      'line-color': 'rgb(213, 213, 213)',
				      'line-width': isMobile.any() ? 2 : 3.5,
				      'line-opacity': ["interpolate", ["linear"], ["zoom"], 3, 1, 8, 1, 11, 0, 14, 0]
						}
					},
					layout: {
						default: {
							'line-cap': 'round'
						}
					}
				}
			]
		},

		// INVESTOR SFR HEXAGONS
		{		
			filepath: `${dataPath}/hexagons.json`,
			sourceId: "hexagons",
			dataType: "topojson",
			colorData: {
				hexagons: {
					colorField: "count",
					colorScale: primaryColorScale,
					colorBreaks: hexagonBreaks
				}
			},
			layers: [
				// INVESTOR SFR HEXAGON FILL
				{
					mapLayerId: "investor-sfr-hexagon-fill",
					layerId: "hexagons",
					layerType: "fill",
					paint: {
						default: {
							'fill-color': ['get', 'color'],
							'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,1,8,0,14,0] : ["interpolate",["linear"],["zoom"],8,1,9,0,14,0],
							"fill-opacity-transition": {"duration": 300,"delay": 0}
						},
						six: {
							'fill-opacity': 0
						},
						seven: {
							'fill-opacity': 0
						}
					}
				},
				// INVESTOR SFR HEXAGON LINE
				{
					mapLayerId: "investor-sfr-hexagon-line",
					layerId: "hexagons",
					layerType: "line",
					paint: {
						default: {
							'line-color': "#aaaaaa", //'#D7D0D4',
							"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0.2,8,0,10,0,14,0] : ["interpolate",["linear"],["zoom"],8,0.2,9,0,10,0,14,0],
							'line-width': 1
						}
					}
				}
			]
		},

		// ZOOMED HEXAGONS
		{		
			filepath: `${dataPath}/zoomedHexagons.json`,
			sourceId: "zoomedHexagons",
			dataType: "topojson",
			colorData: {
				hexagons: {
					colorField: "count",
					colorScale: backgroundColorScale,
					colorBreaks: zoomedHexagonBreaks
				}
			},	
			layers: [
				// ZOOMED HEXAGON FILL
				{
					mapLayerId: "zoomed-hexagon-fill",
					layerId: "hexagons",
					layerType: "fill",
					paint: {
						default: {
							'fill-color': ['get', 'color'],
							'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0,10,1,12,1,14,0],
							"fill-opacity-transition": {"duration": 300,"delay": 0}
						}
					}
				},
				// ZOOMED HEXAGON LINE
				{
					mapLayerId: "zoomed-hexagon-line",
					layerId: "hexagons",
					layerType: "line",
					paint: {
						default: {
							'line-color': 'white', //'#D7D0D4',
							"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0,10,1,12,1,14,0],
							'line-width': 0.1
						}
					}
				}
			]
		},

		// MECKLENBURG HEXAGONS
		{		
			filepath: `${dataPath}/mecklenburgHexagons.json`,
			sourceId: "mecklenburgHexagons",
			dataType: "topojson",
			colorData: {
				hexagons: {
					colorField: "count",
					colorScale: primaryColorScale,
					colorBreaks: zoomedHexagonBreaks
				}
			},	
			layers: [
				// MECKLENBURG HEXAGON FILL
				{
					mapLayerId: "mecklenburg-hexagon-fill",
					layerId: "hexagons",
					layerType: "fill",
					paint: {
						default: {
							'fill-color': ['get', 'color'],
							'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
							"fill-opacity-transition": {"duration": 300,"delay": 0}
						}
					}
				},
				// MECKLENBURG HEXAGON LINE
				{
					mapLayerId: "mecklenburg-hexagon-line",
					layerId: "hexagons",
					layerType: "line",
					paint: {
						default: {
							'line-color': "#aaaaaa", //'#D7D0D4',
							"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.3,12,0.3,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.3,12,0.3,14,0],
							'line-width': 0.1
						}
					}
				}
			]
		},

		// MECKLENBURG GRID
		{		
			filepath: `${dataPath}/mecklenburgGrid.json`,
			sourceId: "mecklenburgGrid",
			dataType: "topojson",
			colorData: {
				hexagons: {
					colorField: "count",
					colorScale: primaryColorScale,
					colorBreaks: hexagonBreaks
				}
			},	
			layers: [
				// MECKLENBURG GRID FILL
				{
					mapLayerId: "mecklenburg-grid-fill",
					layerId: "hexagons",
					layerType: "fill",
					paint: {
						default: {
							'fill-color': "#ffffff",
							'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.7,12,0.7,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.7,12,0.7,14,0],
							"fill-opacity-transition": {"duration": 300,"delay": 0}
						}
					}
				},
				// MECKLENBURG GRID LINE
				{
					mapLayerId: "mecklenburg-grid-line",
					layerId: "hexagons",
					layerType: "line",
					paint: {
						default: {
				    	'line-color': 'rgba(230,230,230,1)',
							'line-width': 0.5,
							'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				}
			]
		},

		// MECKLENBURG OUTLINE
		{		
			filepath: `${dataPath}/mecklenburgOutline.json`,
			sourceId: "mecklenburgOutline",
			dataType: "topojson",
			layers: [
				// MECKLENBURG OUTLINE
				{
					mapLayerId: "mecklenburg-outline",
					layerId: "mecklenburgOutline",
					layerType: "line",
					paint: {
						default: {
							'line-color': 'rgba(150,150,150,1)',
							'line-width': 2,
							'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				}
			]
		},

		// MECKLENBURG HIGHWAYS
		{		
			filepath: `${dataPath}/mecklenburgHighways.json`,
			sourceId: "mecklenburgHighways",
			dataType: "topojson",
			layers: [
				// MECKLENBURG HIGHWAY 
				{
					mapLayerId: "mecklenburg-highway",
					layerId: "mecklenburgHighways",
					layerType: "line",
					paint: {
						default: {
				      'line-color': "white",
				      'line-width': isMobile.any() ? 2 : 4.5,
				      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				},
				// MECKLENBURG HIGHWAY BORDER 
				{
					mapLayerId: "mecklenburg-highway-border",
					layerId: "mecklenburgHighways",
					layerType: "line",
					paint: {
						default: {
				      'line-color': 'rgba(150,150,150,1)',
				      'line-width': isMobile.any() ? 3 : 5.5,
				      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				}
			]
		},

		// THE TRIANGLE HEXAGONS
		{		
			filepath: `${dataPath}/triangleHexagons.json`,
			sourceId: "triangleHexagons",
			dataType: "topojson",
			colorData: {
				hexagons: {
					colorField: "count",
					colorScale: primaryColorScale,
					colorBreaks: zoomedHexagonBreaks
				}
			},	
			layers: [
				// THE TRIANGLE HEXAGON FILL
				{
					mapLayerId: "the-triangle-hexagon-fill",
					layerId: "hexagons",
					layerType: "fill",
					paint: {
						default: {
							'fill-color': ['get', 'color'],
							'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0],
							"fill-opacity-transition": {"duration": 300,"delay": 0}
						}
					}
				},
				// THE TRIANGLE HEXAGON LINE
				{
					mapLayerId: "the-triangle-hexagon-line",
					layerId: "hexagons",
					layerType: "line",
					paint: {
						default: {
							'line-color': "#aaaaaa", //'#D7D0D4',
							"line-opacity": isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.3,12,0.3,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.3,12,0.3,14,0],
							'line-width': 0.1
						}
					}
				}
			]
		},

		// THE TRIANGLE GRID
		{		
			filepath: `${dataPath}/triangleGrid.json`,
			sourceId: "triangleGrid",
			dataType: "topojson",
			colorData: {
				hexagons: {
					colorField: "count",
					colorScale: primaryColorScale,
					colorBreaks: hexagonBreaks
				}
			},	
			layers: [
				// THE TRIANGLE GRID FILL
				{
					mapLayerId: "the-triangle-grid-fill",
					layerId: "hexagons",
					layerType: "fill",
					paint: {
						default: {
				    	'fill-color': "#ffffff",
							'fill-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,0.7,12,0.3,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,0.7,12,0.3,14,0],
							"fill-opacity-transition": {"duration": 300,"delay": 0}
						}
					}
				},
				// THE TRIANGLE GRID LINE
				{
					mapLayerId: "the-triangle-grid-line",
					layerId: "hexagons",
					layerType: "line",
					paint: {
						default: {
							'line-color': 'rgba(230,230,230,1)',
							'line-width': 0.5,
							'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				}
			]
		},

		// THE TRIANGLE OUTLINE
		{		
			filepath: `${dataPath}/triangle.json`,
			sourceId: "triangle",
			dataType: "topojson",
			layers: [
				// THE TRIANGLE OUTLINE
				{
					mapLayerId: "the-triangle-outline",
					layerId: "triangle",
					layerType: "line",
					paint: {
						default: {
							'line-color': 'rgba(150,150,150,1)',
							'line-width': 2,
							'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				}
			]
		},

		// THE TRIANGLE HIGHWAYS
		{		
			filepath: `${dataPath}/triangleHighways.json`,
			sourceId: "triangleHighways",
			dataType: "topojson",
			layers: [
				// THE TRIANGLE HIGHWAY 
				{
					mapLayerId: "the-triangle-highway",
					layerId: "triangleHighways",
					layerType: "line",
					paint: {
						default: {
				      'line-color': "white",
				      'line-width': isMobile.any() ? 2 : 4.5,
				      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				},
				// THE TRIANGLE HIGHWAY BORDER 
				{
					mapLayerId: "the-triangle-highway-border",
					layerId: "triangleHighways",
					layerType: "line",
					paint: {
						default: {
				      'line-color': 'rgba(150,150,150,1)',
				      'line-width': isMobile.any() ? 3 : 5.5,
				      'line-opacity': isMobile.any() ? ["interpolate",["linear"],["zoom"],7,0,8,1,12,1,14,0] : ["interpolate",["linear"],["zoom"],8,0,9,1,12,1,14,0]
						}
					}
				}
			]
		},

		// HOMES
		{		
			filepath: `${dataPath}/homes.json`,
			sourceId: "homes",
			dataType: "topojson",
			promoteId: "address",
			colorData: {
				homes: {
					colorField: "investor",
					colorDict: investorColors,
					defaultColor: "#d5cc80"
				}
			},
			layers: [
				// HOME FILL
				{
					mapLayerId: "home-fill",
					layerId: "homes",
					layerType: "fill",
					tooltip: {
						hover: true,
						select: true
					},
					paint: {
						default: {
						  "fill-opacity-transition": {"duration": 300,"delay": 0},
						  'fill-color': ['get', 'color'],
							'fill-opacity': [
								'case',
								['boolean', ['feature-state', 'hovered'], false],
								1,
								[
									'case',
									['boolean', ['feature-state', 'selected'], false],
									1,
									0.7
								]
							],
							'fill-outline-color': [
								'case',
								['boolean', ['feature-state', 'hovered'], false],
								"rgb(0,0,0)",
								[
									'case',
									['boolean', ['feature-state', 'selected'], false],
									"rgb(0,0,0)",
									"rgba(0,0,0,0)"
								]
							]
						}
					}
				}
			]
		},

		// NEIGHBORHOOD IMAGE
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
		
		// RASTER TILES
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
	]


	// TOOLTIPS SECTION

	function getHomesTooltipHTML(obj) {
    const addressFound = `
      <div class="tooltip-title-container">
        <h3 class="tooltip-table-title">
          ${obj.feature.properties.address}
        </h3>
      </div>
    `
    const addressNotFound = `
    <div class="tooltip-title-container">
      <h3 class="tooltip-table-title">
        <span style='font-weight: 200; color: gray; font-size: 16px;'>Address not Provided</span>
      </h3>
    </div>
    `
    const htmlDataPresent = `
      <div class="tooltip-table-container">
          <table class="tooltip-table">
              <thead style="background-color: white;">
                  <tr style="border-bottom: none; vertical-align: bottom; margin-bottom: 15px;">
                      <th style="text-align: center;" class=""></th>
                      <th style="text-align: center;" class=""></th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td class="tooltip-text-column-short">
                        <p class="tooltip-cell tooltip-category">
                          Parent company
                        </p>
                      </td>
                      <td class="tooltip-number-column">
                        <p class="tooltip-cell" style="background-color: ${obj.feature.properties.color}; font-weight: bold; color: white;}">
                          ${obj.feature.properties.investor}
                        </p>
                      </td>
                  </tr> 
              </tbody>
          </table>
      </div>
    `
    const htmlInsufficientData = `
      <div>
        <h4 class="tooltip-table-subtitle" style="padding-top: 10px; font-size: 12px; color: #404040;">Insufficient data for residence</h4>
      </div>
    `
    const tooltipHTML = `
      ${obj.feature.properties.address !== "" ? addressFound : addressNotFound}
      ${obj.feature.properties.investor ? htmlDataPresent : htmlInsufficientData}
    `
    return tooltipHTML
  }


	const mapTooltips = {
		"home-fill": getHomesTooltipHTML
	}
</script>

<MapScroller
	{scrollY}
	{mapId}
	{mapSectionData}

	{mapStyleUrl}
	{mapIcons}
	{mapBounds}
	{mapAttribution}
	{mapLegends}
	{mapLayerOrder}
	{mapSources}
	{mapTooltips}
	{imagePath}
/>


<style>
  :global(.maplibregl-popup-content) {
    padding: 5px 10px !important;
    width: 270px;
    filter: drop-shadow(rgba(0, 0, 0, 0.3) 0 2px 10px);
    z-index: 1000000 !important;
  }

  :global(.tooltip-title-container) {
    max-width: 100%;
    margin: auto;
    border-bottom: 2px solid #EEEEEE;
  }

  :global(.tooltip-table-title) {
    max-width: 100%;
    text-align: left;
    margin-bottom: 0px;
    margin-right: auto;
    margin-left: auto;
    color: #121212;
    font-size: 16px;
    line-height: 23px;
    padding-bottom: 2px;
    font-weight: 700;
    font-family: var(--serif);
    margin-top: 15px;
    text-transform: none;
    text-align: center;
  }

  :global(.tooltip-table-subtitle) {
    max-width: 100%;
    text-align: left;
    margin-bottom: 8px;
    margin-top: 0;
    margin-right: auto;
    margin-left: auto;
    color: #121212;
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 2px;
    font-weight: 200;
    font-family: var(--sans);
    text-transform: none;
    text-align: center;
  }

  :global(.tooltip-table-container) {
    font-family: var(--sans);
    padding: 5px;
    overflow: auto;
    padding-top: 0px;
    padding-bottom: 10px;
  }

  :global(.tooltip-table) {
    width: 100%;
    border-collapse: collapse;
  }

  :global(.tooltip-table thead th) {
    position: sticky;
    top: 0;
    font-size: 10px;
    font-weight: 200;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: #333;
    text-align: center;
    line-height: 1.2;
  } 

  :global(.tooltip-table tr) {
    margin: 0px auto 0px 0;
    border-spacing: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    display: table-row;
    text-indent: initial;
    font-size: 10px;
    font-weight: 200;
    text-size-adjust: 100%;
    border-bottom: 1px solid #EEEEEE;
  }

  :global(.tooltip-index-column) {
    width: 5%;
    font-size: 11px;
    font-weight: 200;
    color: #999;
    text-align: center;
    /*padding: 10px 9px 5px 0px;*/
  }

  :global(.tooltip-text-column-long) {
    width: 20%;
    font-size: 12px;
    color: #333;
    text-align: left;
    /*padding-right: 10px;*/
    padding: 10px 0px 0px 0px;
  }


  :global(.tooltip-text-column-short) {
    width: 10%;
    font-size: 12px;
    color: #333;
    text-align: center;
    vertical-align: middle;
  }

  :global(.tooltip-number-column) {
    width: 50%;
    padding-left: 10px !important;
    height: 100%;
    font-size: 12px;
    color: #333;
    padding-bottom: 5px;
    padding-top: 5px;
    text-align: center;
  }

  :global(.tooltip-number-column p) {
    margin: 0 !important;
    padding: 4px;
  }

  :global(.owner p) {
    font-size: 10px;
    text-align: center;
  }

  :global(.tooltip-cell) {
    margin: 0;
  }

  :global(.tooltip-category) {
    line-height: 1.2;
    font-family: var(--serif);
    color: var(--gray);
  }

	@media (max-width: 600px) {
  	:global(.tooltip-table-title) {
	    margin-top: 10px;
	    font-size: 16px;
	    line-height: 20px;
	  }
	    :global(.tooltip-table-subtitle) {
	    font-size: 12px;
	    line-height: 16px;
	  }
	    :global(.tooltip-table-container) {
	    padding-right: 5px;
	    padding-left: 5px;
	  }
	    :global(.tooltip-table thead th) {
	      font-size: 10px;
	  }
	    :global(.tooltip-table tr) {
	      font-size: 12px;
	  }
	  :global(.tooltip-number-column) {
	    font-size: 11px;
	}
	  :global(.tooltip-text-column-long) {
	  font-size: 13px;
	}
	  :global(.tooltip-text-column-short) {
	  font-size: 13px;
	}
	  :global(.tooltip-index-column) {
	  font-size: 10px;
	  }
	}
</style>