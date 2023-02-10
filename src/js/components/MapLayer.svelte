<script>
	import { getContext, setContext, createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';

	const dispatch = createEventDispatcher();
	
	export let id;
	export let mapId = 'map';
	export let type;
	export let filter = null;
	export let layout = {};
	export let paint = {};
	export let data = null;
	export let colorKey = "color";
	export let nameKey = null;
	export let valueKey = null;
	export let idKey = null;
	export let select = false;
	export let clickIgnore = false;
	export let clickCenter = false;
	export let selected = null;
	export let hover = false;
	export let hovered = null;
	export let hoverableIds = [];
	export let highlight = false;
	export let highlightKey = 'highlighted';
	export let highlighted = [];
	export let order = null;
	export let maxzoom = null;
	export let minzoom = null;
	export let sourceLayer = null;
	export let drawn = false;
	export let opacity = null;
	export let opacityKey = null;

	let currentHoverableIds = hoverableIds;
	const { source, layer, promoteId } = getContext('source');
	const { getMap } = getContext(mapId);
	const map = getMap();


	setContext("layer", {
		layer: id
	});

	const selectedObj = writable({
		id: null,
		feature: null,
		event: null
	});
	setContext("select", selectedObj);

	const hoveredObj = writable({
		id: null,
		feature: null,
		event: null
	});
	setContext("hover", hoveredObj);

	idKey = idKey ? idKey : promoteId;
	sourceLayer = sourceLayer ? sourceLayer : layer;
	
	let selectedPrev = null;
	let hoveredPrev = null;
	let highlightedPrev = [];
	
	if (map.getLayer(id)) {
    map.removeLayer(id);
	}
	
	let options = {
		'id': id,
		'type': type,
		'source': source,
		'paint': paint,
		'layout': layout
	};
	$: if (paint) {
		options['paint'] = paint
		for (const [key, value] of Object.entries(paint)) {
			map.setPaintProperty(id, key, value)
		}
	}
	$: if (layout) {
		options['layout'] = layout
		for (const [key, value] of Object.entries(layout)) {
			map.setLayoutProperty(id, key, value)
		}
	}

	if (filter) {
		options['filter'] = filter;
	}
	
	if (sourceLayer) {
		options['source-layer'] = sourceLayer;
	}
	if (maxzoom) {
		options['maxzoom'] = maxzoom;
	}
	if (minzoom) {
		options['minzoom'] = minzoom;
	}
	
	const layers = map.getStyle().layers;
		// Find the index of the first symbol layer in the map style.
	let firstSymbolId;
	for (const layer of layers) {
		if (layer.type === 'symbol') {
			firstSymbolId = layer.id;
			break;
		}
	}

	map.addLayer(options, order);
	drawn = true;

	// Updates "color" feature states for all geo codes
	// Assumes that each data point has the colours defined on the colorCode key
	function updateColors() {
		data.forEach(d => {
			map.setFeatureState({
				source: source,
				sourceLayer: sourceLayer,
				id: d[idKey]
			}, {
				color: colorKey ? d[colorKey] : null,
				name: nameKey ? d[nameKey] : null,
				value: valueKey ? d[valueKey] : null
			});
		});
	}

	$: data && (data || colorKey) && updateColors();


	$: if(opacity !== null && opacityKey) {
		if (highlight) {
			map.setPaintProperty(id, opacityKey, ['case', ['==', ['feature-state', highlightKey], true], opacity, 0])
		} else {
			map.setPaintProperty(id, opacityKey, opacity)
		}
	} 
	
	// Updates the "highlighted" feature state as geo codes are added to/removed from the highlighted array
	$: if (highlight && highlighted !== highlightedPrev) {
		if (highlightedPrev.length) {
			highlightedPrev.forEach(id => {
				let state = {};
				state[highlightKey] = false;
				map.setFeatureState(
					{ source, sourceLayer, id },
					state
				);
			});
		}
		highlightedPrev = highlighted;
		if (highlighted.length) {
			highlighted.forEach(id => {
				let state = {};
				state[highlightKey] = true;
				map.setFeatureState(
					{ source, sourceLayer, id },
					state
				);
			});
		}
	}
	
	// Adds a click event to change the selected geo code (if select = true for map layer)
	if (select) {
		map.on('click', id, (e) => {
      if (e.features.length > 0 && !clickIgnore) {
				let feature = e.features[0];
				selected = feature.id;

				selectedObj.set({
					id: selected,
					feature: feature,
					event: e
				});
				dispatch('select', $selectedObj);
				
				if (selectedPrev) {
					selectedObj.set({
						id: selected,
						feature: feature,
						event: e
					});
					dispatch('select', $selectedObj);
					map.setFeatureState(
            { source: source, sourceLayer: sourceLayer, id: selectedPrev },
            { selected: false }
          );
				}

				map.setFeatureState(
          { source: source, sourceLayer: sourceLayer, id: selected },
          { selected: true }
				);

				if (clickCenter) {
					let center = centroid(e.features[0].toJSON().geometry);
					map.flyTo({
						center: center.geometry.coordinates
					});
				}
				
				selectedPrev = selected;
			} else {
				selectedObj.set({
						id: null,
						feature: null,
						event: e
					});
				dispatch('select', $selectedObj);
			}
    });
	}
	
	// Updates the selected geo code if it is changed elsewhere in the app (outside of this component)
	$: if (select && selected != selectedPrev) {
		if (selectedPrev) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: selectedPrev },
				{ selected: false }
			);
		}
		if (selected) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: selected },
				{ selected: true }
			);
		}
		selectedPrev = selected;
	}
	
	// Adds an event to update the hovered geo code when the mouse is moved over the map
	if (hover || select) {
		map.on('mousemove', id, (e) => {
      if (e.features.length > 0) {
				if (hovered && (hoverableIds.includes(hovered) || !hoverableIds.length)) {
          map.setFeatureState(
            { source: source, sourceLayer: sourceLayer, id: hovered },
            { hovered: false }
          );
        }
				let feature = e.features[0];
				hovered = hoveredPrev = feature.id;

				if (hovered && (hoverableIds.includes(hovered) || !hoverableIds.length)) {
					hoveredObj.set({
						id: hovered,
						feature: feature,
						event: e
					});

					dispatch('hover', $hoveredObj);

	        map.setFeatureState(
	          { source: source, sourceLayer: sourceLayer, id: hovered },
	          { hovered: true }
	        );

	        // Change the cursor style as a UI indicator.
					map.getCanvas().style.cursor = 'pointer';
				} else {
					hovered = hoveredPrev = null;

						hoveredObj.set({
							id: null,
							feature: null,
							event: e
						});

						dispatch('hover', $hoveredObj);
						
						// Reset cursor and remove popup
						map.getCanvas().style.cursor = '';

				}
      }
		});
		
		map.on('mouseleave', id, (e) => {
			if (hovered && (hoverableIds.includes(hovered) || !hoverableIds.length)) {
        map.setFeatureState(
          { source: source, sourceLayer: sourceLayer, id: hovered },
          { hovered: false }
				);
      }
			hovered = hoveredPrev = null;

			hoveredObj.set({
				id: null,
				feature: null,
				event: e
			});

			dispatch('hover', $hoveredObj);
			
			// Reset cursor and remove popup
			map.getCanvas().style.cursor = '';
    });
	}
	
	// Updates the hovered geo code if it is changed elsewhere in the app (outside of this component)
	$: if (hover && hovered != hoveredPrev) {
		if (hoveredPrev) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: hoveredPrev },
        { hovered: false }
			);
		}
		if (hovered) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: hovered },
        { hovered: true }
			);
		}
		hoveredPrev = hovered;
	}

	// Remove the hovered state for something that is no longer in the hoverableIds array
	// Also remove the popup
	$: if (hoverableIds.length !== currentHoverableIds.length) {
		currentHoverableIds = hoverableIds;
		if (hoverableIds.length && !hoverableIds.includes(hovered)) {
			map.setFeatureState(
				{ source: source, sourceLayer: sourceLayer, id: hovered },
        { hovered: false }
			);
			hovered = hoveredPrev = null;

			hoveredObj.set({
				id: null,
				feature: null,
				event: null
			});

			dispatch('hover', $hoveredObj);
			
			// Reset cursor and remove popup
			map.getCanvas().style.cursor = '';
		}
	}
	
</script>

{#if hover}
	<slot {hovered}></slot>
{:else if select}
	<slot {selected}></slot>
{/if}