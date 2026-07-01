// pins.js
const defaultPinPositions = {
    "gunnamatta": {
        1: { x: 210, y: 160 }, // Slightly deep on opening green
        2: { x: 190, y: 230 }, // Tucked left behind bunker
        3: { x: 220, y: 200 }
    },
    "moonah": {
        1: { x: 210, y: 190 }
    },
    "old": {
        1: { x: 205, y: 175 }
    },
    "long-island": {
        1: { x: 215, y: 220 }
    }
};

// Expose it globally so app.js can see it
window.defaultPinPositions = defaultPinPositions;