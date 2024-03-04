/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => LingGlossPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian = require("obsidian");

// src/models/command.ts
var CommandType = /* @__PURE__ */ ((CommandType2) => {
  CommandType2[CommandType2["ex"] = 0] = "ex";
  CommandType2[CommandType2["ft"] = 1] = "ft";
  CommandType2[CommandType2["gla"] = 2] = "gla";
  CommandType2[CommandType2["glb"] = 3] = "glb";
  CommandType2[CommandType2["glc"] = 4] = "glc";
  CommandType2[CommandType2["gl"] = 5] = "gl";
  CommandType2[CommandType2["num"] = 6] = "num";
  CommandType2[CommandType2["set"] = 7] = "set";
  return CommandType2;
})(CommandType || {});
var SetOptionType = /* @__PURE__ */ ((SetOptionType2) => {
  SetOptionType2[SetOptionType2["style"] = 0] = "style";
  SetOptionType2[SetOptionType2["exstyle"] = 1] = "exstyle";
  SetOptionType2[SetOptionType2["ftstyle"] = 2] = "ftstyle";
  SetOptionType2[SetOptionType2["glastyle"] = 3] = "glastyle";
  SetOptionType2[SetOptionType2["glbstyle"] = 4] = "glbstyle";
  SetOptionType2[SetOptionType2["glcstyle"] = 5] = "glcstyle";
  SetOptionType2[SetOptionType2["glxstyle"] = 6] = "glxstyle";
  SetOptionType2[SetOptionType2["glaspaces"] = 7] = "glaspaces";
  return SetOptionType2;
})(SetOptionType || {});

// src/models/gloss-data.ts
var initGlossElement = () => ({
  levelA: "",
  levelB: "",
  levelC: "",
  nlevels: []
});
var initGlossLineStyle = () => ({
  classes: []
});
var initGlossData = () => ({
  label: "",
  preamble: "",
  elements: [],
  translation: "",
  options: {}
});

// src/token-functions.ts
var stripIndent = (input) => {
  var _a, _b;
  const minIndent = (_b = (_a = input.match(/^\s*(?=\S)/gm)) == null ? void 0 : _a.reduce((a, x) => Math.min(a, x.length), Infinity)) != null ? _b : 0;
  if (minIndent > 0) {
    const regex = new RegExp(`^\\s{${minIndent}}`, "gm");
    return input.replace(regex, "");
  }
  return input;
};
var gatherLines = (input) => {
  const outLines = [];
  const lineBuf = [];
  const trInput = stripIndent(input);
  for (const line of trInput.split(/\n+/)) {
    if (!/^\s+/.test(line)) {
      if (lineBuf.length > 0) {
        outLines.push(lineBuf.join(" "));
      }
      lineBuf.length = 0;
    }
    const trLine = line.trim();
    if (trLine.length > 0) {
      lineBuf.push(trLine);
    }
  }
  if (lineBuf.length > 0) {
    outLines.push(lineBuf.join(" "));
  }
  return outLines;
};
var tokenizeLine = (line) => {
  const outTokens = [];
  const tokenBuf = [];
  const makeErrorPos = () => {
    var _a, _b;
    return [(_b = (_a = outTokens.last()) == null ? void 0 : _a.text) != null ? _b : "", tokenBuf.join("")].filter((x) => x.length > 0).join(" ");
  };
  let isBracket = false;
  let isEscape = false;
  for (const char of line.trim()) {
    if (char === "^" && !isEscape) {
      isEscape = true;
      continue;
    }
    if (isEscape) {
      switch (char) {
        case "[":
        case "]":
        case "^":
          tokenBuf.push(char);
          isEscape = false;
          break;
        default:
          tokenBuf.push("^");
          tokenBuf.push(char);
          isEscape = false;
          break;
      }
    } else if (isBracket) {
      switch (char) {
        case "[":
          throw `invalid \u201C[\u201D found around \u201C${makeErrorPos()}\u201D`;
        case "]":
          outTokens.push({
            type: 1 /* Bracketed */,
            text: tokenBuf.join("")
          });
          tokenBuf.length = 0;
          isBracket = false;
          break;
        default:
          tokenBuf.push(char);
          break;
      }
    } else {
      switch (char) {
        case "]":
          throw `invalid \u201C]\u201D found around \u201C${makeErrorPos()}\u201D`;
        case "[":
        case " ":
        case "	":
          if (tokenBuf.length > 0) {
            outTokens.push({
              type: 0 /* Simple */,
              text: tokenBuf.join("")
            });
          }
          tokenBuf.length = 0;
          isBracket = char == "[";
          break;
        default:
          tokenBuf.push(char);
          break;
      }
    }
  }
  if (isBracket)
    throw `a \u201C[\u201D without matching \u201C]\u201D found around \u201C${makeErrorPos()}\u201D`;
  if (tokenBuf.length > 0) {
    outTokens.push({
      type: 0 /* Simple */,
      text: tokenBuf.join("")
    });
  }
  return outTokens;
};
var makeTokenError = (tokens) => {
  const maxlen = 20;
  const text = tokens.slice(0, 2).map((t) => t.text).join(" ");
  if (text.length <= maxlen)
    return text;
  return text.substring(0, maxlen).trim() + "\u2026";
};

