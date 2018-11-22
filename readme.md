GeoCraft
=====================
Minecraft world from GeoJson

### Steps
- Create GeoJson file
    I am using this site http://geojson.io/

![http://geojson.io/](https://raw.githubusercontent.com/YaroslavGaponov/geocraft/master/images/geojson.jpg "http://geojson.io/")

- Run NodeCraft server

```bash
npm init
npm run demo ~/Downloads/map.geojson
```
 or 

```bash
npm init
npm run demo
```

- Run Minecraft client

![nodecraft](https://raw.githubusercontent.com/YaroslavGaponov/geocraft/master/images/nodecraft.jpg "nodecraft")

### Server example

```javascript
const fs = require('fs');
const NodeCraft = require('nodecraft');
const GeoRender = require('..');

const GEOFILE  = process.argv.length > 2 ? process.argv.pop() : `${__dirname}/map.geojson`;

const game = new NodeCraft();
const render = new GeoRender(game.getLand());

console.log(`loading ${GEOFILE}...`);
const features = JSON.parse(fs.readFileSync(GEOFILE)).features;
console.log(`features ${features.length}`);
features.forEach(feature => render.add(feature));
console.log('done');

game.on('packet:handshake', (clientID, packet) => {
        const [x, z] = render.getBirthplace();

        with(game.getServer()) {
            login(clientID, {
                eid: 0,
                level_type: 'flat',
                game_mode: 1,
                dimension: 0,
                difficalty: 0,
                magic: 0,
                max_player: 25
            });
            spawn_position(clientID, {
                x,
                y: 30,
                z
            });
            player_position_and_look(clientID, {
                x,
                stance: 94.62,
                y: 30,
                z,
                yaw: 0,
                pitch: 0,
                on_ground: 1
            });
        }
    })
    .start(25565);
```