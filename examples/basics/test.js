




var script = `function foo() {
    


    console.log('called foo');
    console.log(new Error().stack);
}
foo();
//# sourceURL=my-foo-weiriu.js`;

eval(script);
