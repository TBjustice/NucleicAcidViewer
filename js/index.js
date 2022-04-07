let svg;
const nucleicAcid = new NucleicAcid();
const restrictionEnzymes = new RestrictionEnzymes();
let key_flag = {};
function onLoad() {
    svg = document.getElementById("svg");
    onResize();
}

function onResize() {
    const size = Math.min(window.innerHeight, window.innerWidth * 0.6 / 1.41421356);
    svg.setAttribute("width", (size * 1.41421356) + "px");
    svg.setAttribute("height", size + "px");
}

function readFile(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => { resolve(reader.result); };
        reader.onerror = () => { reject(reader.error); };
        reader.readAsText(blob);
    });
}

function drawMap() {
    const result = restrictionEnzymes.cut(nucleicAcid);
    svgtext = "";
    let keys = Object.keys(result);
    let len = nucleicAcid.sequence.length;
    innerRing = new Placer();
    outerRing = new Placer();
    //**************************************************************************
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (key_flag[key] == 1) {
            for (let j = 0; j < result[key].length; j++) {
                innerRing.add(key, result[key][j] / len);
            }
        }
        else if (key_flag[key] == 2 || key_flag[key] == 3) {
            for (let j = 0; j < result[key].length; j++) {
                outerRing.add(key, result[key][j] / len);
            }
        }
    }
    if (nucleicAcid.type == "plasmid" || nucleicAcid.type == "circular") {
        innerRing.space = 0.01;
        outerRing.space = 0.005;
        innerRing.run(true);
        outerRing.run(true);

        svg.setAttribute("viewBox", "-100 -100 283 200");
        svgtext += SVG.text(nucleicAcid.name, 0, 0, { "font-size": "8", "text-anchor": "middle" });
        svgtext += SVG.text(nucleicAcid.name, 0, 0, { "font-size": "8", "text-anchor": "middle" });
        svgtext += SVG.text("" + nucleicAcid.sequence.length + "Bp", 0, 10, { "font-size": "7", "text-anchor": "middle" });
        svgtext += SVG.circle(0, 0, 60, { "fill": "none", "stroke": "black", "stroke-width": "2" });

        for (data of innerRing.data) {
            let x = 48 * Math.sin(data.place2 * Math.PI * 2);
            let y = -48 * Math.cos(data.place2 * Math.PI * 2);

            let x1 = 60 * Math.sin(data.place1 * Math.PI * 2);
            let y1 = -60 * Math.cos(data.place1 * Math.PI * 2);
            let x2 = 53 * Math.sin(data.place1 * Math.PI * 2);
            let y2 = -53 * Math.cos(data.place1 * Math.PI * 2);
            let x3 = 50 * Math.sin(data.place2 * Math.PI * 2);
            let y3 = -50 * Math.cos(data.place2 * Math.PI * 2);

            svgtext += SVG.text(data.name + ":" + Math.floor(data.place1 * len + 1.02), x, y, { "font-size": "2.3", "text-anchor": "end", "dominant-baseline": "central", "transform": "rotate(" + (data.place2 * 360 - 90) + " " + x + "," + y + ")" });
            svgtext += SVG.line(x1, y1, x2, y2, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x2, y2, x3, y3, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x3, y3, x, y, { "stroke": "black", "stroke-width": "0.1" });
        }
        for (data of outerRing.data) {
            let x = 74 * Math.sin(data.place2 * Math.PI * 2);
            let y = -74 * Math.cos(data.place2 * Math.PI * 2);

            let x1 = 60 * Math.sin(data.place1 * Math.PI * 2);
            let y1 = -60 * Math.cos(data.place1 * Math.PI * 2);
            let x2 = 67 * Math.sin(data.place1 * Math.PI * 2);
            let y2 = -67 * Math.cos(data.place1 * Math.PI * 2);
            let x3 = 72 * Math.sin(data.place2 * Math.PI * 2);
            let y3 = -72 * Math.cos(data.place2 * Math.PI * 2);

            if (key_flag[data.name] == 2) {
                svgtext += SVG.text(data.name + ":" + Math.floor(data.place1 * len + 1.02), x, y, { "font-size": "2.3", "text-anchor": "start", "dominant-baseline": "central", "transform": "rotate(" + (data.place2 * 360 - 90) + " " + x + "," + y + ")" });
            }
            else if (key_flag[data.name] == 3) {
                svgtext += SVG.text(data.name + ":" + Math.floor(data.place1 * len + 1.02), x, y, { "font-size": "2.3", "text-anchor": "start", "dominant-baseline": "central", "transform": "rotate(" + (data.place2 * 360 - 90) + " " + x + "," + y + ")", "font-weight": "bold" });
            }

            svgtext += SVG.line(x1, y1, x2, y2, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x2, y2, x3, y3, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x3, y3, x, y, { "stroke": "black", "stroke-width": "0.1" });
        }

        for (region of nucleicAcid.region) {
            if (region.shape == 0) {
                svgtext += SVG.arcBand(0, 0, 58 + region.offset * 4, 62 + region.offset * 4, (region.s / len - 0.25) * Math.PI * 2, (region.e / len - 0.25) * Math.PI * 2, { "fill": region.color, "stroke": "black", "stroke-width": "0.2" });
            }
            else if (region.shape == 1) {
                svgtext += SVG.forwardArcArrow(0, 0, 58 + region.offset * 4, 62 + region.offset * 4, (region.s / len - 0.25) * Math.PI * 2, (region.e / len - 0.25) * Math.PI * 2, { "fill": region.color, "stroke": "black", "stroke-width": "0.2" });
            }
            else if (region.shape == 2) {
                svgtext += SVG.backwardArcArrow(0, 0, 58 + region.offset * 4, 62 + region.offset * 4, (region.s / len - 0.25) * Math.PI * 2, (region.e / len - 0.25) * Math.PI * 2, { "fill": region.color, "stroke": "black", "stroke-width": "0.2" });
            }
            svgtext += SVG.arcText(region.name, 0, 0, 60 + region.offset * 4, (region.s / len - 0.25) * Math.PI * 2, (region.e / len - 0.25) * Math.PI * 2, 4);
        }

        let counting = 0;
        svgtext += SVG.text("Enzyme that do cut", 100, -90 + Math.floor(counting / 5) * 3, { "font-size": "3", "text-anchor": "left" });
        counting += 5;
        for (let i = keys.length - 1; i >= 0; i--) {
            let key = keys[i];
            if (result[key].length > 0) {
                svgtext += SVG.text(key, 100 + 16 * (counting % 5), -90 + Math.floor(counting / 5) * 3, { "font-size": "2", "text-anchor": "left" });
                counting++;
            }
        }
        counting += 10;
        counting -= counting % 5;
        svgtext += SVG.text("Enzyme that do NOT cut", 100, -90 + Math.floor(counting / 5) * 3, { "font-size": "3", "text-anchor": "left" });
        counting += 5;
        for (let i = keys.length - 1; i >= 0; i--) {
            let key = keys[i];
            if (result[key].length == 0) {
                svgtext += SVG.text(key, 100 + 16 * (counting % 5), -90 + Math.floor(counting / 5) * 3, { "font-size": "2", "text-anchor": "left" });
                counting++;
            }
        }
    }
    else {
        innerRing.space = 0.008;
        outerRing.space = 0.008;
        innerRing.run(false);
        outerRing.run(false);

        svg.setAttribute("viewBox", "-141 0 283 200");
        svgtext += SVG.text(nucleicAcid.name, 0, 10, { "font-size": "8", "text-anchor": "middle" });
        svgtext += SVG.text("" + nucleicAcid.sequence.length + "Bp", 0, 20, { "font-size": "7", "text-anchor": "middle" });
        svgtext += SVG.line(-130, 65, 130, 65, { "stroke": "black", "stroke-width": "2" });

        for (data of innerRing.data) {
            let x = -130 + 260 * data.place2;
            let y = 82;

            let x1 = -130 + 260 * data.place2;
            let y1 = 80;
            let x2 = -130 + 260 * data.place1;
            let y2 = 75;
            let x3 = -130 + 260 * data.place1;
            let y3 = 65;

            svgtext += SVG.text(data.name + ":" + Math.floor(data.place1 * len + 1.02), x, y, { "font-size": "2.3", "text-anchor": "end", "dominant-baseline": "central", "transform": "rotate(270 " + x + "," + y + ")" });
            svgtext += SVG.line(x, y, x1, y1, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x1, y1, x2, y2, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x2, y2, x3, y3, { "stroke": "black", "stroke-width": "0.1" });
        }
        for (data of outerRing.data) {
            let x = -130 + 260 * data.place2;
            let y = 48;

            let x1 = -130 + 260 * data.place2;
            let y1 = 50;
            let x2 = -130 + 260 * data.place1;
            let y2 = 55;
            let x3 = -130 + 260 * data.place1;
            let y3 = 65;

            if (key_flag[data.name] == 2) {
                svgtext += SVG.text(data.name + ":" + Math.floor(data.place1 * len + 1.02), x, y, { "font-size": "2.3", "text-anchor": "end", "dominant-baseline": "central", "transform": "rotate(90 " + x + "," + y + ")" });
            }
            else if (key_flag[data.name] == 3) {
                svgtext += SVG.text(data.name + ":" + Math.floor(data.place1 * len + 1.02), x, y, { "font-size": "2.3", "text-anchor": "end", "dominant-baseline": "central", "transform": "rotate(90 " + x + "," + y + ")", "font-weight": "bold" });
            }
            svgtext += SVG.line(x, y, x1, y1, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x1, y1, x2, y2, { "stroke": "black", "stroke-width": "0.1" });
            svgtext += SVG.line(x2, y2, x3, y3, { "stroke": "black", "stroke-width": "0.1" });
        }

        for (region of nucleicAcid.region) {
            let x1 = -130 + 260 * region.s / len;
            let x2 = -130 + 260 * region.e / len;
            let x = (x1 + x2) * 0.50;
            if (region.shape == 0) {
                svgtext += SVG.rect(x1, 63 + region.offset * 4, x2 - x1, 4, { "fill": region.color, "stroke": "black", "stroke-width": "0.2" });
            }
            else if (region.shape == 1) {
                svgtext += SVG.forwardArrow(x1, 63 + region.offset * 4, x2 - x1, 4, { "fill": region.color, "stroke": "black", "stroke-width": "0.2" });
            }
            else if (region.shape == 2) {
                svgtext += SVG.backwardArrow(x1, 63 + region.offset * 4, x2 - x1, 4, { "fill": region.color, "stroke": "black", "stroke-width": "0.2" });
            }
            const textLength = Math.min(4 * region.name.length * 0.5, (x2 - x1) * 0.9);
            svgtext += SVG.text(region.name, x, 65 + region.offset * 4, {
                "font-size": "4",
                "text-anchor": "middle",
                "dominant-baseline": "central",
                "lengthAdjust": "spacingAndGlyphs",
                "textLength": "" + textLength
            });
        }

        let counting = 0;
        svgtext += SVG.text("Enzyme that do cut", 0, 110 + Math.floor(counting / 13) * 3, { "font-size": "3", "text-anchor": "middle" });
        counting += 17;
        for (let i = keys.length - 1; i >= 0; i--) {
            let key = keys[i];
            if (result[key].length > 0) {
                svgtext += SVG.text(key, -140 + 16 * (counting % 17), 110 + Math.floor(counting / 17) * 3, { "font-size": "2", "text-anchor": "left" });
                counting++;
            }
        }
        counting += 17 * 2;
        counting -= counting % 17;
        svgtext += SVG.text("Enzyme that do NOT cut", 0, 110 + Math.floor(counting / 17) * 3, { "font-size": "3", "text-anchor": "middle" });
        counting += 17;
        for (let i = keys.length - 1; i >= 0; i--) {
            let key = keys[i];
            if (result[key].length == 0) {
                svgtext += SVG.text(key, -140 + 16 * (counting % 17), 110 + Math.floor(counting / 17) * 3, { "font-size": "2", "text-anchor": "left" });
                counting++;
            }
        }
    }

    svg.innerHTML = svgtext;

    let blob = new Blob([nucleicAcid.toNav()], { type: "text/plan" });
    let link = document.getElementById("save1");
    link.href = URL.createObjectURL(blob);
    link.download = nucleicAcid.name + ".nav";

    let downloadText = "";
    downloadText += "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"" + svg.viewBox.baseVal.x + " " + svg.viewBox.baseVal.y + " " + svg.viewBox.baseVal.width + " " + svg.viewBox.baseVal.height + "\">\n";
    downloadText += svgtext;
    downloadText += "</svg>";
    blob = new Blob([downloadText], { type: "text/plan" });
    link = document.getElementById("save2");
    link.href = URL.createObjectURL(blob);
    link.download = nucleicAcid.name + ".svg";
}

