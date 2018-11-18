module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx", ".ts"] }],
  },
  "globals": { "fetch": false },
  "env": {
    "jest": true
  }
};
