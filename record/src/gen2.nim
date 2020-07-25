import os, unicode

let post_indir = "md"
let post_outdir = "posts"


type
  TokenKind = enum
    # forms of whitespace
    Space     = " "
    Linebreak = "\u{000A}"
    Tab       = "\u{0009}"
    Indent

    # multiuse token types
    ParenOpen   = "("
    ParenClose  = ")"
    BraceOpen   = "["
    BraceClose  = "]"

    Asterisk        = "*"
    DoubleAsterisk  = "**"
    Pound           = "#"
    Exclaim         = "!"
    RAngleBracket   = ">"
    Char
    Italics
    Bold
    Header1
    Header2
    Header3
    Header4
    Header5
    Header6
    Image
    Blockquote
    UList
    OList
    HRule
    CodeInline
    CodeBody
    Body


  Token = object
    pos: int
    kind: TokenKind



# let Grammar = {
#   Space: " ",
#   Linebreak: "0x0A",
# }


proc parseTokens(src: string): seq[Token] =
  var pos = 0
  var li  = 0
  var ch  = 0
  var rune_seq = toRunes(src)
  while pos < len(rune_seq) - 1:
    echo TokenKind(rune_seq[pos])


for kind, path in walkDir(post_indir):
  let file_str = readFile(path)
  let tokens = parseTokens(file_str)


assert $ParenOpen == "("