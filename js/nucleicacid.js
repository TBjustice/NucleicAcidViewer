function DNARegion(s, e, name, color = "#ffffff", shape = 0, offset = 0) {
    this.s = s;             //Start point
    this.e = e;             //End point
    this.name = name;       //Name
    this.color = color; //Color
    this.shape = shape;         //0 for Box : 1 for arrow forward : 2 for arrow backward
    this.offset = offset;        //Place to show box. Positive->outside/up. Negative->inside/down
}

class NucleicAcid {
    name = "name";
    type = "linear";
    region = [];
    sequence = "";
    fromNav(text) {
        this.name = "name";
        this.type = "linear";
        this.region = [];
        this.sequence = "";
        text = text.replace(/\r/g, '');
        const lines = text.split('\n');
        let action = "";
        for (const line of lines) {
            if (line.length == 0) continue;
            if (line[0] == '#') continue;
            if (line[0] == '@') action = line;
            else {
                switch (action) {
                    case "@name":
                        this.name = line;
                        action = "";
                        break;
                    case "@type":
                        this.type = line;
                        action = "";
                        break;
                    case "@region":
                        {
                            const linedata = line.split(',');
                            if (linedata.length >= 3) {
                                const newregion = new DNARegion(parseInt(linedata[0]), parseInt(linedata[1]), linedata[2]);
                                if (linedata.length >= 4) newregion.color = linedata[3];
                                if (linedata.length >= 5) newregion.shape = parseInt(linedata[4]);
                                if (linedata.length >= 6) newregion.offset = parseFloat(linedata[5]);
                                this.region.push(newregion);
                            }
                        }
                        break;
                    case "@sequence":
                        this.sequence += (line.toUpperCase()).replace(/[^ACGT]/g, "");
                        break;
                    default:
                        break;
                }
            }
        }
    }
    fromGb(text) {
        this.name = "name";
        this.type = "linear";
        this.region = [];
        this.sequence = "";
        text = text.replace(/\r/g, '');
        let lines = text.split('\n');
        let field = "";
        let action = "";
        for (const line of lines) {
            if (line[0] != " ") field = line.split(" ")[0];

            if (field == "LOCUS") {
                if (line.indexOf("circular") != -1) {
                    this.type = "circular";
                }
                else if (line.indexOf("plasmid") != -1) {
                    this.type = "plasmid";
                }
                field = "";
            }
            else if (field == "DEFINITION") {
                this.name = window.prompt("Enter Name of the Sequence", line.substring(12));
                field = "";
            }
            else if (field == "FEATURES") {
                if (line.substring(0, 21).indexOf("gene") != -1) {
                    action = line;
                }
                if (action.indexOf("gene") != -1 && line.substring(21).indexOf("gene=") != -1) {
                    const actiondata = action.split("..");
                    const s = parseInt(actiondata[0].replace(/\D/g, ""));
                    const e = parseInt(actiondata[1].replace(/\D/g, ""));
                    const linesub = line.substring(21);
                    const name = linesub.substring(linesub.indexOf("gene=") + 6).split("\"")[0];
                    if (action.indexOf("complement") != -1) {
                        this.region.push(new DNARegion(s, e, name, "#ffffff", 2));
                    }
                    else {
                        this.region.push(new DNARegion(s, e, name, "#ffffff",1));
                    }
                    action = "";
                }
            }
            else if (field == "ORIGIN") {
                if (line.length > 10) {
                    this.sequence += line.substring(10).toUpperCase().replace(/[^ACGT]/g, "");
                }
            }
        }
    }
    toNav() {
        let text = "";
        text += "@name\n";
        text += this.name + "\n";
        text += "@type\n";
        text += this.type + "\n";
        text += "@region\n";
        for (const r of this.region) {
            text += "" + r.s + "," + r.e + "," + r.name + "," + r.color + "," + r.shape + "," + r.offset + "\n";
        }
        text += "@sequence\n";
        text += this.sequence + "\n";
        return text;
    }
}

function RestrictionEnzymes() {
    this.rebase = {};
    this.fromText = function (text) {
        this.rebase = {};
        lines = text.split('\n');
        var bufarray = [];
        for (var i = lines.length - 1; i >= 0; i--) {
            if (lines[i].length == 0) continue;
            if (lines[i][0] == '#') continue;
            line = (lines[i].replace(/\s{2,}/g, " ")).split(" ");
            if (line[0].length == 0) break;
            if (lines[i].indexOf(')') - lines[i].indexOf('(') > 0) continue;
            for (var j = line.length - 1; j > 0; j--) {
                if (line[j].length == 0) {
                    continue;
                }
                else if (line[j].indexOf('(') >= 0) {
                    line.splice(j, 1);
                }
                else {
                    if (bufarray.indexOf(line[j]) < 0) {
                        bufarray.push(line[j]);
                        this.rebase[line[j]] = [line[0]];
                    }
                    else {
                        this.rebase[line[j]].push(line[0]);
                    }
                }
            }
        }
    };
    this.cut = function (nucleicAcid) {
        let result = {};
        for (key in this.rebase) {
            var bufkey = key.replace("^", "");
            let keylen = bufkey.length;
            bufkey = bufkey.replace(/R/g, "(A|G)");
            bufkey = bufkey.replace(/Y/g, "(C|T)");
            bufkey = bufkey.replace(/W/g, "(A|T)");
            bufkey = bufkey.replace(/S/g, "(C|G)");
            bufkey = bufkey.replace(/M/g, "(A|C)");
            bufkey = bufkey.replace(/K/g, "(G|T)");
            bufkey = bufkey.replace(/D/g, "(A|G|T)");
            bufkey = bufkey.replace(/H/g, "(A|C|T)");
            bufkey = bufkey.replace(/V/g, "(A|C|G)");
            bufkey = bufkey.replace(/B/g, "(C|G|T)");
            bufkey = bufkey.replace(/N/g, "(A|C|G|T)");
            for (var i = 0; i < this.rebase[key].length; i++) {
                if (!Object.keys(result).includes(this.rebase[key][i])) result[this.rebase[key][i]] = [];
            }
            var idx;
            var re = new RegExp(bufkey, 'g');
            var sequenceCode = nucleicAcid.sequence;
            if (nucleicAcid.type == "circular" || nucleicAcid.type == "plasmid") sequenceCode += nucleicAcid.sequence.slice(0, keylen - 1);
            while (idx = re.exec(sequenceCode)) {
                for (var i = 0; i < this.rebase[key].length; i++) {
                    result[this.rebase[key][i]].push(idx.index);
                }
            }
        }
        return result;
    };
}
