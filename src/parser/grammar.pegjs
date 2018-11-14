{
  // Converts a JSON Form AST into valid JSON
  function processQuery(q) {
    return q.children
      ? Object.assign({
          [q.command]: q.children.length > 1
      	    ? q.children.map(c => processQuery(c))
            : processQuery(q.children[0])

      }, q.debug ? { $debug: true } : {})
      : { [q.command]: q.args }
  }
}

start = queries:Query+ {
  var out = [];
  // Find the immediate parent of each query
  queries.forEach((q1, i) => {
    // We reverse the list of queries in order to walk "back up" the query hierarchy
    var parent = [].concat(queries).reverse().find((q2, j) => {
      // The first query that preceeds `q1` with less `indent` is the parent
      return q2.indent < q1.indent && (queries.length - j - 1) < i;
    });
    // If a parent was found, add `q1` to its children
    if (parent) Object.assign(parent, { children: (parent.children || []).concat(q1) });
    // otherwise, `q1` is a root-level query
    else out.push(q1);
  });
  // Once `children` have been assigned correctly to each query, we flatten our tokens into
  // a valid JSON query format
  out = out.reduce((schema, q) => schema.concat(processQuery(q)), []);
  // If there's only one root-level query, return it, otherwise return the list
  return out.length > 1 ? out : out[0];
}

Query = indentation:Indentation? command:Expression (Whitespace* Comment / EOL / EOF) {
	return {
	  indent: indentation.length,
    command: command.name,
    args: command.args,
    debug: command.debug
  };
}

Expression = command:[$.a-z0-9]+ debug:"!"? arg:(Whitespace+ val:Argument { return val })? {
  return { name: command.join(''), args: arg, debug: !!debug }
}

Argument = String / Numeric / Boolean
Indentation = [ \s\t]*

String = val:(
  "'" v:AlphaNumeric+ "'" { return v.join('') } /
  '"' v:AlphaNumeric+ '"' {return v.join('') }
) { return val; }

AlphaNumeric = [.0-9a-zA-Z]
Numeric = v:[.0-9]+ { return parseFloat(v.join('')) }
Boolean = "true" / "false"
// Comments
Comment = "//" (!EOL .)*
EOL "end-of-line" = [\n\r\u2028\u2029]
Whitespace "whitespace" = "\t" / "\v" / "\f" / " " / "\u00A0" / "\uFEFF"
EOF "end-of-file" = !.