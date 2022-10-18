<script>
	import { isMobile } from '../modules/utils.js'

    export let legendTitle = "Legend w/ Swatches"
	export let palette = ["red", "green", "blue", "yellow"]
    export let splits = ["1", "2", "3", "4", "5"]
    export let annotations = [{label: "Left", class: 'left'}, {label: "Middle", tick: 2}, {label: "Right", class: 'right'}]
    export let position = "absolute";
    export let opacity = 0;
    export let legendWidth = 250
    export let padding = 3; //pixels
</script>

<div class="legend-container" style={`position: ${position}; opacity: ${opacity};`}>
    <div class="legend-bg">
        <div class="legend-header">
            {@html legendTitle}
        </div>
    </div>
    <div class="legend" style={`width: min(95%, ${legendWidth}px)`}>


        <div class="row" style={`width: min(100%, ${legendWidth}px)`}>
            <div class="squares">
            	{#each palette as color, j}
              	<div class="square" style={`
                    width: calc(${100 / (palette.length) + "%" } - ${padding}px);
                    margin: 0 ${padding / 2}px;
                    opacity: 1; background-color: ${color}
                `}/>
            	{/each}
            </div>
        </div>
        <div class="row-header">
            {#each splits as split, i}
                <div style={`
                    width: ${100 / (palette.length) + "%"};
                    position: relative;
                    text-align: center;
                `}>
                    {split}
                </div>
            {/each}
        </div>
        {#if annotations}
            <div class="row-annotation">
                {#each annotations as annotation}
                    {#if annotation.class}
                        <div class={`legend-${annotation.class}`}>
                            {annotation.label}
                        </div>
                    {:else}
                        <div style={`
                            position: absolute;
                            left: ${legendWidth / (palette.length) * annotation.tick + "px" };
                            transform: translate(-50%,0%);
                        `}>
                            {annotation.label}
                        </div>
                    {/if}
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
.legend-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: block;
    pointer-events: none;
    text-align: center;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 9999999999999;
}

.row-annotation {
    position: absolute;
    width: 100%;
    bottom: 0;
    padding-bottom: 5px;
}

.legend-bg {
    position: absolute;
    top: 0px;
    left: 50%;
    transform:  translate(-50%, 0%);
    width: 100%;
    height: 150px;
    z-index: 1;
    background: linear-gradient(to bottom, rgba(255,255,255, 1), rgba(255,255,255,.8) 80%, rgba(255,255,255,0));
}

.legend-header {
    line-height: 1.3;
    font-size: 20px;
    font-family:  'Libre Franklin';
    padding-top: 8px;
    font-weight: 600;
}

.legend {
    position: absolute;
    top: 30px;
    left: 50%;
    transform:  translate(-50%, 0%);
    font-size: 11px;
    font-family:  'Libre Franklin';
    color: #444;
    z-index: 10;
    background-color: transparent;
    padding-top: 15px;
}

.legend .row-header {
    position: relative;
    line-height: 1.3;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    margin-bottom: 2px;
    align-items: flex-start;
}

.legend .row-tick {
    position: relative;
    line-height: 1.3;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    
}

.legend .row {
    overflow: hidden;
    /*padding: 3px 0;*/
    display: flex;
    display: -webkit-flex;
    padding-bottom: 5px;
}

.legend .row .squares {
    width: 100%;
    float: left;
    margin: auto;
    margin-top:  0;
    background-color: white;
}

.legend .row .square {
    height: 15px;
    float: left;
}

.legend-left {
    position: absolute;
    left: 0px;
    padding-left: 10px
}

.legend-right {
    position: absolute;
    right: 0px;
    padding-right: 10px;
}

:global(.desktop) {
  display: block;
}


@media only screen and (max-width: 800px) {
    .legend-bg, .legend {
        top: 0px;
        left: 50%;
        transform:  translate(-50%, 0%);
        background:  transparent;
    }
    .legend {
        padding-top: 20px;
        color: black;
    }
    .legend-bg {
        width: 100%;
        height: 110px;
        background-color: white;
        box-shadow: 0 0px 20px -2px #00000044;
    }
    .legend .row {
        height: 15px;
    }
    .legend .row .square {
        height: 6px;
    }
    .legend .row-header {
        line-height: 10px;
        font-size: 9px;
    }
    .legend, .row-annotation {
        position: absolute;
        top: 35px;
        left: 50%;
        transform:  translate(-50%, 0%);
    }
    .legend-header {
        font-size: 13px;
        padding-top: 8px;
        font-weight: bold;
    }
    .row-annotation {
        top:  27px;
    }
    .legend-left {
        transform: translate(0%,0%);
        padding-left: 0px  
    }
    .legend-right {
        transform: translate(0%,0%);
        padding-right: 0px  
    }
    :global(.desktop) {
        display: none;
    }
}

</style>