LDRLY Client-side AMD Wrapper
===========================

## Usage

Scripts under: `/js/libs/`

```js
require.config({
    baseUrl: "/js",

    paths: {
        ldrly:  "libs/ldrly-amd",
        vex:    "libs/vex.combined.min"
    }
});

define(['ldrly'], function(ldrly) {
    ldrly.init("{APP_NAMESPACE}", FB_UID, [FRIENDS_FB_UIDS]);
    ...
});
```
