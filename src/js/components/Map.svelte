<script>
	import { onMount, setContext } from "svelte";
  import maplibre from 'maplibre-gl';

 	import { windowWidth, windowHeight } from '../modules/store.js';
  import { execResizeCallbackWithSuspend } from "../modules/utils.js";
  import throttle from 'underscore/modules/throttle';

	export let map;
	export let id = "map";
	export let location = {
		lng: 15,
		lat: 45,
		zoom: 1
	};
	export let style = {
		"version": 8,
		"sources": {},
		"layers": []
	};
	export let minzoom = 0;
	export let maxzoom = 24;
	export let controls = false;
	export let locate = false;
	export let tabbable = false;

	export let zoom = null;
	export let center = null;
	export let interactive = true;
	export let attributionPlacement = null;
	export let attributionText = null;
	export let loaded = false;
	export let resize = false;
	export let padding = {};

	let container;
	let w;
	let h;
	let options;

	setContext(id, {
		getMap: () => map,
	});
	
	// Interpret location
	if (location.bounds) {
		options = { bounds: location.bounds};
	} else if (typeof location.lng == 'number' && typeof location.lat == 'number') {
		options = {
			center: [location.lng, location.lat],
		};
		if (typeof location.zoom == 'number') {
			options.zoom = location.zoom;
		}
	}

	onMount(() => {
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = "https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css";

		link.onload = () => {
			map = new maplibre.Map({
				container,
				style,
				minZoom: minzoom,
				maxZoom: maxzoom,
				interactive,
				attributionControl: attributionPlacement ? false : true,
				...options,
			});

			if (location.bounds) {
				map.fitBounds(location.bounds, {animate: false, padding});
			}
			
			if (controls) {
				map.addControl(new maplibre.NavigationControl({showCompass: false}));
			}
			
			if (locate) {
				map.addControl(new maplibre.GeolocateControl());
			}

			if (attributionPlacement) {
				if (attributionText) {
					map.addControl(new maplibre.AttributionControl({customAttribution: attributionText}), attributionPlacement);			
				} else {
					map.addControl(new maplibre.AttributionControl(), attributionPlacement);
				}
			}
			
			// Get initial zoom level
			map.on("load", () => {
				zoom = map.getZoom();
				center = map.getCenter();
				loaded = true;
				
				// Prevent map from being tabbable
				if (!tabbable && document.querySelector(`#${id} canvas`)) {
					document.querySelector(`#${id} canvas`).tabIndex = "-1";
				}
			});

			// Update zoom level and center when the view changes
			map.on("moveend", () => {
				zoom = map.getZoom();
				center = map.getCenter();
			});
		};

		document.head.appendChild(link);

		return () => {
			map.remove();
			link.parentNode.removeChild(link);
		};
	});

	// Function that forces map to resize to fit parent div, in case it doesn't automatically
	async function resizeCanvas() {
		if (loaded) {
			// TODO: get specific map
			let canvas = document.getElementsByClassName("maplibregl-canvas");
		  if (canvas[0]) {
			  canvas[0].style.width = "100%";
			  canvas[0].style.height = "100%";
			  if (location?.bounds) {
			  	await map.fitBounds(location.bounds, {animate: false, padding});
			  	await map.resize();
			  } else {
			  	await map.resize();
			  }
		  }
		}
	}

	if (resize) {
	  const resizeObserver = new ResizeObserver(entries => {
	    const elements = entries.map(entry => entry.target);
	    throttle(execResizeCallbackWithSuspend(elements, resizeObserver, () => {
	      resizeCanvas()
	    }), 500);
	  })

	  resizeObserver.observe(document.body);		
	}


	// Invoke above function when parent div size changes
	$: (w || h || $windowWidth || $windowHeight) && resize && resizeCanvas();
</script>

<div bind:clientWidth={w} bind:clientHeight={h} bind:this={container} {id}>
	{#if loaded}
		<slot />
	{/if}
</div>

<style>
	:global(.maplibregl-control-container button) {
		margin: 0;
	}
	div {
		width: 100%;
		height: 100%;
	}
</style>