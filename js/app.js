import { renderSidebar } from "../components/sidebar.js";
import { navigate } from "./router.js";

window.appState = {

    apiKey: "",

    currentView: "dashboard",

    cache: {}
};

renderSidebar();

navigate("dashboard");
