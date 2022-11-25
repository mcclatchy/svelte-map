<script>
	// External Packages
	import { onMount } from 'svelte';
  import throttle from 'underscore/modules/throttle';

  // Internal Files
	import { isMobile, isTablet, addDataToVideoElement, getArrayItemById } from "../modules/utils.js";
	import { windowWidth, windowHeight, domain, activeSectionId, activeMapBoundsId } from '../modules/store.js';
	import Fonts from './Fonts.svelte';
	import MapExample from './MapExample.svelte';

	const projectName = "svelte-map-example"
	const baseUrl = `https://www.${$domain}.com/static/hi/2022/${projectName}`
	const dataPath = import.meta.env.PROD ? `${baseUrl}/data` : "../../src/data"
	const imagePath = import.meta.env.PROD ? `${baseUrl}/images` : "../../src/images"
	const videoPath = import.meta.env.PROD ? `${baseUrl}/videos` : "../../src/videos"
	const amlURL = `${dataPath}/aml-story.json`

	let scrollY = 0;
	let innerHeight = window.innerHeight;
	let innerWidth = window.innerWidth;
	let outerHeight = window.outerHeight;
	let mapContainer;

	$: windowHeight.set(isMobile.ios() || isTablet.ipad() ? outerHeight : innerHeight);
	$: windowWidth.set(innerWidth);
	$: domain.set(window.pageInfo["marketInfo.domain"]);

	if (history.scrollRestoration) {
	  history.scrollRestoration = 'manual';
	}

	$: mapContainer && mapContainer.closest(".embed-infographic")?.classList.add("full-bleed")

  async function initPage() {
    let url = amlURL;
    return await fetch(url)
      .then(response => response.json())
      .then(result => {
        const content = result?.content;
        const maps = content
          .filter(item => item.type === 'scrolling-map')
          .map(item => {
          	// initialize first section id and bounds
          	activeSectionId.set(item?.value?.sections[0].id)
        		activeMapBoundsId.set(item?.value?.sections[0].bounds)
          	return item.value
          });
        const data = { maps };
        return data;
      });
  }
</script>

<svelte:window bind:scrollY bind:innerHeight bind:outerHeight bind:innerWidth/>
<Fonts/>

{#await initPage()}
	<div class="bg-placeholder"/>
{:then data}
	<div bind:this={mapContainer}>
		<MapExample
			{imagePath}
			{dataPath}
			{scrollY}
			mapId="statewide-map"
			mapSectionData={getArrayItemById('statewide', data.maps)}
		/>
	</div>
{/await}

<style>
	:global(.fullscreen) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
