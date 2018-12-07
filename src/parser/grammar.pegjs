start = ComplexQuery+

ComplexQuery =
  query:Query children:(q:ComplexQuery & { return q.indent > query.indent })+
    { return Object.assign(query, { children: children[0].filter(c => !!c) }) }
  / Query

Query "query" = indentation:Indentation? command:Expression Comment? (EOL / EOF) {
	return {
	  indent: indentation.length,
    command: command.name,
    args: command.args,
    debug: command.debug
  };
}

Expression "expression" = command:[$.a-z0-9]+ debug:"!"? arg:(Whitespace+ val:Argument { return val })? {
  return { name: command.join(''), args: arg, debug: !!debug }
}

Argument "argument" = String / Numeric / Boolean
Indentation "indent" = [ \s\t]*

String "string" = val:(
  "'" v:AlphaNumeric+ "'" { return v.join('') } /
  '"' v:AlphaNumeric+ '"' {return v.join('') }
) { return val; }

AlphaNumeric "alpha numeric" = [.0-9a-zA-Z]
Numeric "numeric" = v:[.0-9]+ { return parseFloat(v.join('')) }
Boolean "bool" = "true" / "false"
Comment "comment" = "//" (!EOL SourceCharacter)*
SourceCharacter "any char" = .
Whitespace "whitespace" = "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF"
EOL "end-of-line" = [\n\r\u2028\u2029]
EOF "end-of-file" = !.