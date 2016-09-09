var timeFormat = 'MM/DD/YYYY HH:mm';
var targetfolder = "./target/";
var outfolder = "../out/";
var infolder = "../in/";
var targetfile = targetfolder + "target.csv";
var urlVideo = "http://localhost:9002/cdn.mpd";
var urlVideoSD = "http://localhost:9003/cdnld.mpd";
var urlVideoHD = "http://localhost:9003/cdnhd.mpd";
var urlMPD = "/api/simu/mpd/";
var DATA = {};

var dataIXPs = []
$.ajax({
    url: targetfile,
    async: false,
    success: function (csvd) {
        dataIXPs = $.csv.toArrays(csvd);
    },
    dataType: "text",
    complete: function () {
        // call a function on complete
    }
});

var table = document.getElementById("Organization");
var row = table.insertRow(1);
dataIXPs.forEach(function (element) {
    DATA[element[0]] = element
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "<b>" + element[0] + "</b>";
    cell2.innerHTML = element[1];
    cell3.innerHTML = element[2].replace(/\./gi, ", ")
}, this);
// remove last value (to keep visual effect)
table.deleteRow(table.children[1].children.length)

if (table != null) {
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            loadOrganization(this);
        };
    }
}

function loadOrganization(tableCell) {
    Organization = tableCell.cells[0].innerText
    propername = Organization.replace(/\./gi, "")
    var $BOX_PANEL = $("#" + propername).closest('.closable');
    $BOX_PANEL.remove();
    $.ajax({
        url: "./app/html/template.html",
        async: false,
        success: function (template) {
            //Parse it (optional, only necessary if template is to be used again)
            Mustache.parse(template);
            //Render the data into the template
            var rendered = Mustache.render(template, {
                organaname: Organization,
                orgapropername: propername
            });
            $("#ixp").before(rendered);
        },
        dataType: "text",
        complete: function () {
            refresh();
        }
    });

    if (!DATA[Organization]["ixplist"]) {
        $.ajax({
            url: infolder + Organization + "/ixplist.csv",
            async: false,
            success: function (csvd) {
                DATA[Organization]["ixplist"] = $.csv.toArrays(csvd);
            },
            dataType: "text",
            complete: function () {
                // call a function on complete
            }
        });

    }
    DATA[Organization]["ixplist"].forEach(function (element) {
        $.ajax({
            url: outfolder + Organization + "/" + element[1] + ".temp",
            async: false,
            success: function (csvd) {

                DATA[Organization]["ixplist"][element[1]] = $.csv.toArrays(csvd.replace(/"/gi, ""));
                totalBW = 0;
                contentBW = 0
                DATA[Organization]["ixplist"][element[1]].forEach(function (asn) {
                    if (asn != "") {
                        totalBW = totalBW + parseInt(asn[1]);
                        if (asn[2] == "Content") {
                            contentBW = contentBW + parseInt(asn[1]);
                        }
                    }
                })
                DATA[Organization]["ixplist"][element[1]]["totalBW"] = totalBW
                DATA[Organization]["ixplist"][element[1]]["contentBW"] = contentBW
            },
            dataType: "text",
            complete: function () {

            }
        });
    });


    var table = document.getElementById(propername);
    var row = table.insertRow(1);
    DATA[Organization]["ixplist"].forEach(function (element) {
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "<b>" + element[1] + "</b>";
        cell2.innerHTML = humanFileSize(DATA[Organization]["ixplist"][element[1]]["totalBW"] * 1024 * 1024, true);
        cell3.innerHTML = parseInt(DATA[Organization]["ixplist"][element[1]]["contentBW"] / DATA[Organization]["ixplist"][element[1]]["totalBW"] * 100) + "%";
        cell4.style = "display:none;"
        cell4.innerHTML = Organization;
    }, this);
    table.deleteRow(table.children[1].children.length)
    if (table != null) {
        for (var i = 1; i < table.rows.length; i++) {
            table.rows[i].onclick = function () {
                loadixp(this);
            };
        }
    }
}


function loadixp(tableCell) {
    organization = tableCell.cells[3].innerText
    ixp = tableCell.cells[0].innerText
    console.log(Organization + " " + ixp)
    organizationproper = ixp.replace(/\./gi, "")
    ixpproper = ixp.replace(/\./gi, "").replace(/ /gi, "_")
    var $BOX_PANEL = $("#" + ixpproper).closest('.closable');
    $BOX_PANEL.remove();
    $.ajax({
        url: "./app/html/templateixp.html",
        async: false,
        success: function (template) {
            //Parse it (optional, only necessary if template is to be used again)
            Mustache.parse(template);
            //Render the data into the template
            var rendered = Mustache.render(template, {
                organname: organization,
                orgapropername: organizationproper,
                folder: outfolder,
                ixpname: ixp,
                ixppropername: ixpproper
            });
            $("#ixpinfo").before(rendered);
        },
        dataType: "text",
        complete: function () {
            refresh();
        }
    });

}