//convienence function(src, [options]);
function uglify(orig_code, options){
  options || (options = {});
  var jsp = uglify.parser;
  var pro = uglify.uglify;

  var ast = jsp.parse(orig_code, options.strict_semicolons); // parse code and get the initial AST
  ast = pro.ast_mangle(ast, options.mangle_options); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast, options.squeeze_options); // get an AST with compression optimizations
  var final_code = pro.gen_code(ast, options.gen_options); // compressed code here
  return final_code;
};

uglify.parser = require("./lib/parse-js");
uglify.uglify = require("./lib/process");
uglify.consolidator = require("./lib/consolidator");

module.exports = uglify


// nodejs require extension for *.jsr files.
// usage: require('uglify-js');

console.log("installing .jsr extension");

var fs = require('fs');
require.extensions['.jsr'] = function(module, filename) {
  console.log("JSR", filename);
  var content = stripBOM(fs.readFileSync(filename, 'utf8'));
  var ast = uglify.parser.parse(content, false); // parse (strict_semicolons=false)
  var code = uglify.uglify.gen_code(ast, {}); // generate code
  console.log(code);
  module._compile(code, filename);
};

function stripBOM(content) {
  // Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
  // because the buffer-to-string conversion in `fs.readFileSync()`
  // translates it to FEFF, the UTF-16 BOM.
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}
