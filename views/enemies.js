import { IdleAPI } from "../js/api.js";
import { save, load } from "../js/storage.js";

let enemies = [];

export async function renderEnemies(content) {

    content.innerHTML = `
        <div class="panel">

            <h2>Enemy Database</h2>

            <br>

            <input
                id="enemySearch"
                placeholder="Search enemies..."
            >

            <select id="locationFilter">
                <option value="">All Locations</option>
            </select>

            <br><br>

            <div id="enemyList"></div>

        </div>
    `;

    await loadEnemies();

    setupFilters();
}
async function loadEnemies() {

    const enemyList =
        document.getElementById("enemyList");

    enemyList.innerHTML =
        "<p>Loading enemies...</p>";

    try {

        const cached =
            load("enemyCache");

        if (cached) {

            enemies = cached;

            populateLocationFilter();

            renderEnemyCards(enemies);

            return;
        }

        const api =
            new IdleAPI(
                window.appState.apiKey
            );

        const data =
            await api.request(
                "/combat/enemies/list"
            );

        enemies = data.enemies;

        save("enemyCache", enemies);

        populateLocationFilter();

        renderEnemyCards(enemies);

    } catch (error) {

        enemyList.innerHTML = `
            <p>
                Failed to load enemies.
            </p>
        `;

        console.error(error);
    }
}
function populateLocationFilter() {

    const select =
        document.getElementById(
            "locationFilter"
        );

    const locations =
        [...new Set(
            enemies.map(
                e => e.location.name
            )
        )];

    locations.sort();

    locations.forEach(location => {

        const option =
            document.createElement(
                "option"
            );

        option.value = location;

        option.textContent = location;

        select.appendChild(option);
    });
}
function setupFilters() {

    document
        .getElementById(
            "enemySearch"
        )
        .addEventListener(
            "input",
            applyFilters
        );

    document
        .getElementById(
            "locationFilter"
        )
        .addEventListener(
            "change",
            applyFilters
        );
}
function applyFilters() {

    const search =
        document
        .getElementById(
            "enemySearch"
        )
        .value
        .toLowerCase();

    const location =
        document
        .getElementById(
            "locationFilter"
        )
        .value;

    let filtered =
        enemies.filter(enemy => {

            const matchesName =
                enemy.name
                .toLowerCase()
                .includes(search);

            const matchesLocation =
                !location ||
                enemy.location.name === location;

            return (
                matchesName &&
                matchesLocation
            );
        });

    renderEnemyCards(filtered);
}
function renderEnemyCards(enemyList) {

    const container =
        document.getElementById(
            "enemyList"
        );

    container.innerHTML = "";

    enemyList.forEach(enemy => {

        const lootHtml =
            enemy.loot
                .map(item => {

                    return `
                        <div class="loot-row">

                            <img
                                src="${item.image_url}"
                                width="32"
                            >

                            <span>
                                ${item.name}
                            </span>

                            <span>
                                ${item.chance}%
                            </span>

                        </div>
                    `;
                })
                .join("");

        container.innerHTML += `

            <div class="enemy-card">

                <div class="enemy-header">

                    <img
                        src="${enemy.image_url}"
                        class="enemy-image"
                    >

                    <div>

                        <h3>
                            ${enemy.name}
                        </h3>

                        <p>
                            Level ${enemy.level}
                        </p>

                        <p>
                            ${enemy.location.name}
                        </p>

                    </div>

                </div>

                <div class="enemy-stats">

                    <span>
                        HP:
                        ${enemy.health}
                    </span>

                    <span>
                        XP:
                        ${enemy.experience}
                    </span>

                    <span>
                        Loot:
                        ${enemy.chance_of_loot}%
                    </span>

                </div>

                <details>

                    <summary>
                        View Loot Table
                    </summary>

                    ${lootHtml}

                </details>

            </div>

        `;
    });
}