function onTextLoaded() {
    const result = restrictionEnzymes.cut(nucleicAcid);

    let singleMatch = document.getElementById("singleMatch");
    singleMatch.innerHTML = "";
    let severalMatch = document.getElementById("severalMatch");
    severalMatch.innerHTML = "";
    let ManyMatch = document.getElementById("manyMatch");
    ManyMatch.innerHTML = "";
    key_flag = {};
    keys = Object.keys(result).sort();
    for (key of keys) {
        if (result[key].length == 0) {
            key_flag[key] = 0;
        }
        else if (result[key].length == 1) {
            key_flag[key] = 1;
            singleMatch.innerHTML += "<option value=\"" + key + "\">" + key + "</option>";
        }
        else if (2 <= result[key].length && result[key].length <= 3) {
            key_flag[key] = 2;
            severalMatch.innerHTML += "<option value=\"" + key + "\">" + key + "</option>";
        }
        else {
            key_flag[key] = 4;
            ManyMatch.innerHTML += "<option value=\"" + key + "\">" + key + "</option>";
        }
    }

    const regionOptions = document.getElementById("regionOptions_div");
    let text = "";
    for (let i = 0; i < nucleicAcid.region.length; i++) {
        region = nucleicAcid.region[i];
        text += "<details>\n";
        text += "<summary>" + region.name + "(" + region.s + " to " + region.e + ")" + "</summary>\n"
        text += "<p>color:<input type=\"color\" value=\"" + region.color + "\" onchange=\"onRegionDataChanged(0,this," + i + ")\"/></p>";
        text += "<p>offset:<input type=\"number\" value=\"0\" step=\"0.5\" onchange=\"onRegionDataChanged(1,this," + i + ")\"/></p>";
        if (region.shape == 1) {
            text += "<p>arrow:<select onchange=\"onRegionDataChanged(2,this," + i + ")\"><option>None</option><option selected>Forward</option><option>Backward</option></select></p>";
        }
        else if (region.shape == 2) {
            text += "<p>arrow:<select onchange=\"onRegionDataChanged(2,this," + i + ")\"><option>None</option><option>Forward</option><option selected>Backward</option></select></p>";
        }
        else {
            text += "<p>arrow:<select onchange=\"onRegionDataChanged(2,this," + i + ")\"><option selected>None</option><option>Forward</option><option>Backward</option></select></p>";
        }
        text += "</details>\n";
    }
    regionOptions.innerHTML = text;

    enzymeChanged();
    drawMap();
}

