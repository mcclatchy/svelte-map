import { writable, derived, readable } from 'svelte/store';
import { isMobile, isTablet } from './utils.js';

// DEVICE DIMENSIONS
export const windowHeight = writable(isMobile.ios() || isTablet.ipad() ? window.outerHeight : window.innerHeight);
export const windowWidth = writable(window.innerWidth);
export const aspectRatio = derived(
    [windowWidth, windowHeight],
    ([$windowWidth, $windowHeight]) => ($windowWidth / $windowHeight)
)

// DEVICE ORIENTATION
export const initialOrientationAngle = readable(window.orientation);
export const updatedOrientationAngle = writable(window.orientation);
export const orientationAngle = writable(window.orientation);
export const orientation = derived(
    aspectRatio,
    $aspectRatio => $aspectRatio >= 1 ? "landscape" : $aspectRatio >= 0.8 ? "middle" : "portrait"
)
export const isPortrait = derived(
    orientation,
    $orientation => $orientation === "portrait" || $orientation === "middle"
)
export const isRotated = derived(
    [initialOrientationAngle, updatedOrientationAngle],
    ([$initialOrientationAngle, $updatedOrientationAngle]) => $updatedOrientationAngle !== $initialOrientationAngle
)

// MAP STYLING
export const layersDrawn = writable([])
export const activeSectionId = writable('');
export const activeMapBoundsId = writable('');

// AML REPLACING LINK
export const domain = writable(window.pageInfo["marketInfo.domain"]);