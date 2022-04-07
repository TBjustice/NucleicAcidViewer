SVG = {
    circle: function (cx, cy, r, args = {}) {
        let text = "<circle cx=\"" + cx + "\" cy=\"" + cy + "\" r=\"" + r + "\" ";
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></circle>\n";
        return text;
    },
    text: function (content, x, y, args = {}) {
        let text = "<text x=\"" + x + "\" y=\"" + y + "\" ";
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += ">" + content + "</text>\n";
        return text;
    },
    line: function (x1, y1, x2, y2, args = {}) {
        let text = "<line x1 =\"" + x1 + "\" y1=\"" + y1 + "\" x2=\"" + x2 + "\" y2=\"" + y2 + "\" ";
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></line>\n";
        return text;
    },
    rect: function (x, y, width, height, args = {}) {
        let text = "<rect x =\"" + x + "\" y=\"" + y + "\" width=\"" + width + "\" height=\"" + height + "\" ";
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></rect>\n";
        return text;
    },
    forwardArrow: function (x, y, width, height, args = {}) {
        let text = "<path "
            + "d=\""
            + "M " + x + " " + y + " "
            + "L " + (x + width * 0.9) + " " + (y) + " "
            + "L " + (x + width) + " " + (y + height * 0.5) + " "
            + "L " + (x + width * 0.9) + " " + (y + height) + " "
            + "L " + x + " " + (y + height) + " "
            + "Z\" "
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></path>\n";
        return text;
    },
    backwardArrow: function (x, y, width, height, args = {}) {
        let text = "<path "
            + "d=\""
            + "M " + x + " " + (y + height * 0.5) + " "
            + "L " + (x + width * 0.1) + " " + y + " "
            + "L " + (x + width) + " " + y + " "
            + "L " + (x + width) + " " + (y + height) + " "
            + "L " + (x + width * 0.1) + " " + (y + height) + " "
            + "Z\" "
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></path>\n";
        return text;
    },
    arctextId: 0,
    arcText: function (content, cx, cy, r, start, end, fontsize, args = {}) {
        let sx = cx + r * Math.cos(start);
        let sy = cy + r * Math.sin(start);
        let ex = cx + r * Math.cos(end);
        let ey = cy + r * Math.sin(end);
        let textLength = Math.min(fontsize * content.length * 0.5, r * (end - start));
        let text = "<defs><path "
            + "d=\""
            + "M " + sx + " " + sy + " "
            + "A " + r + " " + r + " 0 0 1 " + ex + " " + ey + ""
            + "\" id=\"ArcID" + this.arctextId + "\"></path></defs>\n";
        text += "<text><textPath startOffset=\"50%\" text-anchor=\"middle\" dominant-baseline=\"middle\" lengthAdjust=\"spacingAndGlyphs\" font-size=\"" + fontsize + "\" textLength=\"" + textLength + "\" href=\"#ArcID" + this.arctextId + "\" ";
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += ">" + content + "</textPath ></text>\n";
        this.arctextId++;
        return text;
    },
    arcBand: function (cx, cy, r1, r2, start, end, args = {}) {
        let sx1 = cx + r1 * Math.cos(start);
        let sy1 = cy + r1 * Math.sin(start);
        let ex1 = cx + r1 * Math.cos(end);
        let ey1 = cy + r1 * Math.sin(end);
        let sx2 = cx + r2 * Math.cos(start);
        let sy2 = cy + r2 * Math.sin(start);
        let ex2 = cx + r2 * Math.cos(end);
        let ey2 = cy + r2 * Math.sin(end);
        let text = "<path "
            + "d=\""
            + "M " + sx1 + " " + sy1 + " "
            + "A " + r1 + " " + r1 + " 0 0 1 " + ex1 + " " + ey1 + " "
            + "L " + ex2 + " " + ey2 + " "
            + "A " + r2 + " " + r2 + " 0 0 0 " + sx2 + " " + sy2 + " "
            + "Z\" "
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></path>\n";
        return text;
    },
    forwardArcArrow: function (cx, cy, r1, r2, start, end, args = {}) {
        let sx1 = cx + r1 * Math.cos(start);
        let sy1 = cy + r1 * Math.sin(start);
        let ex1 = cx + r1 * Math.cos(end*0.9+start*0.1);
        let ey1 = cy + r1 * Math.sin(end * 0.9 + start * 0.1);
        let sx2 = cx + r2 * Math.cos(start);
        let sy2 = cy + r2 * Math.sin(start);
        let ex2 = cx + r2 * Math.cos(end * 0.9 + start * 0.1);
        let ey2 = cy + r2 * Math.sin(end * 0.9 + start * 0.1);

        let ex3 = cx + (r1 + r2) * 0.5 * Math.cos(end);
        let ey3 = cy + (r1 + r2) * 0.5 * Math.sin(end);

        let text = "<path "
            + "d=\""
            + "M " + sx1 + " " + sy1 + " "
            + "A " + r1 + " " + r1 + " 0 0 1 " + ex1 + " " + ey1 + " "
            + "L " + ex3 + " " + ey3 + " "
            + "L " + ex2 + " " + ey2 + " "
            + "A " + r2 + " " + r2 + " 0 0 0 " + sx2 + " " + sy2 + " "
            + "Z\" "
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></path>\n";
        return text;
    },
    backwardArcArrow: function (cx, cy, r1, r2, start, end, args = {}) {
        let sx1 = cx + r1 * Math.cos(start * 0.9 + end * 0.1);
        let sy1 = cy + r1 * Math.sin(start * 0.9 + end * 0.1);
        let ex1 = cx + r1 * Math.cos(end);
        let ey1 = cy + r1 * Math.sin(end);
        let sx2 = cx + r2 * Math.cos(start * 0.9 + end * 0.1);
        let sy2 = cy + r2 * Math.sin(start * 0.9 + end * 0.1);
        let ex2 = cx + r2 * Math.cos(end);
        let ey2 = cy + r2 * Math.sin(end);

        let sx3 = cx + (r1 + r2) * 0.5 * Math.cos(start);
        let sy3 = cy + (r1 + r2) * 0.5 * Math.sin(start);

        let text = "<path "
            + "d=\""
            + "M " + sx3 + " " + sy3 + " "
            + "L " + sx1 + " " + sy1 + " "
            + "A " + r1 + " " + r1 + " 0 0 1 " + ex1 + " " + ey1 + " "
            + "L " + ex2 + " " + ey2 + " "
            + "A " + r2 + " " + r2 + " 0 0 0 " + sx2 + " " + sy2 + " "
            + "Z\" "
        for (key in args) {
            text += key + "=\"" + args[key] + "\" ";
        }
        text += "></path>\n";
        return text;
    }
}