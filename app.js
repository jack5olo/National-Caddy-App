// ============================================================================
// 1. FIREBASE AUTHENTICATION INTERFACE SELECTORS
// ============================================================================
const authScreen           = document.getElementById("auth-screen");
const mainAppScreen        = document.getElementById("main-app-screen");

const emailInput           = document.getElementById("auth-email");
const passwordInput        = document.getElementById("auth-password");
const confirmPasswordInput = document.getElementById("auth-confirm-password"); 
const mainActionButton     = document.getElementById("btn-main-action");
const logoutBtn            = document.getElementById("logoutBtn");

const toggleText           = document.getElementById("auth-toggle-text");
const toggleLink           = document.getElementById("auth-toggle-link");
const modeTitle            = document.getElementById("auth-mode-title");

let isSignupMode = false; // Tracks whether user is currently looking at Login or Signup view

// ============================================================================
// 2. VIEW CONTROLLER FUNCTIONS
// ============================================================================
function showAppView() {
    authScreen.style.display = "none";     // Hides the login gateway
    mainAppScreen.style.display = "block"; // Shows the main caddie engine
}

function showAuthView() {
    authScreen.style.display = "block";    // Shows the login gateway
    mainAppScreen.style.display = "none";  // Hides the main caddie engine
}

const auth = window.firebaseAuth;
const db = window.firebaseDb;

// Extract the explicit helper methods out of the fbHelpers object
const { 
    doc, 
    setDoc, 
    getDoc, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} = window.fbHelpers;;

// ============================================================================
// 3. VISUAL THEME INTERFACE TOGGLE (Swaps between Login and Signup)
// ============================================================================
toggleLink.addEventListener("click", (e) => {
    e.preventDefault(); // Prevents page jumping/reloading
    isSignupMode = !isSignupMode; // Flip the state switch

    if (isSignupMode) {
        modeTitle.innerText = "Create a New Player Profile";
        passwordInput.placeholder = "Create password (Min 8 characters)";
        confirmPasswordInput.style.display = "block"; // Reveal password confirmation box
        mainActionButton.innerText = "Create Player Profile";
        mainActionButton.style.background = "#28a745"; // Success green for signup
        toggleText.innerText = "Already have an account?";
        toggleLink.innerText = "Log In here";
    } else {
        modeTitle.innerText = "Log In to Your Profile";
        passwordInput.placeholder = "Enter password";
        confirmPasswordInput.style.display = "none"; // Hide password confirmation box
        mainActionButton.innerText = "Log In";
        mainActionButton.style.background = "#007bff"; // Primary blue for login
        toggleText.innerText = "Don't have an account?";
        toggleLink.innerText = "Sign Up here";
    }
});

// ============================================================================
// 4. MAIN ACTION EVENT HANDLER (Processes both Login and Signup requests)
// ============================================================================
mainActionButton.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        alert("Please enter both an email and password to proceed.");
        return;
    }

    if (isSignupMode) {
        // --------------------------------------------------------------------
        // SIGN UP MODE RUNTIME
        // --------------------------------------------------------------------
        const confirmPassword = confirmPasswordInput.value;

        if (!confirmPassword) {
            alert("Please confirm your password to complete registration.");
            return;
        }
        if (password.length < 8) {
            alert("Security requirement: Password must be at least 8 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            alert("⚠️ Passwords do not match! Please carefully re-type your entries.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                alert("Player Profile was created Successfully! Welcome to the National Caddy App");
            })
            .catch((error) => {
                // Intercept backend errors to provide distinct user notifications
                if (error.code === "auth/email-already-in-use") {
                    alert("❌ This email address is already registered. Click 'Log In here' below to sign in instead!");
                } else if (error.code === "auth/invalid-email") {
                    alert("❌ Please enter a valid email address format.");
                } else {
                    alert(`Error during registration: ${error.message}`);
                }
            });

    } else {
        // --------------------------------------------------------------------
        // LOG IN MODE RUNTIME
        // --------------------------------------------------------------------
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Successful sign in — background state monitor handles screen swapping
            })
            .catch((error) => {
                if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
                    alert("❌ Incorrect email or password. Please verify and try again.");
                } else {
                    alert("Login failed: " + error.message);
                }
            });
    }
});

// ============================================================================
// 5. SESSION DISCONNECT HANDLER (Log Out Button)
// ============================================================================
logoutBtn.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully. See you next round!");
        })
        .catch((error) => {
            alert("Error logging out: " + error.message);
        });
});

