<script>
  import maplibre from 'maplibre-gl';

	export let map;
	export let maxWidth = 160;
	export let unit = "imperial";
	export let position = "bottom-right"

	const scale = new maplibre.ScaleControl({
		maxWidth,
		unit
	});
	map.addControl(scale, position);

</script>