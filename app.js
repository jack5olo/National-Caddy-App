// ========================================================
// THE NATIONAL COURSE CONFIGURATION ENGINE
// ========================================================
const courseGreenLayouts = {
    "gunnamatta": {
        color: "#27ae60", stroke: "#1e7e43", radiusX: 95, radiusY: 135,
        bunkers: [{x: 100, y: 140, r: 15}, {x: 260, y: 260, r: 22}],
        desc: "Wide undulating fairways, massive wild green complexes."
    },
    "moonah": {
        color: "#1e824c", stroke: "#145a32", radiusX: 80, radiusY: 145,
        bunkers: [{x: 120, y: 200, r: 18}, {x: 110, y: 280, r: 14}],
        desc: "Rugged tactical blowout bunkers, deep bowl depressions."
    },
    "old": {
        color: "#2ecc71", stroke: "#27ae60", radiusX: 100, radiusY: 115,
        bunkers: [{x: 250, y: 160, r: 25}],
        desc: "Classic sharp contours, dramatic architectural target shelves."
    },
    "long-island": {
        color: "#16a085", stroke: "#117a65", radiusX: 85, radiusY: 125,
        bunkers: [{x: 130, y: 120, r: 12}, {x: 240, y: 210, r: 16}],
        desc: "Traditional sandbelt style contours, tight intricate testing frames."
    }
};

function initHeaderSelectors() {
    const holeSelect = document.getElementById("currentHoleSelection");
    const courseSelect = document.getElementById("currentCourseSelection");

    if (holeSelect) {
        holeSelect.innerHTML = "";
        for (let h = 1; h <= 18; h++) {
            const opt = document.createElement("option");
            opt.value = h; opt.textContent = `Hole ${h}`;
            holeSelect.appendChild(opt);
        }
        // FIX: Add the missing event listener to redraw the canvas on hole change
        holeSelect.addEventListener("change", () => { drawGreenBook(); });
    }

    if (courseSelect) {
        courseSelect.innerHTML = `
            <option value="gunnamatta">The Gunnamatta</option>
            <option value="moonah">The Moonah Course</option>
            <option value="old">The Old Course</option>
            <option value="long-island">Long Island</option>
        `;
        courseSelect.addEventListener("change", () => { drawGreenBook(); });
    }
}

// ========================================================
// PRESET DIRECTORY LISTS FOR EASY QUICK SELECTION
// ========================================================
const clubTemplateDatabase = {
    driver: ["Driver", "Mini Driver"],
    woods: ["3-Wood", "5-Wood", "7-Wood"],
    hybrids: ["2-Hybrid", "3-Hybrid", "4-Hybrid", "5-Hybrid"],
    irons: ["2-Iron", "3-Iron", "4-Iron", "5-Iron", "6-Iron", "7-Iron", "8-Iron", "9-Iron"],
    wedges: ["Pitching Wedge", "Gap Wedge", "Sand Wedge", "Lob Wedge", "60 Degree", "56 Degree", "52 Degree"]
};

function populateTemplateDropdown() {
    const category = document.getElementById("presetCategorySelect").value;
    const itemSelect = document.getElementById("presetClubSelect");
    if (!itemSelect) return;
    itemSelect.innerHTML = "";
    
    if (clubTemplateDatabase[category]) {
        clubTemplateDatabase[category].forEach(name => {
            const opt = document.createElement("option");
            opt.value = name; opt.textContent = name;
            itemSelect.appendChild(opt);
        });
    }
}
document.getElementById("presetCategorySelect").addEventListener("change", populateTemplateDropdown);

// ========================================================
// CORE PROFILE DATABASE (MODULAR BAG & FULLY EDITABLE WEDGES)
// ========================================================
let userGolfProfile = {
    bag: [
        { name: "Driver", distance: 240, missDistance: 215, usualMiss: "Slice Right" },
        { name: "5 Iron", distance: 175, missDistance: 155, usualMiss: "Thin Short" },
        { name: "7 Iron", distance: 150, missDistance: 138, usualMiss: "Slight Push Right" },
        { name: "Pitching Wedge", distance: 115, missDistance: 102, usualMiss: "Pull Left" }
    ],
    wedgeClock: [
        { loft: "60", slot1: 55, slot2: 70, slot3: 82 },
        { loft: "56", slot1: 70, slot2: 85, slot3: 98 },
        { loft: "52", slot1: 85, slot2: 100, slot3: 112 }
    ]
};