// ============================================================================
// BACKEND LIFECYCLE GATEKEEPER (Fetches player yardages upon successful login)
// ============================================================================
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("Player session verified:", user.email);
        
        try {
            // Check the cloud database for this specific user's file
            const playerDocRef = doc(db, "players", user.uid);
            const playerDocSnap = await window.fbHelpers.getDoc(playerDocRef);

            if (playerDocSnap.exists()) {
                console.log("📦 Found cloud yardages! Loading your locker room...");
                // Overwrite local memory array with your real cloud data
                userGolfProfile = playerDocSnap.data();
            } else {
                console.log("🆕 New player profile. Saving default base package...");
                // If they don't have a profile yet, save the initial baseline profile
                await setDoc(playerDocRef, userGolfProfile);
            }
        } catch (error) {
            console.error("Failed to recover cloud configuration metrics:", error);
        }

        // Render everything onto the UI screens cleanly
        renderBagInventoryList();
        bindWedgeMatrixInputs();
        showAppView(); // Unlocks yardage tools
        
    } else {
        showAuthView(); // Enforces application lockdown
    }
});

// ============================================================================
// CORE CADDIE ENGINE ENGINE CONTINUES BELOW...
// (Paste your canvas setup, course metrics, and calculation code directly here)
// ============================================================================

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

const clubTemplateDatabase = {
    driver: ["Driver", "Mini Driver"],
    woods: ["3-Wood", "5-Wood", "7-Wood"],
    hybrids: ["2-Hybrid", "3-Hybrid", "4-Hybrid", "5-Hybrid"],
    irons: ["2-Iron", "3-Iron", "4-Iron", "5-Iron", "6-Iron", "7-Iron", "8-Iron", "9-Iron"],
    wedges: ["Pitching Wedge", "Gap Wedge", "Sand Wedge", "Lob Wedge", "60 Degree", "56 Degree", "52 Degree"]
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

function populateTemplateDropdown() {
    const categorySelect = document.getElementById("presetCategorySelect");
    const itemSelect = document.getElementById("presetClubSelect");
    if (!categorySelect || !itemSelect) return;
    
    const category = categorySelect.value;
    itemSelect.innerHTML = "";
    
    if (clubTemplateDatabase[category]) {
        clubTemplateDatabase[category].forEach(name => {
            const opt = document.createElement("option");
            opt.value = name; opt.textContent = name;
            itemSelect.appendChild(opt);
        });
    }
}

// ============================================================================
// BLOCK 2: DYNAMIC HOLE-BY-HOLE DEFAULT PIN COORDINATES
// ============================================================================
// 💡 EDITING TIP: Change the X and Y coordinates inside this dictionary to match
// your custom drawn green shapes. Unlisted holes automatically start at center (210, 210).

const customStartingPins = {
    "gunnamatta": {
        1: { x: 210, y: 140 },
        2: { x: 300, y: 210 },
        3: { x: 120, y: 210 }
    },
    "moonah": {
        1: { x: 210, y: 160 }
    },
    "old": {
        1: { x: 210, y: 180 }
    },
    "long-island": {
        1: { x: 210, y: 230 }
    }
};

// ============================================================================
// BLOCK 3: USER PROFILE STORES (PLAYER BAG LOCKER & WEDGE MATRIX)
// ============================================================================

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
    syncGolfProfileToCloud();
};

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
    syncGolfProfileToCloud();
    // Sync changes dynamically as you type out your yardage gaps
    syncGolfProfileToCloud();
};

// ============================================================================
// BLOCK 4: RENDERING ENGINE (HTML5 CANVAS SKETCHES & DRAGGABLE PIN MECHANICS)
// ============================================================================

const canvas = document.getElementById("greenBookCanvas");
const ctx = canvas.getContext("2d");
let pinPosition = { x: 210, y: 210 };
let isDraggingPin = false;
let activeGreenImageElement = new Image();
let currentLoadedPath = "";