async function filesSelected() {
    let rebasefile = document.getElementById("rebaseFile").files[0];
    let sequencefile = document.getElementById("sequenceFile").files[0];
    if (!rebasefile || !sequencefile) {
        alert("Please Select 2 Files.");
        return;
    }
    let text = await readFile(rebasefile);
    restrictionEnzymes.fromText(text);

    text = await readFile(sequencefile);
    const name = sequencefile.name.toLowerCase();
    if (name.endsWith(".nav")) nucleicAcid.fromNav(text);
    else if (name.endsWith(".gb")) nucleicAcid.fromGb(text);
    else {
        alert("Error! Sequence file must be .gb or .nav");
        return;
    }
    onTextLoaded();
}


function enzymeChanged() {
    document.getElementById("exceptCheck").checked = false;
    let select = document.getElementById("EnzymeSelect");
    let radios = document.getElementsByClassName("EO");
    radios[key_flag[select.options[select.selectedIndex].value] - 1].checked = true;
}

function enzymeOptionClicked(data) {
    if (document.getElementById("exceptCheck").checked) {
        let select = document.getElementById("EnzymeSelect");
        for (key in key_flag) {
            if (key != select.options[select.selectedIndex].value) {
                key_flag[key] = 4;
            }
        }
        key_flag[select.options[select.selectedIndex].value] = data;
    }
    else {
        let select = document.getElementById("EnzymeSelect");
        key_flag[select.options[select.selectedIndex].value] = data;
    }
    drawMap();
}

function onRegionDataChanged(type, element, idx) {
    if (type == 0) {
        nucleicAcid.region[idx].color = element.value;
    }
    else if (type == 1) {
        nucleicAcid.region[idx].offset = parseFloat(element.value);
    }
    else if (type == 2) {
        nucleicAcid.region[idx].shape = element.selectedIndex;
    }
    drawMap();
}

function onSwitchSvg2Text(e) {
    e.preventDefault();
    svg.style.display = "none";
    document.getElementById("editNav").style.display = "block";
    document.getElementById("editNavText").value = nucleicAcid.toNav();
}

function onTextEditDone() {
    svg.style.display = "block";
    nucleicAcid.fromNav(document.getElementById("editNavText").value);
    document.getElementById("editNav").style.display = "none";
    onTextLoaded();
}
