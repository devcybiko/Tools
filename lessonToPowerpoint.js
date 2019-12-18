#!/usr/bin/env node

const gls = require("glsfiles");

var main = function() {
    var infname = process.argv[2];
    var lines = gls.readTextFile(infname);
    var outlines = [];

    var linecnt = 0;
    var baseDate = "1970-01-01T";
    var startTime = 0;

    for (let line of lines) {
        linecnt++;
        if (linecnt === 1) {
            try {
                let header = line.split("<")[0];
                let reg = /\((.*?):(.*?) (.*?)\)/;
                let match = header.match(reg);
                let ampm = match[3];
                let minutes = match[2];
                let hours = "" + (parseInt(match[1]) + (ampm === "PM" ? 12 : 0));
                let tmpDate = `${baseDate}${hours.padStart(2, "0")}:${minutes}:00`;
                startTime = new Date(Date.parse(tmpDate));
                console.log(header.substring(1)); // remove first '#' to increase the 'level' of the section
                console.error(header.substring(1)); // remove first '#' to increase the 'level' of the section
            } catch (Exeption) {
                console.error("ERROR: Probably you forgot to set the session start time in the README.md file");
                process.exit(1);
                continue;
            }
        }
        if (line.startsWith("#")) {
            let postHash = line.substring(line.indexOf(" "));
            let hashCount = line.split(" ")[0].length;
            let reg1 = /\((\d+) (.*?)\)/; // has a time on it (12 mins)
            let reg2 = /\((\d+):(\d+)\)/; // has a time on it (0:12)
            let match1 = line.match(reg1);
            let match2 = line.match(reg2);
            if (match1) {
                // console.error(`Matching reg1: ${line}`);
                let minutes = match1[1];
                let words = postHash.split("(");
                let endTime = new Date(startTime.getTime() + parseInt(minutes) * 60 * 1000);
                let startRange = startTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
                let endRange = endTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
                postHash = `${words[0]}(${startRange} - ${endRange}) (${minutes} mins)`;
                console.log("#" + postHash); // remove first '#' to increase the 'level' of the section
                console.error("#" + postHash); // remove first '#' to increase the 'level' of the section
                startTime = endTime;
            } else if (match2) {
                // console.error(`Matching reg2: ${line}`);
                let minutes = match2[2];
                let words = postHash.split("(");
                let endTime = new Date(startTime.getTime() + parseInt(minutes) * 60 * 1000);
                let startRange = startTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
                let endRange = endTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
                postHash = `${words[0]}(${startRange} - ${endRange}) (${minutes} mins)`;
                console.log("#" + postHash); // remove first '#' to increase the 'level' of the section
                console.error("#" + postHash); // remove first '#' to increase the 'level' of the section
                startTime = endTime;
            } else {
                // console.error(`Not Mathching: ${line}`);
                hashCount = Math.min(3, hashCount - 1);
                console.log("######".substring(0, hashCount) + postHash); // remove first '#' to increase the 'level' of the section
                console.error("######".substring(0, hashCount) + postHash); // remove first '#' to increase the 'level' of the section
            }
            continue;
        }
        console.log(line);
    }
};

main();