// src/parse-functions.ts
var iterateParser = (tokens, parser, callback) => {
  while (tokens.length > 0) {
    const [item, remainder] = parser(tokens);
    if (item == null)
      return remainder;
    callback(item);
    tokens = remainder;
  }
  return null;
};
var isSimple = (tokens, index = 0) => {
  var _a;
  return ((_a = tokens[index]) == null ? void 0 : _a.type) === 0 /* Simple */;
};
var gatherBracketed = (tokens, start = 1) => {
  var _a;
  let index = start;
  while (((_a = tokens[index]) == null ? void 0 : _a.type) === 1 /* Bracketed */) {
    index += 1;
  }
  return tokens.slice(start, index);
};
var isComment = (tokens) => isSimple(tokens) && tokens[0].text.startsWith("#");
var getCommand = (tokens) => {
  if (!isSimple(tokens))
    return [null, tokens];
  const match = tokens[0].text.match(/^\\(.+)$/);
  if (match == null)
    return [null, tokens];
  const cmdText = match[1];
  const cmdType = CommandType[cmdText.toLowerCase()];
  const command = {
    text: cmdText,
    type: cmdType != null ? cmdType : null,
    params: tokens.slice(1)
  };
  return [command, []];
};
var getCombinedElement = (tokens) => {
  var _a, _b;
  if (!isSimple(tokens))
    return [null, tokens];
  const levels = gatherBracketed(tokens).map((x) => x.text);
  const element = {
    levelA: tokens[0].text,
    levelB: (_a = levels[0]) != null ? _a : "",
    levelC: (_b = levels[1]) != null ? _b : "",
    nlevels: levels.slice(2)
  };
  return [element, tokens.slice(levels.length + 1)];
};
var getSetOption = (tokens) => {
  if (!isSimple(tokens))
    return [null, tokens];
  const optText = tokens[0].text;
  const optType = SetOptionType[optText.toLowerCase()];
  const option = {
    text: optText,
    type: optType != null ? optType : null,
    values: tokens.slice(1).map((x) => x.text)
  };
  return [option, []];
};

