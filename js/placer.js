class Placer {
    space = 0.01;
    data = [];
    add(name, place) {
        this.data.push({ name: name, place1: place, place2: place });
    }
    run(circular = false) {
        const datasize = this.data.length;
        if (datasize * this.space > 1) {
            console.log("Too many data to show!")
            this.space = 1 / datasize;
        }
        this.data.sort((a, b) => { return a.place1 - b.place1; });
        let region = [];
        for (let i = 0; i < datasize; i++) {
            region.push({ from: i, to: i, begin: this.data[i].place1 - this.space / 2, end: this.data[i].place1 + this.space / 2 });
        }
        for (let count = 0; count < datasize; count++) {
            for (let i = region.length - 2; i >= 0; i--) {
                if (region[i + 1].begin - region[i].end < 0) {
                    region.splice(i, 2, { from: region[i].from, to: region[i + 1].to, begin: 0, end: 0 });
                    let average = 0;
                    for (let j = region[i].from; j < region[i].to + 1; j++) {
                        average += this.data[j].place1;
                    }
                    let regionlen = region[i].to + 1 - region[i].from;
                    average /= regionlen;
                    region[i].begin = average - regionlen * this.space / 2;
                    region[i].end = average + regionlen * this.space / 2;
                }
            }
            if (1 + region[0].begin - region[region.length - 1].end < 0) {
                let regionlen = region[0].to + 1 - region[0].from;
                region[0].begin = region[region.length - 1].end - 1;
                region[0].end = region[0].begin + regionlen * this.space;
            }
        }

        for (let i = 0; i < region.length; i++) {
            for (let j = region[i].from; j < region[i].to + 1; j++) {
                this.data[j].place2 = region[i].begin + this.space / 2 + this.space * (j - region[i].from);
            }
        }
    }
}