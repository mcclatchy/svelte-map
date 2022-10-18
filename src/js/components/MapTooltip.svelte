<script>
  import { getContext } from 'svelte';
  import maplibre from 'maplibre-gl';

  export let content;
  export let hoverableIds = [];
  export let mapId = "map";
  export let layerId = "layer";

  const { getMap } = getContext(mapId);
  const map = getMap();
  const hoverObj = getContext('hover');
  const tooltip = new maplibre.Popup({
		closeButton: false,
		closeOnClick: false
	});

  function getHomesTooltipHTML(obj) {
    const addressFound = `
      <div class="tooltip-title-container">
        <h3 class="tooltip-table-title">
          ${obj.feature.properties.address}
        </h3>
      </div>
    `
    const addressNotFound = `
    <div class="tooltip-title-container">
      <h3 class="tooltip-table-title">
        <span style='font-weight: 200; color: gray; font-size: 16px;'>Address not Provided</span>
      </h3>
    </div>
    `
    const htmlDataPresent = `
      <div class="tooltip-table-container">
          <table class="tooltip-table">
              <thead style="background-color: white;">
                  <tr style="border-bottom: none; vertical-align: bottom; margin-bottom: 15px;">
                      <th style="text-align: center;" class=""></th>
                      <th style="text-align: center;" class=""></th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td class="tooltip-text-column-short">
                        <p class="tooltip-cell" style="font-weight: bold; color: black; line-height: 1.2;">
                          Parent company:
                        </p>
                      </td>
                      <td class="tooltip-number-column">
                        <p class="tooltip-cell" style="background-color: ${obj.feature.properties.color}; font-weight: bold; color: white;}">
                          ${obj.feature.properties.investor}
                        </p>
                      </td>
                  </tr> 
              </tbody>
          </table>
      </div>
    `
    const htmlInsufficientData = `
      <div>
        <h4 class="tooltip-table-subtitle" style="padding-top: 10px; font-size: 12px; color: #404040;">Insufficient data for residence</h4>
      </div>
    `
    const tooltipHTML = `
      ${obj.feature.properties.address !== "" ? addressFound : addressNotFound}
      ${obj.feature.properties.investor ? htmlDataPresent : htmlInsufficientData}
    `
    return tooltipHTML
  }

  function getTooltipHTML(obj, layerId) {
    let tooltipHTML;
    switch(layerId) {
      case 'home-fill':
        tooltipHTML = getHomesTooltipHTML(obj)
        break;
      default:
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

  $: updateTooltip($hoverObj, layerId, content);
</script>

<style>
  :global(.maplibregl-popup-content) {
    padding: 5px 10px !important;
    width: 240px;
    filter: drop-shadow(rgba(0, 0, 0, 0.3) 0 2px 10px);
    z-index: 1000000 !important;
  }

  :global(.tooltip-title-container) {
    max-width: 100%;
    margin: auto;
    border-bottom: 2px solid #EEEEEE;
    /*padding-bottom: 5px;*/
  }

  :global(.tooltip-table-title) {
    max-width: 100%;
    text-align: left;
    margin-bottom: 0px;
    margin-right: auto;
    margin-left: auto;
    color: #121212;
    font-size: 16px;
    line-height: 23px;
    padding-bottom: 2px;
    font-weight: 700;
    font-family: 'Libre Franklin';
    margin-top: 15px;
    text-transform: none;
    text-align: center;
  }

  :global(.tooltip-table-subtitle) {
    max-width: 100%;
    text-align: left;
    margin-bottom: 8px;
    margin-top: 0;
    margin-right: auto;
    margin-left: auto;
    color: #121212;
    font-size: 12px;
    line-height: 24px;
    padding-bottom: 2px;
    font-weight: 200;
    font-family: 'Libre Franklin';
    text-transform: none;
    text-align: center;
  }

  :global(.tooltip-table-container) {
    font-family: 'Libre Franklin';
    /*height: 300px;*/
    padding: 5px;
    overflow: auto;
    padding-top: 0px;
    padding-bottom: 10px;
  }

  :global(.tooltip-table) {
    width: 100%;
    border-collapse: collapse;
  }

  :global(.tooltip-table thead th) {
    position: sticky;
    top: 0;
    font-size: 10px;
    font-weight: 200;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: #333;
    text-align: center;
    line-height: 1.2;
  } 

  :global(.tooltip-table tr) {
    margin: 0px auto 0px 0;
    border-spacing: 0;
    padding: 0;
    border: 0;
    vertical-align: baseline;
    display: table-row;
    text-indent: initial;
    font-size: 10px;
    font-weight: 200;
    text-size-adjust: 100%;
    border-bottom: 1px solid #EEEEEE;
  }

  :global(.tooltip-index-column) {
    width: 5%;
    font-size: 11px;
    font-weight: 200;
    color: #999;
    text-align: center;
    /*padding: 10px 9px 5px 0px;*/
  }

  :global(.tooltip-text-column-long) {
    width: 20%;
    font-size: 12px;
    color: #333;
    text-align: left;
    /*padding-right: 10px;*/
    padding: 10px 0px 0px 0px;
  }


  :global(.tooltip-text-column-short) {
    width: 10%;
    font-size: 12px;
    color: #333;
    text-align: center;
    vertical-align: middle;
  }

  :global(.tooltip-number-column) {
    width: 50%;
    padding-left: 10px !important;
    height: 100%;
    font-size: 12px;
    color: #333;
    padding-bottom: 5px;
    padding-top: 5px;
    text-align: center;
  }

  :global(.tooltip-number-column p) {
    margin: 0 !important;
    padding: 4px;
  }

  :global(.owner p) {
    font-size: 10px;
    text-align: center;
  }

  :global(.tooltip-cell) {
    margin: 0;
  }

@media (max-width: 600px) {
    :global(.tooltip-table-title) {
    margin-top: 10px;
    font-size: 16px;
    line-height: 20px;
  }
    :global(.tooltip-table-subtitle) {
    font-size: 12px;
    line-height: 16px;
  }
    :global(.tooltip-table-container) {
    padding-right: 5px;
    padding-left: 5px;
  }
    :global(.tooltip-table thead th) {
      font-size: 10px;
  }
    :global(.tooltip-table tr) {
      font-size: 12px;
  }
  :global(.tooltip-number-column) {
    font-size: 11px;
}
  :global(.tooltip-text-column-long) {
  font-size: 13px;
}
  :global(.tooltip-text-column-short) {
  font-size: 13px;
}
  :global(.tooltip-index-column) {
  font-size: 10px;
  }
}


</style>