function drawGreenBook() {
    if (!canvas || !ctx) return;
    
    const selectedCourse = document.getElementById("currentCourseSelection")?.value || "gunnamatta";
    const selectedHoleNum = document.getElementById("currentHoleSelection")?.value || 1;
    const selectedHoleKey = `hole-${selectedHoleNum}`;
    
    if (!isDraggingPin) {
        if (currentLoadedPath !== customCourseBlueprints[selectedCourse]?.[selectedHoleKey]?.imagePath) {
            if (customStartingPins[selectedCourse] && customStartingPins[selectedCourse][selectedHoleNum]) {
                pinPosition.x = customStartingPins[selectedCourse][selectedHoleNum].x;
                pinPosition.y = customStartingPins[selectedCourse][selectedHoleNum].y;
            } else {
                pinPosition.x = 210;
                pinPosition.y = 210;
            }
        }
    }

    const blueprint = customCourseBlueprints[selectedCourse]?.[selectedHoleKey];
    
    if (!blueprint) {
        clearCanvasFallback();
        return;
    }

    if (currentLoadedPath !== blueprint.imagePath) {
        currentLoadedPath = blueprint.imagePath;
        activeGreenImageElement.src = blueprint.imagePath;
        activeGreenImageElement.onload = () => {
            renderFinalCanvasLayer();
        };
    } else {
        renderFinalCanvasLayer();
    }
}

function clearCanvasFallback() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#aaa";
    ctx.font = "14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sketch Layout Awaiting Import", canvas.width / 2, canvas.height / 2);
}

function renderFinalCanvasLayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(activeGreenImageElement, 0, 0, canvas.width, canvas.height);
    
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

// ============================================================================
// BLOCK 5: STRATEGY & WEATHER CADDIE CALCULATION ENGINES
// ============================================================================

function suggestClub(playsLikeDistance, pinLocation, missStrategy = "normal") {
    const head1 = document.getElementById("timeHead1")?.value || "Slot 1";
    const head2 = document.getElementById("timeHead2")?.value || "Slot 2";
    const head3 = document.getElementById("timeHead3")?.value || "Full";

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

    let recommendedClub = null;
    let sortedBag = [...userGolfProfile.bag].sort((a, b) => b.distance - a.distance);

    if (missStrategy === "short") {
        for (let i = 0; i < sortedBag.length; i++) {
            if (sortedBag[i].distance <= playsLikeDistance) {
                recommendedClub = sortedBag[i];
                break;
            }
        }
    } else if (missStrategy === "long") {
        for (let i = sortedBag.length - 1; i >= 0; i--) {
            if (sortedBag[i].distance >= playsLikeDistance) {
                recommendedClub = sortedBag[i];
                break;
            }
        }
    }

    if (!recommendedClub) {
        for (let i = 0; i < sortedBag.length; i++) {
            if (sortedBag[i].distance <= playsLikeDistance) {
                recommendedClub = sortedBag[i]; 
                break; 
            }
        }
    }
    
    if (!recommendedClub) recommendedClub = sortedBag[sortedBag.length - 1];

    let strategyNote = `Standard carry leaves room for miss-hit floor around ${recommendedClub.missDistance}m. Target tendency: ${recommendedClub.usualMiss}.`;
    if (missStrategy === "short") strategyNote = `⚠️ DEFENSIVE SHORT PLAY: ${strategyNote} Long is dead here.`;
    if (missStrategy === "long") strategyNote = `⚠️ AGGRESSIVE LONG PLAY: ${strategyNote} Front hazard protection active.`;

    return { name: recommendedClub.name, notes: strategyNote };
}

// ============================================================================
// BLOCK 6: APPLICATION BINDERS & USER LISTENER SEQUENCES
// ============================================================================

// Drag-and-drop Pin Calculations
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

// Rotational Wind UI System
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

// Metric/Imperial Real-Time Conversion Listener
const windSpeedInput = document.getElementById("windSpeedVelocity");
const unitToggle = document.getElementById("windUnitToggle");
let currentWindUnit = "kmh";

if (unitToggle) {
    unitToggle.addEventListener("change", (e) => {
        let newUnit = e.target.value;
        let currentSpeed = Number(windSpeedInput.value) || 0;
        if (currentSpeed === 0) { currentWindUnit = newUnit; return; }
        if (newUnit === "kmh" && currentWindUnit === "mph") {
            windSpeedInput.value = Math.round(currentSpeed * 1.60934);
        } else if (newUnit === "mph" && currentWindUnit === "kmh") {
            windSpeedInput.value = Math.round(currentSpeed / 1.60934);
        }
        currentWindUnit = newUnit;
    });
}

// 🎯 FIX 1: Active Listener monitoring Category shifts for instantaneous club template swaps
const presetCategorySelectorEl = document.getElementById("presetCategorySelect");
if (presetCategorySelectorEl) {
    presetCategorySelectorEl.addEventListener("change", populateTemplateDropdown);
}

