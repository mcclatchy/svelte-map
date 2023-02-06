<script>
	import { isMobile } from '../modules/utils.js'

    export let position = "absolute";
    export let opacity = 0;
    export let legendWidth = 250
    export let legendTitle;
    export let legendSubtitle;
</script>

<div class="legend-container" style={`position: ${position}; opacity: ${opacity};`}>
    <div class="legend-bg">
        <div class="legend-header">
            <p class="legend-title">{@html legendTitle}</p>
            <p class="legend-subtitle">{@html legendSubtitle}</p>
        </div>
    </div>
</div>

<style>
.legend-container {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    display: block;
    text-align: center;
    position: sticky;
    top: 0;
    z-index: 100000;
}

.legend-bg {
    position: absolute;
    top: 0px;
    padding-top: 15px;
    left: 50%;
    transform:  translate(-50%, 0%);
    width: 100%;
    z-index: 1;
}

.legend-header {
    line-height: 1.3;
    font-size: 20px;
    font-family:  var(--sans);
    padding: 10px;
    font-weight: 600;
/*    width: min(800px, calc(95% - 40px));*/
    width: calc(95% - 40px);
    margin: 0 auto;
}

.legend-header p {
    margin: 0;
    color: rgb(200,200,200);
    text-align: right;
}

.legend-title {
    font-size: 22px;
    font-weight: normal;
}

.legend-subtitle {
    font-weight: normal;
    font-size: 16px;
}

@media only screen and (max-width: 600px) {
    .legend-bg, .legend {
        top: 0px;
        background:  transparent;
    }
    .legend-header {
        padding: var(--page-padding);
        margin: 0 auto;
        display: flex;
        flex-direction: column;
    }
    .legend-bg {
        width: 100%;
        padding-top: 5%;
    }
    .legend-header {
        font-size: 13px;
        padding-top: 8px;
    }
    .legend-title {
        font-size: 18px;
    }

    .legend-subtitle {
        font-weight: normal;
        font-size: 14px;
    }

}

</style>