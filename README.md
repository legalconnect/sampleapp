# Sample Web App (React) integrated with LegalConnect API
### See [docs](https://staging.legalconnectonline.com/legalconnect-portal-developer/docs#/)

## Getting Started
1. Install libraries by running ```npm install```. Prerequisite is to have [Node](https://nodejs.org/en/download) installed on you dev machine
2. Generate your client credentials and specify your redirect urls on the [Developer portal](developer.legalconnectonline.com) and update the client_id and the redirect urls in the authConfig.ts file
    ``` TypeScript
    const authConfig: UserManagerSettings = {
    ...
    client_id: '', 
    redirect_uri: 'http://localhost:3000/callback',
    post_logout_redirect_uri: 'http://localhost:3000/',
    ...
    };
    ```
3. Then run ```npm run dev```


> NB:
> <br/>
> The react app was created using [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) 
> <br/>
> The API client services were generated using [hey-api/openapi-ts](https://heyapi.vercel.app/openapi-ts/get-started.html) library for a typescript axios client. 
> <br/>
> Bootstrap is the css library used and some of the default styling are overridden in the App.scss which is latter converted to App.css when running the dev script. See package.json