function renderBagInventoryList() {
    const listContainer = document.getElementById("clubsInventoryContainer");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    userGolfProfile.bag.sort((a, b) => b.distance - a.distance);

    userGolfProfile.bag.forEach((club, index) => {
        const row = document.createElement("div");
        row.className = "club-data-row";
        row.innerHTML = `
            <div class="club-meta-left">
                <span class="club-name-lbl">${club.name}</span>
                <span class="club-miss-lbl">Miss Trend: ${club.usualMiss}</span>
            </div>
            <div class="club-meta-right">
                <span class="club-dist-lbl">${club.distance}m <span>Miss: ${club.missDistance}m</span></span>
                <button class="btn-delete-club" onclick="removeClubAsset(${index})">×</button>
            </div>
        `;
        listContainer.appendChild(row);
    });
}

window.removeClubAsset = function(index) {
    userGolfProfile.bag.splice(index, 1);
    renderBagInventoryList();
};

document.getElementById("saveNewClubBtn").addEventListener("click", () => {
    const name = document.getElementById("presetClubSelect").value;
    const carry = Number(document.getElementById("newClubCarry").value);
    const missDist = Number(document.getElementById("newClubMissDist").value);
    const missTrend = document.getElementById("newClubMissTrend").value;

    if (!carry) { alert("Please provide standard Carry performance data."); return; }
    userGolfProfile.bag.push({
        name: name, distance: carry, missDistance: missDist || Math.round(carry * 0.88), usualMiss: missTrend
    });
    renderBagInventoryList();
});

