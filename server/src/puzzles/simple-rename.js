module.exports.start = `function () {
    const BarContainer = styled\`
        width: 100%;
        padding: 0 20px;
    \`;
    const Bar = (props) => (
        <BarContainer>
            <h1>foo {props.bar}</h1>
        </BarContainer>
    );
};`

module.exports.end = `function () {
    const FooContainer = styled\`
        width: 100%;
        padding: 0 20px;
    \`;
    const Foo = (props) => (
        <FooContainer>
            <h1>bar {props.foo}</h1>
        </FooContainer>
    );
};`
