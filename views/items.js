import { IdleAPI } from "../js/api.js";
import { save, load } from "../js/storage.js";

let searchResults = [];

export function renderItems(content){

    content.innerHTML = `

        <div class="panel">

            <h2>Item Database</h2>

            <br>

            <input
                id="itemSearch"
                placeholder="Search items..."
            >

            <button
                class="primary"
                id="searchBtn">

                Search

            </button>

            <br><br>

            <div id="itemResults"></div>

        </div>

        <div
            id="itemModal"
            class="modal hidden">

            <div class="modal-content">

                <button
                    id="closeModal">

                    Close

                </button>

                <div id="itemDetail"></div>

            </div>

        </div>
    `;

    document
        .getElementById("searchBtn")
        .addEventListener(
            "click",
            searchItems
        );

    document
        .getElementById("closeModal")
        .addEventListener(
            "click",
            closeModal
        );
}
async function searchItems(){

    const query =
        document
        .getElementById(
            "itemSearch"
        )
        .value;

    if(!query) return;

    const resultsDiv =
        document.getElementById(
            "itemResults"
        );

    resultsDiv.innerHTML =
        "<p>Searching...</p>";

    try{

        const api =
            new IdleAPI(
                window.appState.apiKey
            );

        const data =
            await api.request(
                `/item/search?query=${encodeURIComponent(query)}`
            );

        searchResults =
            data.items || [];

        renderResults();

    }catch(error){

        console.error(error);

        resultsDiv.innerHTML =
            "<p>Search failed.</p>";
    }
}
function renderResults(){

    const resultsDiv =
        document.getElementById(
            "itemResults"
        );

    resultsDiv.innerHTML = "";

    searchResults.forEach(item => {

        resultsDiv.innerHTML += `

            <div
                class="item-card"
                data-id="${item.hashed_id}">

                <img
                    src="${item.image_url}"
                    class="item-image">

                <div>

                    <h3>${item.name}</h3>

                    <p>${item.type}</p>

                    <p>${item.quality}</p>

                </div>

            </div>
        `;
    });

    document
        .querySelectorAll(".item-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    inspectItem(
                        card.dataset.id
                    );
                }
            );
        });
}
async function inspectItem(hashedId){

    const cacheKey =
        `item_${hashedId}`;

    let item =
        load(cacheKey);

    if(!item){

        const api =
            new IdleAPI(
                window.appState.apiKey
            );

        const response =
            await api.request(
                `/item/${hashedId}/inspect`
            );

        item = response.item;

        save(cacheKey,item);
    }

    renderItemModal(item);
}
function renderItemModal(item){

    const detail =
        document.getElementById(
            "itemDetail"
        );

    detail.innerHTML = `

        <h2>${item.name}</h2>

        <img
            src="${item.image_url}"
            class="detail-image"
        >

        <p>
            ${item.description || ""}
        </p>

        <hr>

        <h3>Requirements</h3>

        ${renderRequirements(item)}

        <h3>Stats</h3>

        ${renderStats(item)}

        <h3>Effects</h3>

        ${renderEffects(item)}

        <h3>Where To Find</h3>

        ${renderSources(item)}

    `;

    document
        .getElementById(
            "itemModal"
        )
        .classList.remove(
            "hidden"
        );
}
function renderRequirements(item){

    if(!item.requirements)
        return "<p>None</p>";

    return Object.entries(
        item.requirements
    )

    .map(([key,val]) => {

        return `
            <p>
                ${key}: ${val}
            </p>
        `;
    })

    .join("");
}
function renderStats(item){

    if(!item.stats)
        return "<p>No stats</p>";

    return Object.entries(
        item.stats
    )

    .map(([key,val]) => {

        return `
            <p>
                ${key}: ${val}
            </p>
        `;
    })

    .join("");
}
function renderEffects(item){

    if(!item.effects?.length)
        return "<p>No effects</p>";

    return item.effects

        .map(effect => {

            return `

                <p>

                    ${effect.attribute}

                    +

                    ${effect.value}

                    ${effect.value_type}

                    (${effect.target})

                </p>

            `;
        })

        .join("");
}
function renderSources(item){

    if(!item.where_to_find)
        return "<p>Unknown</p>";

    let html = "";

    const sources =
        item.where_to_find;

    if(sources.enemies?.length){

        html += `
            <h4>Enemies</h4>
        `;

        sources.enemies.forEach(e => {

            html += `
                <p>
                    ${e.name}
                    (Lv ${e.level})
                </p>
            `;
        });
    }

    if(sources.dungeons?.length){

        html += `
            <h4>Dungeons</h4>
        `;

        sources.dungeons.forEach(d => {

            html += `
                <p>${d.name}</p>
            `;
        });
    }

    if(sources.world_bosses?.length){

        html += `
            <h4>World Bosses</h4>
        `;

        sources.world_bosses.forEach(b => {

            html += `
                <p>${b.name}</p>
            `;
        });
    }

    return html;
}
function closeModal(){

    document
        .getElementById(
            "itemModal"
        )
        .classList.add(
            "hidden"
        );
}
