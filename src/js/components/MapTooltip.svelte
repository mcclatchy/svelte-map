<script>
  import { getContext, createEventDispatcher } from 'svelte';
  import maplibre from 'maplibre-gl';

  export let content;
  export let hoverableIds = [];
  export let mapId = "map";
  export let layerId = "layer";
  export let select = false;
  export let hover = false;
  export let selected = null;
  export let mapTooltips = {};

  const dispatch = createEventDispatcher();
  const { getMap } = getContext(mapId);
  const map = getMap();
  const selectedObj = getContext('select');
  const hoveredObj = getContext('hover');
  const tooltip = new maplibre.Popup({
		closeButton: select,
    closeOnClick: select
	});

  let popupPresent = false;
  let popupCloseButton = null;
  
  const updatePopupPresent = (e) => {
    popupCloseButton = document.querySelector(".maplibregl-popup-close-button")
    if (popupCloseButton) {
      popupPresent = true;
      popupCloseButton.addEventListener('click', () => { popupPresent = false; selected = null; }, true)
    } else {
      popupPresent = false;
      selected = null;
    }

    if (e.target.localName === "canvas" && !e.target.style?.cursor) {
      popupPresent = false;
      selected = null;
      selectedObj.set({id: null, feature: null, e: null})
      dispatch('select', $selectedObj);
    }
  }
  if (select) {
    document.getElementById(mapId).addEventListener('click', updatePopupPresent, true);
  }

  function getTooltipHTML(obj, layerId) {
    let tooltipHTML;
    if (layerId in mapTooltips) {
      tooltipHTML = mapTooltips[layerId](obj)
    } else {
      tooltipHTML = ''
    }
    return tooltipHTML;
  }

  function updateTooltip(obj, layerId, content) {
    if (obj && obj?.id && (hoverableIds.includes(obj?.id) || !hoverableIds.length)) {
      tooltip
			.setLngLat(obj.event.lngLat)
      .setHTML(getTooltipHTML(obj, layerId))
      .addTo(map);
    } else {
      tooltip.remove()
    }
  }

  $: !popupPresent && hover && updateTooltip($hoveredObj, layerId, content);
  $: updateTooltip($selectedObj, layerId, content);
</script>
