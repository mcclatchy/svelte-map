<script>
  import { inview } from 'svelte-inview';
  import { onMount } from 'svelte';

  import Map from './Map.svelte';
  import MapLayerOrder from './MapLayerOrder.svelte';
  import MapLegendSwatches from './MapLegendSwatches.svelte';
  import MapLegendCategorical from './MapLegendCategorical.svelte';
  import MapLegendText from './MapLegendText.svelte';
  import MapScaleBar from './MapScaleBar.svelte';
  import MapSection from './MapSection.svelte';
  import MapSource from './MapSource.svelte';
  import Scroller from "./Scroller.svelte";
  import { windowWidth, windowHeight, activeSectionId, activeMapBoundsId, isPortrait } from '../modules/store.js';
  import { isTablet, isMobile } from "../modules/utils.js";
  import { getMapDataDict, setupIcon } from "../modules/map.js";

  // Variables passed in from the specific map configuration
  export let imagePath;
  export let scrollY;
  export let mapId;
  export let mapStyleUrl;
  export let mapSectionData;
  export let mapIcons;
  export let mapSources;
  export let mapAttribution;
  export let mapBounds;
  export let mapLegends;
  export let mapLayerOrder;
  export let mapTooltips;

  let map = null;
  let mapLoaded = false;
  let mapDataDict = {};
  let mapDataLoaded = false;
  let progress = 0;
  let pointerEvents = "none";
  let sections;
  let hovered;
  let selected;

  // Using svelte-inview functionality to lazy load the map
  // offset - defines how many pixels ahead of time to start loading the map
  let isInView;
  const offset = 5000;
  const handleChange = ({ detail }) => (isInView = detail.inView);
  const options = { rootMargin: `${offset}px`, unobserveOnEnter: true };

  // Since svelte-inview seemed a little finnicky, this is a backup lazy loader
  // If shouldLoad or isInView becomes true, start loading the map
  let triggerPixel;
  let shouldLoad = false;
  onMount(() => { if (map) { triggerPixel = map.offsetTop - offset }})

  $: topPadding = $isPortrait && isMobile.any() ? 30 : 50;
  $: sidePadding = $isPortrait && isMobile.any() ? 5 : 20;
  $: mapPadding = {top: topPadding, bottom: 0, left: sidePadding, right: sidePadding}

  // Update sections along with changes in $windowWidth
  // sections variable defines bounds and other changeable items based on device/screen size
  $: sections = $windowWidth && mapBounds && mapSectionData && mapSectionData.sections.map((section) => {
    return {
      text: section.text,
      id: section?.id,
      tooltip: section?.tooltip,
      boundsId: section?.bounds,
      bounds: mapBounds[section.bounds],
      horizontalPosition: section.horizontalPosition,
      speed: section?.speed,
      image: section?.image,
      pitch: section?.pitch || 0,
      bearing: section?.bearing || 0,
      padding: mapPadding
    }
  });

  // This is the backup lazy loader to tell the map to load
  $: if (scrollY > triggerPixel) {
    shouldLoad = true;
  }

  // If map object is present, load icons
  $: if (map) {
    for (const icon of mapIcons) {
      setupIcon(map, icon.filepath, icon.imageName, icon?.width, icon?.height)
    }
  }

  // If mapSources object is present load external JSON files
  // Also, configure metadata for use in MapSource and MapLayer components
  $: if(mapSources) {
    // Syntax for async function inside reactive statement
    (async() => mapDataDict = await getMapDataDict(mapSources))();
    mapDataLoaded = true;
  }

  $: isTooltipSection = sections.filter(section => section.id === $activeSectionId)[0].tooltip
  $: isInteractiveSection = sections.filter(section => section.id === $activeSectionId)[0].interactive
</script>

<!-- WARNING: this is only for debugging - don't deploy this actively -->
<!-- <p class="debug" style={`display: ${import.meta.env.PROD ? 'none' : 'block'};`}>
  <br />
  {Math.round(progress * 1000) / 1000}
</p> -->

