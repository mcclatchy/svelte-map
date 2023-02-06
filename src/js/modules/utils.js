// https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k
export function abbrNum(number, decPlaces=0) {
    // 2 decimal places => 100, 3 => 1000, etc
    decPlaces = Math.pow(10,decPlaces);

    // Enumerate number abbreviations
    var abbrev = [ "k", "m", "b", "t" ];

    // Go through the array backwards, so we do the largest first
    for (var i=abbrev.length-1; i>=0; i--) {

        // Convert array index to "1000", "1000000", etc
        var size = Math.pow(10,(i+1)*3);

        // If the number is bigger or equal do the abbreviation
        if(size <= number) {
             // Here, we multiply by decPlaces, round, and then divide by decPlaces.
             // This gives us nice rounding to a particular decimal place.
             number = Math.round(number*decPlaces/size)/decPlaces;

             // Handle special case where we round up to the next abbreviation
             if((number == 1000) && (i < abbrev.length - 1)) {
                 number = 1;
                 i++;
             }

             // Add the letter for the abbreviation
             number += abbrev[i];

             // We are done... stop
             break;
        }
    }

    return number;
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// https://stackoverflow.com/questions/9461621/format-a-number-as-2-5k-if-a-thousand-or-more-otherwise-900
function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : '<1K'
}

export function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, 'g'), replace);
}

export function amlToHTML(text, removeBreaks=false) {
  let htmlText = replaceAll(text, /\[([^\]]+)\]\(([^\)]+)\)/, '<a target="_blank" href="$2">$1</a>');
  if (isMobile.any() && removeBreaks) {
    htmlText = replaceAll(htmlText, '<br>', ' ')
  }
  return htmlText;
}

export function getArrayItemById(id, array) {
  const item = array.find(elem => elem.id === id);
  return item;
}

export function timestampToSeconds(ts) {
  let [minutes, seconds] = ts.split(":")
  minutes = parseInt(minutes, 10)
  seconds = parseFloat(seconds, 10)

  const totalSeconds = 60 * minutes + seconds
  return totalSeconds
}

// TODO: pixelsPerFrame=5 for gallery slide videos
export function addDataToVideoElement(video, frameRate=30, pixelsPerFrame=20, portraitPixelsPerFrame=10) {
  const videoDuration = parseFloat(video?.landscape?.duration, 10);
  const portraitDuration = parseFloat(video?.portrait?.duration, 10);

  if ('scrollingTexts' in video) {
    video.scrollingTexts = video.scrollingTexts.map(item => {
      item.seconds = timestampToSeconds(item?.landscape?.timestamp);
      item.portraitSeconds = timestampToSeconds(item?.portrait?.timestamp);

      // For tracking text items from bottom to top
      item.endSeconds = item?.landscape?.endTimestamp && timestampToSeconds(item?.landscape?.endTimestamp);
      item.portraitEndSeconds = item?.portrait?.endTimestamp && timestampToSeconds(item?.portrait?.endTimestamp);

      return item;
    });
  }
  
  video.landscape.height = videoDuration * frameRate * pixelsPerFrame;
  video.portrait.height = portraitDuration * frameRate * portraitPixelsPerFrame;
  video.time = 0;
  return video;
}

export function getPixelHeightFromTimestamp(timestamp, video, windowHeight) {
  let pixelHeight = 0;
  let offset = windowHeight + video.offset;
  pixelHeight += (timestamp / video.duration) * (video.nonPausedHeight) - windowHeight;
  pixelHeight += offset
  return pixelHeight;
}

// From old Pudding starter template - https://github.com/the-pudding/starter/blob/master/src/js/utils/is-mobile.js (MIT license)
// device sniffing for mobile

export const isMobile = {
  android: () => navigator.userAgent.match(/Android/i),
  blackberry: () => navigator.userAgent.match(/BlackBerry/i),
  ios: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
  opera: () => navigator.userAgent.match(/Opera Mini/i),
  windows: () => navigator.userAgent.match(/IEMobile/i),

  any: () => (
    isMobile.android() ||
    isMobile.blackberry() ||
    isMobile.ios() ||
    isMobile.opera() ||
    isMobile.windows()
  ),
}

export const isDesktop = {
  chrome: () => navigator.userAgent.indexOf('Chrome') != -1 && navigator.userAgent.indexOf('Opera') == -1,
  explorer: () => navigator.userAgent.indexOf('MSIE') > -1,
  firefox: () => navigator.userAgent.indexOf('Firefox') > -1,
  safari: () => navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1,
  opera: () => navigator.userAgent.toLowerCase().indexOf("op") > -1,

  any: () => {
    isDesktop.chrome() ||
    isDesktop.explorer() ||
    isDesktop.firefox() ||
    isDesktop.safari() ||
    isDesktop.opera()
  }
}

