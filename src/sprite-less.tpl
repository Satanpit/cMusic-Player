.{{mixin}}{{^hasCommon}}(){{/hasCommon}} {
    background: url({{{sprite}}}?{{#hash}}{{{sprite}}}{{/hash}}) no-repeat;
}

{{#shapes}}{{#selector.shape}}{{expression}}{{^last}},
{{/last}}{{/selector.shape}} {
    {{^hasCommon}}.{{mixin}}();
{{/hasCommon}}
    background-position: {{position.relative.xy}};
    width: {{width.outer}}px;
    height: {{height.outer}}px;
    display: inline-block;
    vertical-align: middle;
}

{{/shapes}}