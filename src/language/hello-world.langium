grammar HelloWorld

entry Model:
    elements+=Element*
;

Element: 
    Principals | Message
;

Principals:
    'principal' elements+=Principal (',' elements+=Principal)*
;

Principal:
    name=ID
;

Message:
    sender=[Principal:ID] 'sends' 'something'
;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;