function bindWedgeMatrixInputs() {
    const matrixContainer = document.getElementById("wedgeMatrixInputsContainer");
    if (!matrixContainer) return;
    matrixContainer.innerHTML = "";

    userGolfProfile.wedgeClock.forEach((wedge, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight:800; color:var(--text-primary); text-align:center;">${wedge.loft}°</td>
            <td><input type="number" value="${wedge.slot1}" data-idx="${index}" data-field="slot1"></td>
            <td><input type="number" value="${wedge.slot2}" data-idx="${index}" data-field="slot2"></td>
            <td><input type="number" value="${wedge.slot3}" data-idx="${index}" data-field="slot3"></td>
            <td><button class="btn-delete-club" style="font-size:1.1rem; line-height:1;" onclick="removeWedgeMatrixRow(${index})">×</button></td>
        `;
        matrixContainer.appendChild(tr);
    });

    matrixContainer.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = e.target.dataset.idx;
            const field = e.target.dataset.field;
            userGolfProfile.wedgeClock[idx][field] = Number(e.target.value) || 0;
        });
    });
}

window.removeWedgeMatrixRow = function(index) {
    userGolfProfile.wedgeClock.splice(index, 1);
    bindWedgeMatrixInputs();
};

document.getElementById("addNewWedgeRowBtn").addEventListener("click", () => {
    const loftInput = document.getElementById("newWedgeLoft");
    const loftVal = loftInput.value.trim();
    if (!loftVal) { alert("Specify a loft number first."); return; }

    userGolfProfile.wedgeClock.push({ loft: loftVal, slot1: 0, slot2: 0, slot3: 0 });
    loftInput.value = "";
    bindWedgeMatrixInputs();
});

// ========================================================
// ADVANCED CADDIE CALCULATION SYSTEM WITH MISSHIT PROTECTION
// ========================================================
function suggestClub(playsLikeDistance, pinLocation, missStrategy = "normal") {
    const head1 = document.getElementById("timeHead1")?.value || "Slot 1";
    const head2 = document.getElementById("timeHead2")?.value || "Slot 2";
    const head3 = document.getElementById("timeHead3")?.value || "Full";

    // 1. Check Wedge Matrix First
    for (let i = 0; i < userGolfProfile.wedgeClock.length; i++) {
        let w = userGolfProfile.wedgeClock[i];
        if (w.slot1 > 0 && Math.abs(w.slot1 - playsLikeDistance) <= 3) {
            return { name: `${w.loft}° Wedge`, notes: `Execute smooth controlled [ ${head1} ] stance.` };
        }
        if (w.slot2 > 0 && Math.abs(w.slot2 - playsLikeDistance) <= 3) {
            return { name: `${w.loft}° Wedge`, notes: `Execute controlled rhythmic [ ${head2} ] stance.` };
        }
        if (w.slot3 > 0 && Math.abs(w.slot3 - playsLikeDistance) <= 3) {
            return { name: `${w.loft}° Wedge`, notes: `Execute stable crisp [ ${head3} ] sequence.` };
        }
    }

    if (userGolfProfile.bag.length === 0) return { name: "No Clubs Loaded", notes: "Locker setup required." };

    // 2. Filter or Select Club Based on Hole Miss Strategy
    let recommendedClub = null;

    if (missStrategy === "short") {
        // MUST MISS SHORT: Find the first club where its standard carry does NOT exceed the target distance.
        for (let i = 0; i < userGolfProfile.bag.length; i++) {
            if (userGolfProfile.bag[i].distance <= playsLikeDistance) {
                recommendedClub = userGolfProfile.bag[i];
                break;
            }
        }
    } else if (missStrategy === "long") {
        // MUST MISS LONG: Find the club where even a miss-hit clears the hazard/front edge, or at least carries all the way.
        // We look for a club whose standard distance is greater than the target distance.
        for (let i = userGolfProfile.bag.length - 1; i >= 0; i--) {
            if (userGolfProfile.bag[i].distance >= playsLikeDistance) {
                recommendedClub = userGolfProfile.bag[i];
                break;
            }
        }
    }

    // Fallback if strategy constraints find nothing, or strategy is "normal"
    if (!recommendedClub) {
        for (let i = 0; i < userGolfProfile.bag.length; i++) {
            if (userGolfProfile.bag[i].distance <= playsLikeDistance) {
                recommendedClub = userGolfProfile.bag[i]; 
                break; 
            }
        }
    }
    
    // Final hard floor backup
    if (!recommendedClub) recommendedClub = userGolfProfile.bag[userGolfProfile.bag.length - 1];

    // 3. Construct Strategy Notes
    let strategyNote = `Standard carry leaves room for miss-hit floor around ${recommendedClub.missDistance}m. Target tendency: ${recommendedClub.usualMiss}.`;
    if (missStrategy === "short") strategyNote = `⚠️ DEFENSIVE SHORT PLAY: ${strategyNote} Long is dead here.`;
    if (missStrategy === "long") strategyNote = `⚠️ AGGRESSIVE LONG PLAY: ${strategyNote} Front hazard protection active.`;

    return { name: recommendedClub.name, notes: strategyNote };
}

// ========================================================
// APPLICATION TAB NAVIGATION WORKFLOWS
// ========================================================
const navCaddieBtn = document.getElementById("navCaddieTab");
const navBagBtn = document.getElementById("navBagTab");
const caddieView = document.getElementById("caddieViewportView");
const bagView = document.getElementById("bagViewportView");

navCaddieBtn.addEventListener("click", () => {
    navCaddieBtn.classList.add("active"); navBagBtn.classList.remove("active");
    caddieView.classList.add("active"); bagView.classList.remove("active");
});

navBagBtn.addEventListener("click", () => {
    navBagBtn.classList.add("active"); navCaddieBtn.classList.remove("active");
    bagView.classList.add("active"); caddieView.classList.remove("active");
    renderBagInventoryList(); bindWedgeMatrixInputs();
});

// ========================================================
// COURSE-SPECIFIC DYNAMIC GREEN CANVAS CANVAS IMPLEMENTATION
// ========================================================
const canvas = document.getElementById("greenBookCanvas");
const ctx = canvas.getContext("2d");
const greenDimensions = { x: 210, y: 210 };
let pinPosition = { x: 210, y: 210 };
let isDraggingPin = false;

// Keep track of the active loaded image object to prevent flickering loops
let activeGreenImageElement = new Image();
let currentLoadedPath = "";

function drawGreenBook() {
    if (!canvas || !ctx) return;
    
    const selectedCourse = document.getElementById("currentCourseSelection")?.value || "gunnamatta";
    const selectedHole = `hole-${document.getElementById("currentHoleSelection")?.value || 1}`;
    
    // Fetch lookup metadata block from courses.js
    const blueprint = customCourseBlueprints[selectedCourse]?.[selectedHole];
    
    if (!blueprint) {
        // Fallback safety frame if you haven't drawn this hole yet
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#aaa";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Sketch Layout Awaiting Import", canvas.width / 2, canvas.height / 2);
        return;
    }

    // Check if we need to load a completely fresh image asset file source
    if (currentLoadedPath !== blueprint.imagePath) {
        currentLoadedPath = blueprint.imagePath;
        activeGreenImageElement.src = blueprint.imagePath;
        
        // Redraw only when the image data finishes downloading over the client wire
        activeGreenImageElement.onload = () => {
            renderFinalCanvasLayer(blueprint);
        };
    } else {
        // Image is already loaded in memory caching, safely dump onto screen frame instantly
        renderFinalCanvasLayer(blueprint);
    }
}

// Separate painter routine to handle drawing image + Pin + Flag layers cleanly
function renderFinalCanvasLayer(blueprint) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Force High-Quality Image Anti-Aliasing Smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Draw your custom hand-drawn transparent sketch scaled perfectly to fill canvas boundaries
    ctx.drawImage(activeGreenImageElement, 0, 0, canvas.width, canvas.height);
    
    // Render interactive user drag flag pin directly on top of your sketch blueprint layout
    ctx.beginPath(); 
    ctx.arc(pinPosition.x, pinPosition.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0,0,0,0.25)"; 
    ctx.fill();
    
    ctx.beginPath(); 
    ctx.moveTo(pinPosition.x, pinPosition.y); 
    ctx.lineTo(pinPosition.x, pinPosition.y - 30);
    ctx.lineWidth = 3; 
    ctx.strokeStyle = "#ffffff"; 
    ctx.stroke();
    
    ctx.beginPath(); 
    ctx.moveTo(pinPosition.x, pinPosition.y - 30); 
    ctx.lineTo(pinPosition.x - 15, pinPosition.y - 23); 
    ctx.lineTo(pinPosition.x, pinPosition.y - 16);
    ctx.fillStyle = "#e74c3c"; 
    ctx.fill();
}

canvas.addEventListener("mousedown", (e) => {
    let rect = canvas.getBoundingClientRect();
    if (Math.sqrt((e.clientX - rect.left - pinPosition.x)**2 + (e.clientY - rect.top - pinPosition.y)**2) < 25) isDraggingPin = true;
});
canvas.addEventListener("mousemove", (e) => {
    if (!isDraggingPin) return;
    let rect = canvas.getBoundingClientRect();
    pinPosition.x = Math.max(20, Math.min(canvas.width - 20, e.clientX - rect.left));
    pinPosition.y = Math.max(20, Math.min(canvas.height - 20, e.clientY - rect.top));
    drawGreenBook();
});
window.addEventListener("mouseup", () => isDraggingPin = false);

// ========================================================
// DIRECTIONAL WIND ROTATIONAL RECEPTORS
// ========================================================
const windMenu = document.getElementById("windDirectionSelect");
const integratedArrow = document.getElementById("integratedWindArrow");
const directionAngles = {
    "headwind": 180, "tailwind": 0, "right-to-left": 270, "left-to-right": 90,
    "diagonal-headwind-right": 225, "diagonal-headwind-left": 135,
    "diagonal-tailwind-right": 315, "diagonal-tailwind-left": 45
};
function updateWindArrowVisual(keyword) {
    if (!integratedArrow) return;
    let targetAngle = directionAngles[keyword] || 0;
    integratedArrow.style.transform = `translate(-50%, -50%) rotate(${targetAngle}deg)`;
}
windMenu.addEventListener("change", (e) => updateWindArrowVisual(e.target.value));

// ========================================================
// MATH INTERACTION MATRIX AND EVENT LINKERS
// ========================================================
const calculateBtn = document.getElementById("calculateBtn");
const windSpeedInput = document.getElementById("windSpeedVelocity");
const unitToggle = document.getElementById("windUnitToggle");

// AUTOMATIC METRIC/IMPERIAL WIND SPEED CONVERTER WITH TRACKING
let currentWindUnit = "kmh";

if (unitToggle) {
    unitToggle.addEventListener("change", (e) => {
        let newUnit = e.target.value;
        let currentSpeed = Number(windSpeedInput.value) || 0;
        
        if (currentSpeed === 0) {
            currentWindUnit = newUnit;
            return;
        }

        if (newUnit === "kmh" && currentWindUnit === "mph") {
            windSpeedInput.value = Math.round(currentSpeed * 1.60934);
        } else if (newUnit === "mph" && currentWindUnit === "kmh") {
            windSpeedInput.value = Math.round(currentSpeed / 1.60934);
        }
        
        currentWindUnit = newUnit;
    });
}

calculateBtn.addEventListener("click", () => {
    let laserDist = Number(document.getElementById("laserDistanceTarget").value) || 0;
    let rawWind = Number(windSpeedInput.value) || 0;
    let windDir = windMenu.value;
    let unit = unitToggle ? unitToggle.value : "kmh";

    // Normalize wind speed to metric internally for calculation consistency
    let windInKmh = rawWind;
    if (unit === "mph") {
        windInKmh = rawWind * 1.60934;
    }

    let playsLikeAdjustment = 0;
    if (windDir === "headwind") playsLikeAdjustment += (windInKmh * 0.5);
    else if (windDir.includes("diagonal-headwind")) playsLikeAdjustment += (windInKmh * 0.35);
    else if (windDir === "tailwind") playsLikeAdjustment -= (windInKmh * 0.3);
    else if (windDir.includes("diagonal-tailwind")) playsLikeAdjustment -= (windInKmh * 0.2);

    let finalPlaysLikeDistance = Math.round(laserDist + playsLikeAdjustment);

    // AUTOMATIC LOOKUP USING MATCHING LOWERCASE SELECTORS
    const courseSelect = document.getElementById("currentCourseSelection");
    const holeSelect = document.getElementById("currentHoleSelection");
    
    let currentCourse = courseSelect ? courseSelect.value : "gunnamatta"; 
    let currentHole = holeSelect ? parseInt(holeSelect.value) : 1;
    let currentPinZone = document.getElementById("pinDepthLocation")?.value || "middle"; 

    let activeStrategy = "neutral";
    
    // Safely check our updated lowercase strategies database
    if (window.holeStrategies && window.holeStrategies[currentCourse] && window.holeStrategies[currentCourse][currentHole]) {
        let holeConfig = window.holeStrategies[currentCourse][currentHole][currentPinZone];
        if (holeConfig && holeConfig.missStrategy) {
            activeStrategy = holeConfig.missStrategy;
        }
    }

    // Run suggestion engine with the strategy constraint
    let suggestion = suggestClub(finalPlaysLikeDistance, currentPinZone, activeStrategy);

    document.getElementById("outputPlaysLikeDist").textContent = `${finalPlaysLikeDistance}m`;
    document.getElementById("outputTargetClub").textContent = suggestion.name;
    document.getElementById("outputExecutionNote").textContent = suggestion.notes;
});

// Boot up Application Runtime Sequences
initHeaderSelectors();
populateTemplateDropdown();
drawGreenBook();
updateWindArrowVisual("headwind");
