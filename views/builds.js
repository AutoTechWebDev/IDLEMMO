import { load, save } from "../js/storage.js";

const EQUIPMENT_SLOTS = [

    "weapon",
    "offhand",

    "helmet",
    "chest",
    "legs",
    "gloves",
    "boots",

    "amulet",

    "ring1",
    "ring2",

    "pet"
];

let build = {};
export function renderBuilds(content){

    build =
        load("currentBuild") || {};

    content.innerHTML = `

        <div class="grid grid-2">

            <div class="panel">

                <h2>Equipment</h2>

                <div id="equipmentGrid"></div>

            </div>

            <div class="panel">

                <h2>Combined Stats</h2>

                <div id="buildStats"></div>

                <br>

                <h2>Effects</h2>

                <div id="buildEffects"></div>

                <br>

                <button
                    class="primary"
                    id="saveBuild">

                    Save Build

                </button>

            </div>

        </div>
    `;

    renderEquipment();

    recalculateBuild();

    document
        .getElementById("saveBuild")
        .addEventListener(
            "click",
            saveBuild
        );
}
function renderEquipment(){

    const grid =
        document.getElementById(
            "equipmentGrid"
        );

    grid.innerHTML = "";

    EQUIPMENT_SLOTS.forEach(slot => {

        const item =
            build[slot];

        grid.innerHTML += `

            <div
                class="slot-card"
                data-slot="${slot}">

                <strong>

                    ${slot.toUpperCase()}

                </strong>

                <br><br>

                ${
                    item
                    ?
                    item.name
                    :
                    "Empty Slot"
                }

            </div>

        `;
    });

    document
        .querySelectorAll(
            ".slot-card"
        )

        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    openEquipDialog(
                        card.dataset.slot
                    );
                }
            );
        });
}
async function openEquipDialog(slot){

    const hashedId =
        prompt(
            `Enter Item Hash for ${slot}`
        );

    if(!hashedId)
        return;

    try{

        const item =
            load(
                `item_${hashedId}`
            );

        if(!item){

            alert(
                "Inspect item first in Item Browser."
            );

            return;
        }

        build[slot] = item;

        renderEquipment();

        recalculateBuild();

    }
    catch(error){

        console.error(error);
    }
}
function recalculateBuild(){

    const totals = {};

    const effects = [];

    Object.values(build)

        .filter(Boolean)

        .forEach(item => {

            if(item.stats){

                Object.entries(
                    item.stats
                )

                .forEach(
                    ([key,val]) => {

                        totals[key] =
                            (totals[key] || 0)
                            + val;
                    }
                );
            }

            if(item.effects){

                effects.push(
                    ...item.effects
                );
            }

        });

    renderStats(totals);

    renderEffects(effects);
}
function renderStats(stats){

    const container =
        document.getElementById(
            "buildStats"
        );

    if(
        Object.keys(stats)
        .length === 0
    ){

        container.innerHTML =
            "<p>No stats.</p>";

        return;
    }

    container.innerHTML =

        Object.entries(stats)

        .map(
            ([key,val]) => {

                return `

                    <div
                        class="stat-row">

                        <span>
                            ${key}
                        </span>

                        <strong>
                            ${val}
                        </strong>

                    </div>

                `;
            }
        )

        .join("");
}
function renderEffects(effects){

    const container =
        document.getElementById(
            "buildEffects"
        );

    if(!effects.length){

        container.innerHTML =
            "<p>No effects.</p>";

        return;
    }

    container.innerHTML =

        effects

        .map(effect => {

            return `

                <div
                    class="effect-row">

                    ${effect.attribute}

                    +

                    ${effect.value}

                    ${effect.value_type}

                    (${effect.target})

                </div>

            `;
        })

        .join("");
}
function saveBuild(){

    save(
        "currentBuild",
        build
    );

    alert(
        "Build Saved"
    );
}
