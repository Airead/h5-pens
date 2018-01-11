module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            2,
            4
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            0,
        ],
        "no-console": [0],
        "comma-dangle": [0],
        "no-unused-vars": [1]
    },
    "env": {
        "es6": true,
        "node": true,
        "browser": true
    },
    "globals": {
        "Vue": true,
        "d3": true,
    }
};
