import hydratePage from '@reframe/browser/hydratePage';

console.log("before hydration");

(async () => {
    await hydratePage();

    console.log("after hydration");
})();
