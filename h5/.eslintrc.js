module.exports = {
    globals: {
        plus: "writable",
        uni: "writable"
    },
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential"
    ],
    "overrides": [],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "vue/no-mutating-props": "off",
        "vue/valid-v-slot": "off",
        "vue/multi-word-component-names": "off",
        "no-extra-boolean-cast": "off",
        "no-prototype-builtins": "off"
    }
}
