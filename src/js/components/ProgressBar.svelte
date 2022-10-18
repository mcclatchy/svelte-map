<script>
  export let progress;
  export let backgroundColor = "lightgray";
  export let highlightColor = "black"
  export let left = 0;
  export let width = 4;

  $: progressPct = progress >= 1 ? 100 : progress * 100;
  $: opacity = progress >= 1.3 ? 0 : 1;
</script>

<div style={`opacity: ${opacity};`}>
  <div class="background-bar" style={`
    top: 0;
    left: ${left};
    background-color: ${backgroundColor};
    width: ${width}px;
  `}>
  </div>
  <div class="progress-bar" style={`
    top: 0;
    left: ${left};
    height: ${progressPct}%;
    background-color: ${highlightColor};
    width: ${width}px;
  `}>
  </div>
</div>

<style>
  .background-bar {
    position: fixed;
    z-index: 10;
    height: 100%;
    width: 100%;
  }
  .progress-bar {
    position: fixed;
    z-index: 11;
    width: 100%;
  }
</style>