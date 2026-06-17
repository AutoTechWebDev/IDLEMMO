import { renderDashboard }
from "../views/dashboard.js";

import { renderEnemies }
from "../views/enemies.js";

import { renderItems }
from "../views/items.js";

import { renderBuilds }
from "../views/builds.js";

import { renderOptimizer }
from "../views/optimizer.js";

export function navigate(view){

    window.appState.currentView = view;

    const content =
        document.getElementById(
            "content"
        );

    switch(view){

        case "dashboard":

            renderDashboard(content);
            break;

        case "enemies":

            renderEnemies(content);
            break;

        case "items":

            renderItems(content);
            break;

        case "builds":

            renderBuilds(content);
            break;

        case "optimizer":

            renderOptimizer(content);
            break;
    }

    document
        .querySelectorAll(".nav-btn")

        .forEach(btn => {

            btn.classList.remove("active");

            if(
                btn.dataset.view === view
            ){
                btn.classList.add(
                    "active"
                );
            }
        });
}
