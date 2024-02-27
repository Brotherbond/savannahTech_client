## Setup

NB: To run just the client side => clone repo, then run `npm install && npm run dev` in project terminal


* https://github.com/Brotherbond/savannahTech_client.git

* https://github.com/Brotherbond/savannahTech_server.git

* Clone the repositories above as client and  server respectively into one folder

* copy / Rename the .env.example to .env in the client, and server directories

* Update the environment variables  in the .env files as deem fit. Default provided

* Open a terminal from the server directory and run "docker compose up -d"

* inside the server container terminal, run "pnpm seeding:products" to seed database
