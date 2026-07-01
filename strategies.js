// strategies.js
const holeStrategies = {
    "old": {
        1: {
            front: { bias: "long", missStrategy: "long", note: "Don't leave it short—nasty false front." },
            middle: { bias: "neutral", missStrategy: "neutral", note: "Green opens up here. Trust your yardage." },
            back: { bias: "short", missStrategy: "short", note: "Stay short of the pin. Over the back is dead." }
        },
        2: {
            front: { bias: "neutral", missStrategy: "neutral", note: "" },
            middle: { bias: "neutral", missStrategy: "neutral", note: "" },
            back: { bias: "short", missStrategy: "short", note: "Bunkers guard the back right." }
        }
    },
    "moonah": {
        1: {
            front: { bias: "long", missStrategy: "long", note: "Must clear the front bunker." },
            middle: { bias: "neutral", missStrategy: "neutral", note: "" },
            back: { bias: "long", missStrategy: "long", note: "Better to be long than short on this tier." }
        }
    },
    "gunnamatta": {
        1: {
            front: { bias: "neutral", missStrategy: "neutral", note: "Wind can be tricky here." },
            middle: { bias: "neutral", missStrategy: "neutral", note: "" },
            back: { bias: "short", missStrategy: "short", note: "Bunkers guard the back left." }
        }
    },
    "long-island": {
        1: {
            front: { bias: "long", missStrategy: "long", note: "Don't miss short." },
            middle: { bias: "neutral", missStrategy: "neutral", note: "" },
            back: { bias: "neutral", missStrategy: "neutral", note: "" }
        }
    }
};

// Make it globally accessible for app.js
window.holeStrategies = holeStrategies;