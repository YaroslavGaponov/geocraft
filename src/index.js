const pointsInPolygon = require('points-in-polygon');
const Type = require('./types');

class GeoRender {
    constructor(land) {
        this._land = land;
        this._birthplaces = [];
    }

    add(feature) {
        switch (feature.properties.type) {
            case Type.birthplace:
                this._birthplace(feature);
                break;
            case Type.building:
                this._building(feature);
                break;
            case Type.grass:
                this._grass(feature);
                break;
            case Type.road:
                this._road(feature);
                break;
            case Type.wall:
                this._wall(feature);
                break;
        }
    }

    static convert([lat, lon]) {
        const MAP_WIDTH = 40075.017 * 200;
        const MAP_HEIGHT = 40007.86 * 200;
        const y = ((-1 * lat) + 90) * (MAP_HEIGHT / 180);
        const x = (lon + 180) * (MAP_WIDTH / 360);
        return [Math.round(x), Math.round(y)];
    }

    getBirthplace() {
        const indx = Math.floor(Math.random() * this._birthplaces.length);
        return this._birthplaces[indx];
    }

    _birthplace(feature) {
        this._birthplaces.push(GeoRender.convert(feature.geometry.coordinates));
    }

    _building(feature) {
        const floor = feature.properties.floor || 9;
        pointsInPolygon(
            feature.geometry.coordinates.map(coor => coor.map(GeoRender.convert)),
            (x, z) => {
                for (let y = 1; y < floor; y++) {
                    this._land.setType(x, y, z, 'brick_block');
                }
            });
    }

    _grass(feature) {
        const things = ['sapling', 'leaves', 'yellow_flower', 'red_flower', 'red_mushroom'];
        pointsInPolygon(
            feature.geometry.coordinates.map(coor => coor.map(GeoRender.convert)),
            (x, z) => {
                this._land.setType(x, 0, z, 'grass');
                if (Math.random() > 0.8) {
                    this._land.setType(x, 1, z, things[Math.floor(Math.random() * things.length)]);
                }
            });
    }

    _road(feature) {
        pointsInPolygon(
            feature.geometry.coordinates.map(coor => coor.map(GeoRender.convert)),
            (x, z) => {
                this._land.setType(x, 0, z, 'stone');
            });
    }

    _wall(feature) {
        pointsInPolygon(
            feature.geometry.coordinates.map(coor => coor.map(GeoRender.convert)),
            (x, z) => {
                for (let y = 0; y < 3; y++) {
                    this._land.setType(x, y, z, 'planks');
                }
            });
    }
}

module.exports = GeoRender;