<div id={`${mapId}-scroller`}>
  <Scroller bind:progress>
    <!-- TEXT SLATES -->
    <div slot="foreground" style={`pointer-events: ${isTooltipSection || isInteractiveSection ? 'none' : 'unset'}`}>
      <!-- Spacer for text -->
      <div class="text-spacer" style={`height: ${$windowHeight}px;`}/>
      {#if sections}
        {#each sections as section}
            <!-- Add MapSection components that have styling for the text.
            That text can be changed in the MapSection.svelte file. Opportunity
            here to add styling attributes perhaps? Or relying more on the SDS?
             -->
            <MapSection
              {section}
              {imagePath}
              map={map}
            />
        {/each}
      {/if}
      <!-- Spacer for text -->
      <!-- <div class="text-spacer" style={`height: ${0.25 * $windowHeight}px;`}/> -->
    </div>

    <!-- MAP ELEMENTS -->
    <div slot="background"
      style={`
        width: 100%;
        height: ${isTablet.ipad() ? $windowHeight - 50 : $windowHeight}px;
        pointer-events: ${isTooltipSection || isInteractiveSection ? 'all' : 'none'}`
      }>
      <div class="map" use:inview={options} on:change={handleChange}>
        {#if mapDataLoaded && (isInView || shouldLoad)}
          <!-- Load the Map component w/ correct bounds and attribution -->
          <Map
            id={mapId}
            style={mapStyleUrl}
            location={{bounds: mapBounds[$activeMapBoundsId]}}
            interactive={isInteractiveSection || false}
            controls={false}
            attributionPlacement={mapAttribution?.placement}
            attributionText={mapAttribution?.text}
            padding={mapPadding}
            bind:map={map}
            bind:loaded={mapLoaded}
          >

            <!-- Add a scale bar for distances -->
<!--             <MapScaleBar
              {map}
            /> -->

            <!-- This is one way to add legends that change based on section
            I have predefined MapLegendSwatches and MapLegendCategorical
            but those can easily change, or more options can be added -->
            {#each mapLegends as legend}
              {#if legend.type === "swatches"}
               <MapLegendSwatches
                  legendTitle={legend?.title}
                  palette={legend?.palette}
                  splits={legend?.splits}
                  annotations={legend?.annotations}
                  position={legend?.position}
                  opacity={legend?.sections.includes($activeSectionId) ? 1 : 0}
                  legendWidth={legend?.width}
                />
              {/if}

              {#if legend.type === "categorical"}
                <MapLegendCategorical
                  legendTitle={legend?.title}
                  palette={legend?.palette}
                  splits={legend?.splits}
                  annotations={legend?.annotations}
                  opacity={legend?.sections.includes($activeSectionId) ? 1 : 0}
                  legendWidth={legend?.width}
                />
              {/if}

              {#if legend.type === "text"}
                <MapLegendText
                  legendTitle={legend?.title}
                  legendSubtitle={legend?.subtitle}
                  opacity={legend?.sections.includes($activeSectionId) ? 1 : 0}
                  legendWidth={legend?.width}
                />
              {/if}
            {/each}

            <!-- This is where all map data sources and map layers get added to the map -->
            {#each Object.keys(mapDataDict) as key}
              <MapSource
                {mapId}
                id={key}
                type={mapDataDict[key].type}
                data={mapDataDict[key]?.data}
                promoteId={mapDataDict[key]?.promoteId}
                url={mapDataDict[key]?.url}
                coordinates={mapDataDict[key]?.coordinates}
                tilesize={mapDataDict[key]?.tileSize}
                maxzoom={mapDataDict[key]?.maxZoom || null}
                minzoom={mapDataDict[key]?.minZoom || null}
              >
                {#each mapDataDict[key].layers as layer}
                  <MapLayerOrder
                    {mapId} 
                    {mapLayerOrder}
                    tooltip={layer?.tooltip}
                    {hovered}
                    {selected}
                    layerType={layer.layerType}
                    paintStyles={layer?.paint}
                    layoutStyles={layer?.layout || {}}
                    id={layer.mapLayerId}
                    {mapTooltips}
                  />
                {/each}
              </MapSource>
            {/each}
          </Map>
        {/if}
      </div>
    </div>
  </Scroller>
</div>  

<style>
  .debug {
    margin: 0 !important;
    text-align: right;
    position: fixed;
    top: 0;
    right: 0;
    font-size: 30px;
    padding-right: 20px;
    color: black;
    background-color: white;
    z-index: 1000000;
  }
  .text-spacer {
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }
</style>
