import os, times, htmlparser, xmltree, strtabs, strutils, algorithm, sugar
import markdown


let mdDir = "md"
let entryDir = "entries"
let templatePath = "html"/"template.html"
let mdConfig = initCommonmarkConfig()


let templateXml = loadHtml(templatePath)
var indexXml = deepCopy(templateXml)

# create entry list node
var entryListNode = newElement("ul")
entryListNode.attrs = toXmlAttributes(("class", "entries"))

for node in indexXml.findAll("title"):
  node.add(newText("record"))
  break

for node in indexXml.findAll("section"):
  if node.attrs.getOrDefault("id") == "content":
    node.add(entryListNode)
    break


var entryNodes: seq[(XmlNode, Time)]

for kind,md in walkDir(mdDir):
  # get md file data
  let mdName = splitFile(md).name
  let mdCreationTime = getCreationTime(md)
  let mdSrc = readFile(md)
  let mdHtml = markdown(mdSrc, mdConfig)
  let mdXml = parseHtml(mdHtml)
  let mdTitleNode = child(mdXml, "h1")
  mdXml.tag = "section"
  mdXml.attrs = toXmlAttributes(("class","markdown"))

  # create entry xml
  let entryXml = deepCopy(templateXml)
  let entryName = if mdTitleNode != nil: innerText(mdTitleNode) else: "untitled entry"
  let entryFilePath = entryDir / mdName & ".html"

  for node in entryXml.findAll("title"):
    node.add(newText(entryName))
    break
  
  for node in entryXml.findAll("section"): 
    if node.attrs.getOrDefault("id") == "content":
      node.add(mdXml)
      break

  var entryOutput = multiReplace($child(entryXml, "html"), (">  ", ">")) # toString bug in nim's xmltree module
  writeFile(entryFilePath, entryOutput)

  # add entry list item to index
  var entryNode = newElement("li")
  entryNode.attrs = toXmlAttributes(("class", "entry"))
  var entryTitleNode = newElement("a")
  entryTitleNode.attrs = toXmlAttributes(("href", entryDir&"/"&mdName&".html"))
  entryTitleNode.add(newText(entryName))
  var entryDateNode = newElement("span")
  entryDateNode.add(newText(format(mdCreationTime, "dd'.'M'.'yy")))
  
  entryNode.add(entryTitleNode)
  entryNode.add(entryDateNode)
  entryNodes.add (entryNode, mdCreationTime)
  # entryListNode.add(entryNode)


entryNodes.sort do (x, y: (XmlNode, Time)) -> int: 
  result = cmp(y[1], x[1])

for node in entryNodes:
  entryListNode.add(node[0])

# create index file
writeFile("index.html", $child(indexXml, "html"))