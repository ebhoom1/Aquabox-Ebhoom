// client/workbox-config.js
module.exports = {
    globDirectory: "build/",
    globPatterns: ["**/*.{html,json,css,js,png,jpg}"],
    swDest: "build/service-worker.js",
    swSrc: "public/service-worker.js"
  };
  