export const isTablet = {
  ipad: () => {
    // from https://www.npmjs.com/package/isipad
    const userAgentString = window.navigator.userAgent
    const navigator = window.navigator
    const isIpadOS = (navigator.platform && navigator.platform.indexOf('iPad') >= 0) || (userAgentString.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
    return RegExp(/iPad|iOS/).test(userAgentString) || isIpadOS
  },
  generic: () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = RegExp(/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/).test(userAgent);
    return isTablet;
  },
  any: () => (
    isTablet.ipad() ||
    isTablet.generic()
  )
}

// SOURCE: https://blog.elantha.com/resizeobserver-loop-limit-exceeded/
export async function execResizeCallbackWithSuspend(elements, resizeObserver, callback) {
  const initialSizes = elements.map(element => 
    element.getBoundingClientRect()
  );

  callback();

  const postCallbackSizes = elements.map(element =>
    element.getBoundingClientRect()
  );

  const resizedElements = elements.filter(
    (_, i) =>
      initialSizes[i].width !== postCallbackSizes[i].width ||
      initialSizes[i].height !== postCallbackSizes[i].height
  );

  resizedElements.forEach(element => resizeObserver.unobserve(element));

  window.requestAnimationFrame(() => {
    resizedElements.forEach(element => resizeObserver.observe(element));
  });
}

// datestring in this format: '2022-06-22';
export function getUnixTimestamp(dateStr) {
  const date = new Date(dateStr);
  const timestampInMs = date.getTime();
  const unixTimestamp = Math.floor(date.getTime() / 1000);
}

export function replaceLinkDomain(link, newDomain, oldDomain) {
  if (!newDomain || !oldDomain) {
    return link;
  }
  const replacedLink = link.replaceAll(`www.${oldDomain}.com`, `www.${newDomain}.com`);
  return replacedLink;
}

export function getDivAspectRatio(div) {
  return Math.round(div.offsetWidth / div.offsetHeight * 100) / 100;
}

// SOURCE: https://github.com/watson/nearest-date
// Sorted assumes it's sorted in ascending order
export function nearestDate(dates, target, sorted=true) {
  if (!target) target = Date.now()
  else if (target instanceof Date) target = target.getTime()

  var nearest = Infinity
  var winner = -1

  for (var index = 0; index < dates.length; index++) {
    let date = dates[index]
    if (date instanceof Date) date = date.getTime()
    var distance = Math.abs(date - target)
    if (distance < nearest) {
      nearest = distance
      winner = index
    }
    if (sorted && distance > nearest) {
      break;
    }
  }
  return winner
}

// Taken directly from the following source
// https://www.geeksforgeeks.org/how-to-detect-the-version-of-a-browser/
export function getBrowserInfo() {
  var objappVersion = navigator.appVersion;
  var browserAgent = navigator.userAgent;
  var browserName = navigator.appName;
  var browserVersion = '' + parseFloat(navigator.appVersion);
  var browserMajorVersion = parseInt(navigator.appVersion, 10);
  var Offset, OffsetVersion, ix;
  
  // For Chrome
  if ((OffsetVersion = browserAgent.indexOf("Chrome")) != -1) {
    browserName = "Chrome";
    browserVersion = browserAgent.substring(OffsetVersion + 7);
  }
  
  // For Microsoft internet explorer
  else if ((OffsetVersion = browserAgent.indexOf("MSIE")) != -1) {
    browserName = "Microsoft Internet Explorer";
    browserVersion = browserAgent.substring(OffsetVersion + 5);
  }
  
  // For Firefox
  else if ((OffsetVersion = browserAgent.indexOf("Firefox")) != -1) {
    browserName = "Firefox";
  }
  
  // For Safari
  else if ((OffsetVersion = browserAgent.indexOf("Safari")) != -1) {
    browserName = "Safari";
    browserVersion = browserAgent.substring(OffsetVersion + 7);
    if ((OffsetVersion = browserAgent.indexOf("Version")) != -1)
      browserVersion = browserAgent.substring(OffsetVersion + 8);
  }
  
  // For other browser "name/version" is at the end of userAgent
  else if ((Offset = browserAgent.lastIndexOf(' ') + 1) <
    (OffsetVersion = browserAgent.lastIndexOf('/'))) {
    browserName = browserAgent.substring(Offset, OffsetVersion);
    browserVersion = browserAgent.substring(OffsetVersion + 1);
    if (browserName.toLowerCase() == browserName.toUpperCase()) {
      browserName = navigator.appName;
    }
  }
  
  // Trimming the fullVersion string at
  // semicolon/space if present
  if ((ix = browserVersion.indexOf(";")) != -1)
    browserVersion = browserVersion.substring(0, ix);
  if ((ix = browserVersion.indexOf(" ")) != -1)
    browserVersion = browserVersion.substring(0, ix);
  
  
  browserMajorVersion = parseInt('' + browserVersion, 10);
  if (isNaN(browserMajorVersion)) {
    browserVersion = '' + parseFloat(navigator.appVersion);
    browserMajorVersion = parseInt(navigator.appVersion, 10);
  }
  const browserInfo = {
    browserName,
    browserVersion,
    browserMajorVersion,
    appName: navigator.appName,
    userAgent: navigator.userAgent
  }
  return browserInfo
}
