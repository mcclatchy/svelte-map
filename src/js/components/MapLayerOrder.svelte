<script>
  import { layersDrawn, activeSectionId } from '../modules/store.js';
  import MapLayer from './MapLayer.svelte';
  import MapTooltip from './MapTooltip.svelte';

  export let id = null;
  export let layerType = null;
  export let mapLayerOrder = [];
  export let mapId = "map";
  export let drawn = false;
  export let highlighted = null;
  export let hovered = null;
  export let hoverableIds = [];
  export let selected = null;
  export let tooltip = false;
  export let filter = null;
  export let paintStyles = {};
  export let layoutStyles = {};
  export let maxZoom = null;
  export let minZoom = null;
  export let mapTooltips = {};

  let select = tooltip?.select
  let hover = tooltip?.hover

  let paintStyle = {};
  $: if (paintStyles.hasOwnProperty($activeSectionId)) {
    paintStyle = paintStyles[$activeSectionId]
  } else {
    paintStyle = paintStyles.default
  }

  let layoutStyle = {};
  $: if (layoutStyles.hasOwnProperty($activeSectionId)) {
    layoutStyle = layoutStyles[$activeSectionId]
  } else {
    layoutStyle = layoutStyles.default
  }
  
  let added = false;
  $: if (drawn && !added) {
    $layersDrawn = [...$layersDrawn, id];
    added = true;
  }

  function getLayerAbove(layer, layerOrder) {
    const layerIndex = layerOrder.indexOf(layer)
    if (layerIndex <= 0) {
      return null;
    }
    return layerOrder[layerIndex - 1];
  }

  let drawBelow = getLayerAbove(id, mapLayerOrder);
</script>

{#if $layersDrawn.includes(drawBelow) || !drawBelow && layerType}
   <MapLayer
    mapId={mapId}
    id={id}
    order={drawBelow}
    type={layerType}
    bind:drawn={drawn}
    select={select}
    filter={filter}
    hover={hover}
    hovered={hovered}
    bind:selected={selected}
    hoverableIds={hoverableIds}
    paint={paintStyle}
    layout={layoutStyle}
    highlight={highlighted !== null}
    highlighted={highlighted}
    minzoom={maxZoom}
    maxzoom={minZoom}
  >
    {#if tooltip}
      <MapTooltip
        {mapTooltips}
        mapId={mapId}
        layerId={id}
        content={selected}
        select={select}
        hover={hover}
        bind:selected={selected}
      />
    {/if}
  </MapLayer>
{/if}