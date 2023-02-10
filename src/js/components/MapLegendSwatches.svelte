<script>
	import { isMobile } from '../modules/utils.js'

    export let legendTitle = "Legend w/ Swatches"
	export let palette = ["red", "green", "blue", "yellow"]
    export let splits = ["1", "2", "3", "4", "5"]
    export let annotations = [{label: "Left", class: 'left'}, {label: "Middle", tick: 2}, {label: "Right", class: 'right'}]
    export let position = "absolute";
    export let opacity = 0;
    export let legendWidth = 250
</script>

<div class="legend-container" style={`position: ${position}; opacity: ${opacity};`}>
    <div class="legend-bg">
        <div class="legend-header">
            {@html legendTitle}
        </div>
    </div>
    <div class="legend" style={`width: min(90%, ${legendWidth}px)`}>

        <div class="row-header">
            {#each splits as split, i}
                <div style={`
                    width: ${100 / (palette.length) + "%"};
                    position: ${i === (splits.length - 1) ? "absolute" : "relative" };
                    left: calc(${i === (splits.length - 1) ? "100%" : "unset" });
                    transform: translate(-50%,0%);
                    text-align: center;
                `}>
                    {split}
                </div>
            {/each}
        </div>
        <div class="row-tick">
            {#each palette as color, i}
                <div style={`
                    width: calc(${100 / (palette.length) + "%" });
                    text-align: center;
                    position: relative;
                    border-left: ${splits[i] !== "" ? "1px solid gray" : ""};
                    border-right: ${i === (palette.length - 1) ? "1px solid gray" : ""};
                    height: 6px;
                `}>
                </div>
            {/each}
        </div>
        <div class="row" style={`width: min(100%, ${legendWidth}px)`}>
            <div class="squares">
            	{#each palette as color, j}
              	<div class="square" style={`
                    width: ${100 / (palette.length) + "%" };
                    opacity: 1; background-color: ${color}
                `}/>
            	{/each}
            </div>
        </div>
        <div class="row-annotation">
            {#each annotations as annotation}
                {#if annotation.class}
                    <div class={`legend-${annotation.class}`}>
                        {@html annotation.label}
                    </div>
                {:else}
                    <div style={`
                        position: absolute;
                        left: ${legendWidth / (palette.length) * annotation.tick + "px" };
                        transform: translate(-50%,0%);
                    `}>
                        {@html annotation.label}
                    </div>
                {/if}
            {/each}
        </div>
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
    z-index: 100000;
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
    height: 120px;
    z-index: 1;
    background: linear-gradient(to bottom, rgba(255,255,255, 1), rgba(255,255,255,.8) 80%, rgba(255,255,255,0));
}

.legend-header {
    line-height: 1.3;
    font-size: 20px;
    font-family: var(--serif);
    padding-top: 8px;
    font-weight: 600;
}

.legend {
    position: absolute;
    top: 30px;
    left: 50%;
    transform:  translate(-50%, 0%);
    font-size: 11px;
    font-family: var(--sans);
    color: #444;
    z-index: 10;
    padding-top: 10px;
    background-color: transparent;
}

.legend .row-header {
    position: relative;
    line-height: 20px;
    width: 100%;
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    margin-bottom: 2px;
    
}

.legend .row-tick {
    position: relative;
    line-height: 20px;
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
    height: 12px;
    float: left;
}

.legend-left {
    position: absolute;
    left: 0px;
    transform: translate(-50%,0%);
    padding-left: 10px
}

.legend-center {
    position: absolute;
    left: 50%;
    transform: translate(-50%,0%);
    padding-left: 0px
}

.legend-right {
    position: absolute;
    right: 0px;
    transform: translate(50%,0%);
    padding-right: 10px;
}

@media only screen and (max-width: 800px) {
    .legend-bg, .legend {
        top: 0px;
        left: 50%;
        transform:  translate(-50%, 0%);
        background:  transparent;
    }
    .legend {
        padding-top: 15px;
        color: black;
    }
    .legend-bg {
        width: 100%;
        height: 105px;
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
        font-size: 10px;
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
        top:  42px;
    }
    .legend-left {
        transform: translate(0%,0%);
        padding-left: 0px  
    }
    .legend-right {
        transform: translate(0%,0%);
        padding-right: 0px  
    }
}

</style>