const API_BASE =
    "https://api.idle-mmo.com/v1";

export class IdleAPI{

    constructor(apiKey){

        this.apiKey = apiKey;
    }

    async request(endpoint){

        const response =
            await fetch(
                API_BASE + endpoint,
                {
                    headers:{
                        Authorization:
                        `Bearer ${this.apiKey}`,

                        Accept:
                        "application/json",

                        "User-Agent":
                        "IdleMMOToolkit/1.0"
                    }
                }
            );

        if(!response.ok){

            throw new Error(
                `API Error ${response.status}`
            );
        }

        return await response.json();
    }
}