// src/gloss-parser.ts
var GlossStrings = {
  [0 /* ex */]: "preamble",
  [1 /* ft */]: "translation",
  [6 /* num */]: "label"
};
var GlossLevels = {
  [2 /* gla */]: "levelA",
  [3 /* glb */]: "levelB",
  [4 /* glc */]: "levelC"
};
var GlossLineStyles = {
  [0 /* style */]: "global",
  [1 /* exstyle */]: "preamble",
  [2 /* ftstyle */]: "translation",
  [3 /* glastyle */]: "levelA",
  [4 /* glbstyle */]: "levelB",
  [5 /* glcstyle */]: "levelC",
  [6 /* glxstyle */]: "nlevels",
  [7 /* glaspaces */]: "levelA"
};
var GlossParser = class {
  constructor(options) {
    this.errorMessages = [];
    var _a;
    this.isNlevel = (_a = options == null ? void 0 : options.nlevel) != null ? _a : false;
  }
  errors() {
    return this.errorMessages;
  }
  parse(input) {
    this.glossData = initGlossData();
    this.errorMessages = [];
    for (const line of gatherLines(input)) {
      try {
        const tokens = tokenizeLine(line);
        if (isComment(tokens))
          continue;
        const errTokens = iterateParser(tokens, getCommand, (cmd) => this.parseCommand(cmd));
        if (errTokens != null)
          throw `don't know what to do with \u201C${makeTokenError(errTokens)}\u201D`;
      } catch (err) {
        this.errorMessages.push(err);
      }
    }
    return this.glossData;
  }
  parseCommand({ text, type, params }) {
    switch (type) {
      case 0 /* ex */:
      case 1 /* ft */:
      case 6 /* num */:
        this.parseStringField(params, GlossStrings[type]);
        break;
      case 2 /* gla */:
      case 3 /* glb */:
      case 4 /* glc */:
        if (this.isNlevel)
          throw `command \u201C${text}\u201D can't be used in nlevel mode`;
        this.parseGlossElement(params, GlossLevels[type]);
        break;
      case 5 /* gl */:
        if (!this.isNlevel)
          throw `command \u201C${text}\u201D can't be used in regular mode`;
        this.parseCombinedElements(params);
        break;
      case 7 /* set */:
        this.parseOptionsList(params);
        break;
      default:
        throw `command \u201C${text}\u201D is not known`;
    }
  }
  parseSetOption({ text, type, values }) {
    switch (type) {
      case 0 /* style */:
      case 1 /* exstyle */:
      case 2 /* ftstyle */:
      case 3 /* glastyle */:
      case 4 /* glbstyle */:
      case 5 /* glcstyle */:
      case 6 /* glxstyle */:
        this.setLineStyleClasses(values, GlossLineStyles[type]);
        break;
      case 7 /* glaspaces */:
        this.setLineStyleValue(true, GlossLineStyles[type], "altSpaces");
        break;
      default:
        throw `option \u201C${text}\u201D is not known`;
    }
  }
  parseStringField(params, key) {
    if (params.length < 1)
      throw `no value provided for \u201C${key}\u201D`;
    this.glossData[key] = params.map((t) => t.text).join(" ");
  }
  parseGlossElement(params, key) {
    var _a, _b;
    const elements = this.glossData.elements;
    while (elements.length < params.length) {
      elements.push(initGlossElement());
    }
    for (let ix = 0; ix < elements.length; ix += 1) {
      elements[ix][key] = (_b = (_a = params[ix]) == null ? void 0 : _a.text) != null ? _b : "";
    }
  }
  parseCombinedElements(params) {
    const elements = this.glossData.elements;
    elements.length = 0;
    const errTokens = iterateParser(params, getCombinedElement, (elem) => elements.push(elem));
    if (errTokens != null)
      throw `don't know how to parse ${makeTokenError(errTokens)}`;
  }
  parseOptionsList(params) {
    const options = [];
    const errTokens = iterateParser(params, getSetOption, (opt) => options.push(opt));
    if (errTokens != null)
      throw `don't know how to parse ${makeTokenError(errTokens)}`;
    options.forEach((opt) => this.parseSetOption(opt));
  }
  setLineStyleClasses(values, section) {
    if (values.length < 1)
      throw `no values provided for \u201C${section}\u201D`;
    const invalid = values.find((x) => !/^[a-z0-9-]+$/i.test(x));
    if (invalid != null)
      throw `\u201C${invalid}\u201D isn't a valid style name`;
    this.setLineStyleValue(values, section, "classes");
  }
  setLineStyleValue(value, section, field) {
    var _a, _b;
    const option = (_b = (_a = this.glossData.options)[section]) != null ? _b : _a[section] = initGlossLineStyle();
    option[field] = value;
  }
};

