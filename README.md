# Start the Server

To start the server, run,

```
npm run dev
```

```JSON
  "scripts": {
    "dev": "vite",              <-- This will run this
    ...
  }
```

# Architecture

## React

This project was created using Vite and uses React to create the UI. Ideally, all components were created using function based components instead of class based components as reccomendation on the React documentation.

## TypeScript

TypeScript is utilized instead of vanilla JavaScript. The decision was made to use TypeScript as typed languages can be easier to debug than dynamically typed languages.


##  CSS

Tailwind CSS and Daisy UI is utilized for styling widgets and using common widgets.

`styled components` was used to allow for quick use of creating css applied to html components. The syntax using a backtick followed by the applied CSS and then using another backtick to close it, e.g.

```JavaScript
import styled from "styled-components";

const Seperator = styled.div`       <-- Notice the `
  border-top: 2px solid #dadde1;
  margin: 20px 16px;
  width: 100%;
`                                   <-- and closing `
```

# Authorization

Firebase is used to deal with the process of account creation, logging the user in, etc. When the user successfully logins we receive a JWT (JSON Web Token) from [Firebase](https://firebase.google.com/docs/auth/admin/verify-id-tokens#retrieve_id_tokens_on_clients), this is referred to as the "ID token". This ID Token uniquely identifies a user and grants them access to resources from our backend. The JWT also contains information about the user such as the UID, this is utilized on the backend. Losing the ID Token can lead to session hijacking and it is crucial to not expose this information.

- Firebase is initialized by importing `firebase.ts` inside of `main.tsx`.

- All of the Authorzation logic is encapsulated inside of `AuthContext.tsx`.

- Additional creation of calls to the Firebase API need to be defined inside of `services/FireBaseUtils.ts`.