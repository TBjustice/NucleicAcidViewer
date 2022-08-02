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
    this.fromCSV = function (text) {
        this.rebase = {};
        text = text.replace(/\r/g, "");
        lines = text.split('\n');
        for (const line of lines){
            const data = line.split(",");
            if(data.length >= 2){
                this.rebase[data[0]]={target:data[1],met:[]};
                for(let i=2;i<data.length;i++){
                    if(data[i].length>0){
                        this.rebase[data[0]].met.push(data[i]);
                    }
                }
            }
        }
    };
    this.toReg = function(text){
        text = text.replace("^", "");
        text = text.replace(/R/g, "(A|G)");
        text = text.replace(/Y/g, "(C|T)");
        text = text.replace(/W/g, "(A|T)");
        text = text.replace(/S/g, "(C|G)");
        text = text.replace(/M/g, "(A|C)");
        text = text.replace(/K/g, "(G|T)");
        text = text.replace(/D/g, "(A|G|T)");
        text = text.replace(/H/g, "(A|C|T)");
        text = text.replace(/V/g, "(A|C|G)");
        text = text.replace(/B/g, "(C|G|T)");
        text = text.replace(/N/g, "(A|C|G|T)");
        return new RegExp(text, 'g');
    };
    this.cut = function (nucleicAcid) {
        let result = {};
        const seqlen = nucleicAcid.sequence.length;
        for (const enzyme in this.rebase){
            result[enzyme] = [];
            const keylen = this.rebase[enzyme].target.replace("^", "").length;
            const reg = this.toReg(this.rebase[enzyme].target);
            let sequence = nucleicAcid.sequence.concat();
            if (nucleicAcid.type == "circular" || nucleicAcid.type == "plasmid") sequence += sequence.slice(0, keylen-1);
            while (idx = reg.exec(sequence)) {
                let ioc=(idx.index+this.rebase[enzyme].target.indexOf("^"))%seqlen;
                result[enzyme].push({name:enzyme,index:idx.index,ioc:ioc,met:false});
                for (const metseq of this.rebase[enzyme].met) {
                    const reg2 = this.toReg(metseq);
                    let sequence2 = nucleicAcid.sequence.concat();
                    if (nucleicAcid.type == "circular" || nucleicAcid.type == "plasmid") sequence2 += sequence2.slice(0, metseq.replace("^", "").length-1);
                    while (idx2 = reg2.exec(sequence2)) {
                        console.log(idx2.index,metseq,metseq.indexOf("^"));
                        if(ioc == (idx2.index+metseq.indexOf("^"))%seqlen){
                            result[enzyme][result[enzyme].length-1].met=true;
                            break;
                        }
                        reg2.lastIndex-=metseq.replace("^", "").length-1;
                    }
                }
                reg.lastIndex-=keylen-1;
            }
        }
        return result;
    };
}
