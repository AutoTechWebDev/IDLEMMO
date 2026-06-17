import { navigate }
from "../js/router.js";

export function renderSidebar(){

    const sidebar =
        document.getElementById(
            "sidebar"
        );

    sidebar.innerHTML = `

        <div class="logo">

            Idle MMO Toolkit

        </div>

        <button
            class="nav-btn"
            data-view="dashboard">

            Dashboard

        </button>

        <button
            class="nav-btn"
            data-view="enemies">

            Enemies

        </button>

        <button
            class="nav-btn"
            data-view="items">

            Items

        </button>

        <button
            class="nav-btn"
            data-view="builds">

            Builds

        </button>

        <button
            class="nav-btn"
            data-view="optimizer">

            Optimizer

        </button>
    `;

    sidebar
        .querySelectorAll(".nav-btn")

        .forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    navigate(
                        btn.dataset.view
                    );
                }
            );
        });
}