// src/gloss-printer.ts
var withNbsp = (text) => text.replace(/\s+/g, "\xA0");
var textOrNbsp = (text, style) => {
  if (text.length < 1)
    return "\xA0";
  if (style == null ? void 0 : style.altSpaces) {
    text = text.replace(/[_]+/g, "\xA0");
  }
  return withNbsp(text);
};
var styleClasses = (style) => {
  var _a;
  return (_a = style == null ? void 0 : style.classes.filter((x) => x.length > 0).map((x) => `ling-style-${x}`)) != null ? _a : [];
};
var glossPrinter = (gloss, dest) => {
  var _a, _b, _c;
  const container = dest.createDiv({ cls: "ling-gloss" });
  const label = container.createDiv({ cls: "ling-gloss-label" });
  label.innerText = withNbsp(gloss.label);
  const body = container.createDiv({ cls: "ling-gloss-body" });
  body.addClasses(styleClasses(gloss.options.global));
  if (((_a = gloss.preamble) == null ? void 0 : _a.length) > 0) {
    const preamble = body.createDiv({ cls: "ling-gloss-preamble" });
    preamble.innerText = gloss.preamble;
    preamble.addClasses(styleClasses(gloss.options.preamble));
  }
  if (gloss.elements.length > 0) {
    const elements = body.createDiv({ cls: "ling-gloss-elements" });
    const hasLevelB = gloss.elements.some((el) => {
      var _a2;
      return ((_a2 = el.levelB) == null ? void 0 : _a2.length) > 0;
    });
    const hasLevelC = gloss.elements.some((el) => {
      var _a2;
      return ((_a2 = el.levelC) == null ? void 0 : _a2.length) > 0;
    });
    const maxNlevel = gloss.elements.reduce((acc, el) => Math.max(acc, el.nlevels.length), 0);
    for (const glelem of gloss.elements) {
      const element = elements.createDiv({ cls: "ling-gloss-element" });
      const levelA = element.createDiv({ cls: "ling-gloss-level-a" });
      levelA.innerText = textOrNbsp(glelem.levelA, gloss.options.levelA);
      levelA.addClasses(styleClasses(gloss.options.levelA));
      if (hasLevelB) {
        const levelB = element.createDiv({ cls: "ling-gloss-level-b" });
        levelB.innerText = textOrNbsp(glelem.levelB);
        levelB.addClasses(styleClasses(gloss.options.levelB));
      }
      if (hasLevelC) {
        const levelC = element.createDiv({ cls: "ling-gloss-level-c" });
        levelC.innerText = textOrNbsp(glelem.levelC);
        levelC.addClasses(styleClasses(gloss.options.levelC));
      }
      for (let index = 0; index < maxNlevel; index += 1) {
        const levelX = element.createDiv({ cls: "ling-gloss-level-x" });
        levelX.innerText = textOrNbsp((_b = glelem.nlevels[index]) != null ? _b : "");
        levelX.addClasses(styleClasses(gloss.options.nlevels));
      }
    }
  }
  if (((_c = gloss.translation) == null ? void 0 : _c.length) > 0) {
    const translation = body.createDiv({ cls: "ling-gloss-translation" });
    translation.innerText = gloss.translation;
    translation.addClasses(styleClasses(gloss.options.translation));
  }
  if (!body.hasChildNodes()) {
    errorPrinter(["the gloss is empty, there's nothing to display"], dest);
  }
};
var errorPrinter = (messages, dest) => {
  for (const msg of messages) {
    const error = dest.createDiv({ cls: "ling-gloss-error" });
    error.innerText = msg;
  }
};

// src/main.ts
var LingGlossPlugin = class extends import_obsidian.Plugin {
  onload() {
    this.registerMarkdownCodeBlockProcessor("gloss", (src, el, _) => this.processGlossMarkdown(src, el, false));
    this.registerMarkdownCodeBlockProcessor("ngloss", (src, el, _) => this.processGlossMarkdown(src, el, true));
  }
  processGlossMarkdown(source, el, nlevel) {
    const parser = new GlossParser({ nlevel });
    const gloss = parser.parse(source);
    glossPrinter(gloss, el);
    errorPrinter(parser.errors(), el);
  }
};
