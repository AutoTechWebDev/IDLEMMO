import { load } from "../js/storage.js";

export function renderOptimizer(content){

    const build =
        load("currentBuild");

    content.innerHTML = `

        <div class="grid grid-2">

            <div class="panel">

                <h2>Build Scores</h2>

                <div id="buildScores"></div>

            </div>

            <div class="panel">

                <h2>Enemy Rankings</h2>

                <div id="enemyRankings"></div>

            </div>

        </div>
    `;

    calculateBuildScores(build);

    calculateEnemyRankings();
}
function calculateBuildScores(build){

    const container =
        document.getElementById(
            "buildScores"
        );

    if(!build){

        container.innerHTML =
            "<p>No build loaded.</p>";

        return;
    }

    const stats =
        aggregateStats(build);

    const scores = {

        damage:
            scoreDamage(stats),

        accuracy:
            scoreAccuracy(stats),

        crit:
            scoreCrit(stats),

        farming:
            scoreFarming(stats)
    };

    container.innerHTML = `

        <div class="score-row">

            Damage Build

            <strong>
                ${scores.damage}
            </strong>

        </div>

        <div class="score-row">

            Accuracy Build

            <strong>
                ${scores.accuracy}
            </strong>

        </div>

        <div class="score-row">

            Crit Build

            <strong>
                ${scores.crit}
            </strong>

        </div>

        <div class="score-row">

            Farming Build

            <strong>
                ${scores.farming}
            </strong>

        </div>
    `;
}
function aggregateStats(build){

    const totals = {};

    Object.values(build)

        .filter(Boolean)

        .forEach(item => {

            if(!item.stats)
                return;

            Object.entries(item.stats)

                .forEach(([key,val]) => {

                    totals[key] =
                        (totals[key] || 0)
                        + val;

                });
        });

    return totals;
}
function scoreDamage(stats){

    return (

        (stats.damage || 0)

        +

        (stats.accuracy || 0) * 0.5

        +

        (stats.crit_chance || 0) * 2

        +

        (stats.crit_damage || 0) * 0.25

    ).toFixed(2);
}
function scoreAccuracy(stats){

    return (

        (stats.accuracy || 0)

        +

        (stats.agility || 0) * 0.25

    ).toFixed(2);
}
function scoreCrit(stats){

    return (

        (stats.crit_chance || 0) * 4

        +

        (stats.crit_damage || 0)

    ).toFixed(2);
}
function scoreFarming(stats){

    return (

        (stats.damage || 0)

        +

        (stats.accuracy || 0)

        +

        (stats.agility || 0)

    ).toFixed(2);
}
function calculateEnemyRankings(){

    const container =
        document.getElementById(
            "enemyRankings"
        );

    const enemies =
        load("enemyCache") || [];

    if(!enemies.length){

        container.innerHTML =
            "<p>No enemy data.</p>";

        return;
    }

    const ranked =
        enemies

        .map(enemy => {

            return {

                ...enemy,

                xpEfficiency:

                    enemy.experience /
                    enemy.health,

                lootEfficiency:

                    (
                        enemy.chance_of_loot /
                        enemy.health
                    )
            };
        })

        .sort(
            (a,b)=>

                b.xpEfficiency
                -
                a.xpEfficiency
        )

        .slice(0,10);
    container.innerHTML =

        ranked

        .map(enemy => {

            return `

                <div
                    class="ranking-row">

                    <div>

                        <strong>

                            ${enemy.name}

                        </strong>

                        <br>

                        Lv ${enemy.level}

                    </div>

                    <div>

                        XP/HP:

                        ${enemy.xpEfficiency.toFixed(2)}

                    </div>

                </div>

            `;
        })

        .join("");
}
