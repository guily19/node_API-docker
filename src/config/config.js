var config = {};

config.db = {
    name: 'samarco',
    host: 'localhost',
    port: 27017
}

config.pointSize = [2, 2, 2, 2, 2,           // levels 0 to 4
              2, 2, 2, 1.5, 1.8,       // levels 5 to 9
              2, 0.1, 0.1, 1.2, 0.6,   // levels 10 to 14
              1.0, 1.2, 1.6, 2.2, 2.8, // levels 15 to 19
              3, 3.2, 3.6, 4.2, 4.8    // levels 20 to 25
];

config.path_tile = './tiles'

module.exports = config;
