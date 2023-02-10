<script>
	import debounce from 'underscore/modules/debounce';
	import { inview } from 'svelte-inview';
	import { amlToHTML, isTablet } from '../modules/utils.js'
	import { isPortrait, windowHeight, windowWidth, activeSectionId, activeMapBoundsId } from '../modules/store.js';

	export let section;
	export let map;
	export let outerFixed = false;
	export let fixed = false;
	export let top = 0;
	export let left = 0;
	export let visibility = "visible";
	export let imagePath;

 	const bounds = section?.bounds;
	const padding = section?.padding
	const pitch = section?.pitch || 0
	const bearing = section?.bearing || 0
	const speed = section?.speed || 0.6;
	const horizontalPosition = section?.horizontalPosition || 'center';

	let boxWidth = 400;

  const options = {
    rootMargin: `0px`,
    unobserveOnEnter: false,
  };

	// Fit map to specified min/max bounds [[xmin, ymin], [xmax, ymax]]
	function fitBounds(map, bounds, speed, padding, pitch=0, bearing=0, animate=true) {
		map && map.fitBounds(bounds, { speed, animate, pitch, bearing, padding });
	}

	let isInView;
	const handleChange = ({ detail }) => {
		isInView = detail.inView
		isInView && fitBounds(map, section.bounds, speed, padding, pitch, bearing)
	};
	let textBox;
	$: textBoxHeight = textBox ? textBox.clientHeight : 0;
	$: sectionHeight = $windowHeight + textBoxHeight
	$: isInView && $isPortrait && $windowWidth && debounce(fitBounds(map, bounds, speed, padding, pitch, bearing), 500)
	$: isInView && activeSectionId.set(section.id)
	$: isInView && activeMapBoundsId.set(section.boundsId)
</script>


<div style={`
	height: ${sectionHeight}px;
	z-index: 2;
	position: ${outerFixed ? 'fixed': 'relative'};
	pointer-events: none;
`}>

{#if fixed}
	<section
		class:no-opacity={section.text === "" || section.text === "<span></span>"}
		class={horizontalPosition}
		id={section.id}
		use:inview={options}
		on:change={handleChange}
		bind:this={textBox}
	>
		<div
		style={`
			visibility: ${visibility};
			position: fixed;
			top: ${$isPortrait ? "unset" : top + "px"};
			bottom: ${$isPortrait ? "2vh" : "unset"};
			left: ${$isPortrait ? "50%" : left + "px"};
			width: ${boxWidth}px;
			max-width: ${$isPortrait ? "100%" : "50%"};
			transform:  ${$isPortrait ? "translate(-50%, 0%)" : "translate(0,0)"};
			height: fit-content;
		`}>
			<p style={`
				border: none;
				background-color: var(--bc);
				text-align: ${$isPortrait ? "center" : "left"};
			`}>
				{@html amlToHTML(section.text)}
			</p>
		</div>
	</section>
{:else}
	<section
		class:no-opacity={section.text === ""  || section.text === "<span></span>"}
		class={isTablet.any() ? "center" : horizontalPosition}
		id={section.id} use:inview={options}
		on:change={handleChange}
		bind:this={textBox}
	>
	
		<p style={`background-color: var(--bc);`}>
			{#if section?.image}
				<img src={`${imagePath}/${section.image.filename}`}/>
				<span class="caption">{@html section.image?.caption || ""}</span>
				<hr/>
			{/if}
			{@html amlToHTML(section.text)}
		</p>
	</section>
{/if}
</div>

<style>
	.no-opacity {
		opacity: 0;
	}

	section {
		margin: 0 !important;
    width: 400px;
    max-width: 100%;
	}

	section p {
		font-family: var(--serif);
		border:  1px solid #444;
    color: var(--tc);
		padding: 20px;
    pointer-events: all;
    transition: opacity 0.6s;
  	-webkit-transition: opacity 0.6s;
  	margin: var(--page-padding);
  	width: fit-content;
	}

	section p img {
		width: 100%;
		object-fit: cover;
		margin-bottom: 5px;
		height: 220px;
	}

	section p hr {
		margin-bottom: 20px;
		border: 0.5px solid #666 !important;
		margin-top: 10px;
	}

	.center {
		position: absolute;
    left: 50%;
    transform: translate(-50%, -100%);
	}

  .left {
  	position: absolute;
    left: 40px;
    transform: translate(0%, 0%);

  }

	:global(.highlighter) {
  	background-color: #4B0306;
    padding: 0px 6px;
    color: white;
    margin: 0 4px;
    font-weight: bold;
	}

	@media only screen and (max-width: 700px) {
		section p {
			max-width: 100%;
		}
		:global(.highlighter) {
			padding: 1px 3px;
			margin: 0 2px;
		}
		.left {
			left: 50%;
    	transform: translate(-50%, 0);
		}
	}
</style>