// Bag Locker Configuration Updates
document.getElementById("saveNewClubBtn").addEventListener("click", () => {
    const name = document.getElementById("presetClubSelect").value;
    const carry = Number(document.getElementById("newClubCarry").value);
    const missDist = Number(document.getElementById("newClubMissDist").value);
    const missTrend = document.getElementById("newClubMissTrend").value;

    if (!carry) { alert("Please provide standard Carry performance data."); return; }

    // 🎯 FIX 2: Strict Inventory Duplicate validation guard logic
    const isClubAlreadyAdded = userGolfProfile.bag.some(club => club.name.toLowerCase().trim() === name.toLowerCase().trim());
    if (isClubAlreadyAdded) {
        alert(`The ${name} is already active inside your Yardage Inventory bag template! Duplicate inputs are blocked.`);
        return; 
    }

    userGolfProfile.bag.push({
        name: name, distance: carry, missDistance: missDist || Math.round(carry * 0.88), usualMiss: missTrend
    });
    renderBagInventoryList();
});

document.getElementById("addNewWedgeRowBtn").addEventListener("click", () => {
    const loftInput = document.getElementById("newWedgeLoft");
    const loftVal = loftInput.value.trim();
    if (!loftVal) { alert("Specify a loft number first."); return; }
    userGolfProfile.wedgeClock.push({ loft: loftVal, slot1: 0, slot2: 0, slot3: 0 });
    loftInput.value = "";
    bindWedgeMatrixInputs();
});

// View Toggle Tabs
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

// Master Calculate Trigger Engine
const calculateBtn = document.getElementById("calculateBtn");
calculateBtn.addEventListener("click", () => {
    let laserDist = Number(document.getElementById("laserDistanceTarget").value) || 0;
    let rawWind = Number(windSpeedInput.value) || 0;
    let windDir = windMenu.value;
    let unit = unitToggle ? unitToggle.value : "kmh";

    let windInKmh = rawWind;
    if (unit === "mph") { windInKmh = rawWind * 1.60934; }

    let playsLikeAdjustment = 0;
    if (windDir === "headwind") playsLikeAdjustment += (windInKmh * 0.5);
    else if (windDir.includes("diagonal-headwind")) playsLikeAdjustment += (windInKmh * 0.35);
    else if (windDir === "tailwind") playsLikeAdjustment -= (windInKmh * 0.3);
    else if (windDir.includes("diagonal-tailwind")) playsLikeAdjustment -= (windInKmh * 0.2);

    let finalPlaysLikeDistance = Math.round(laserDist + playsLikeAdjustment);

    const courseSelect = document.getElementById("currentCourseSelection");
    const holeSelect = document.getElementById("currentHoleSelection");
    let currentCourse = courseSelect ? courseSelect.value : "gunnamatta"; 
    let currentHole = holeSelect ? parseInt(holeSelect.value) : 1;
    let currentPinZone = document.getElementById("pinDepthLocation")?.value || "middle"; 

    let activeStrategy = "neutral";
    if (window.holeStrategies && window.holeStrategies[currentCourse] && window.holeStrategies[currentCourse][currentHole]) {
        let holeConfig = window.holeStrategies[currentCourse][currentHole][currentPinZone];
        if (holeConfig && holeConfig.missStrategy) { activeStrategy = holeConfig.missStrategy; }
    }

    let suggestion = suggestClub(finalPlaysLikeDistance, currentPinZone, activeStrategy);

    document.getElementById("outputPlaysLikeDist").textContent = `${finalPlaysLikeDistance}m`;
    document.getElementById("outputTargetClub").textContent = suggestion.name;
    document.getElementById("outputExecutionNote").textContent = suggestion.notes;
});

// ============================================================================
// CLOUD PERSISTENCE ENGINE (Syncs your bag data directly to Firestore)
// ============================================================================
async function syncGolfProfileToCloud() {
    const user = auth.currentUser;
    if (!user) {
        console.warn("No authenticated golfer found. Data saved locally only.");
        return;
    }

    try {
        // Targets: players (Collection) -> [User-UID] (Document)
        const playerDocRef = doc(db, "players", user.uid);
        
        // Pushes the exact userGolfProfile object up to Google's servers
        await setDoc(playerDocRef, userGolfProfile, { merge: true });
        console.log("⛳ Cloud Locker Room updated successfully for:", user.email);
    } catch (error) {
        console.error("Error saving profile metrics to cloud:", error);
    }
}

// Boot up Application Runtime Sequences
initHeaderSelectors();
populateTemplateDropdown(); // Forces sync alignment dynamically right on boot up
drawGreenBook();
updateWindArrowVisual("headwind");