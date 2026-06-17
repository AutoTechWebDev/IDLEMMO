export function renderDashboard(content){

    content.innerHTML = `

        <div class="panel">

            <h2>Dashboard</h2>

            <br>

            <label>API Key</label>

            <input
                id="apiKey"
                placeholder="Enter API Key"
            >

            <button
                class="primary"
                id="saveApi">

                Save API Key

            </button>

        </div>
    `;

    document
        .getElementById(
            "saveApi"
        )

        .addEventListener(
            "click",
            () => {

                window.appState.apiKey =
                    document
                    .getElementById(
                        "apiKey"
                    )
                    .value;

                alert(
                    "API Key Saved"
                );
            }
        );
}
