<script>
	import { getContext, setContext } from 'svelte';
	
	export let id;
	export let type;
	export let mapId = "map";
	export let url = null;
	export let props = {};
	export let data = null;
	export let coordinates = null;
	export let layer = null;
	export let promoteId = null;
	export let minzoom = null;
	export let maxzoom = null;
	export let tilesize = null;
	
	export let loaded = false;

	const { getMap } = getContext(mapId);
	const map = getMap();
	
	// internally represented as a geojson
	if (type === "topojson") {
		type = "geojson"
	}

	setContext("source", {
		source: id,
		layer: layer,
		promoteId: promoteId
	});
	
	if (map.getSource(id)) {
    map.removeSource(id);
	}

	function isSourceLoaded(){
    if (map.isSourceLoaded(id)) {
			loaded = true;
			// console.log(id + ' map source loaded!');
    } else {
			setTimeout(() => {
				isSourceLoaded();
			}, 250);
		}
	}
	
	// Set optional source properties
	if (minzoom) {
    props.minzoom = minzoom;
	}
	if (maxzoom) {
    props.maxzoom = maxzoom;
	}
	if (layer && promoteId) {
		props.promoteId = {};
		props.promoteId[layer] = promoteId;
	} else if (promoteId) {
		props.promoteId = promoteId;
	}
	
	function addSource() {
		// console.log(id + ' map source loading...');
		let layerdef;
		
  	if (type == "geojson") {
	  	if (data) {
		  	layerdef = {
	  		  type: type,
	  		  data: data,
					...props
				};
  		} else if (url) {
	  		layerdef = {
	  		  type: type,
	  		  data: url,
					...props
				};
		  }
	  } else if (type == "vector") {
	  	layerdef = {
	  		type: type,
	  		tiles: [ url ],
	  		...props
			};
		} else if (type == "raster") {
	  	layerdef = {
	  		type: type,
	  		tiles: [ url ],
				tileSize: tilesize,
	  		...props
			};
		} else if (type == "image") {
	  	layerdef = {
	  		type: type,
	  		url: url,
				coordinates: coordinates,
	  		...props
			};
		} else if (type == "heatmap") {
	  	layerdef = {
	  		type: type,
	  		...props
			};
		} else if (type == "background") {
			loaded = true;
		}
		if (layerdef) {
			map.addSource(id, layerdef);
			isSourceLoaded();
		}
	};

	addSource();

	function setData() {
		map.getSource(id).setData(data);
	}

	$: loaded && data && setData();
</script>

{#if loaded}
	<slot></slot>
{/if}