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
        var cell5 = row.insertCell(4);
        cell1.innerHTML = "<b>" + element[1] + "</b>";
        cell2.innerHTML = humanFileSize(DATA[Organization]["ixplist"][element[1]]["totalBW"] * 1024 * 1024, true);
        cell3.innerHTML = parseInt(DATA[Organization]["ixplist"][element[1]]["contentBW"] / DATA[Organization]["ixplist"][element[1]]["totalBW"] * 100) + "%";
        cell4.style = "display:none;"
        cell4.innerHTML = Organization;
        cell5.style = "display:none;"
        cell5.innerHTML = element[2];
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
    iddown = tableCell.cells[4].innerText
    console.log(Organization + " " + ixp)
    organizationproper = ixp.replace(/\./gi, "").replace(/ /gi, "_")
    ixpproper = ixp.replace(/\./gi, "").replace(/ /gi, "_")
    var $BOX_PANEL = $("#" + organizationproper + ixpproper).closest('.closable');
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


    if (!DATA[Organization]["ixplist"][ixp]["downloadfiles"]) {
        $.ajax({
            url: outfolder + Organization + "/alldownload.txt",
            async: false,
            success: function (csvd) {
                DATA[Organization]["ixplist"][ixp]["downloadfiles"] = $.csv.toArrays(csvd);
            },
            dataType: "text",
            complete: function () {
                // call a function on complete
            }
        });

    }
    var table = document.getElementById(organizationproper + ixpproper);
    var row = table.insertRow(1);
    DATA[Organization]["ixplist"][ixp]["downloadfiles"].forEach(function (element) {
        if (element[0].indexOf(iddown) !== -1) {

            var split = element[0].split(".csvx")[0].split("_")
            resolution = split[split.length - 1]
            csvelement = element[0].substring(0, element[0].length - 1)

            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            cell1.innerHTML = resolution;
            cell2.innerHTML = "<b>" + csvelement + "</b>";
            cell3.innerHTML = '<a href="' + outfolder + Organization + "/" + element[0] + '" download="' + csvelement + '"> Save <i class="fa fa-save"></i>   </a>'
            cell4.style = "display:none;"
            cell4.innerHTML = outfolder + Organization + "/" + element[0];
            cell5.style = "display:none;"
            cell5.innerHTML = element[0];
            cell6.style = "display:none;"
            cell6.innerHTML = organization;
            cell7.style = "display:none;"
            cell7.innerHTML = ixp;

        }
        // console.log(element)

    });
    // remove last value (to keep visual effect)
    table.deleteRow(table.children[1].children.length)
    if (table != null) {
        for (var i = 1; i < table.rows.length; i++) {
            table.rows[i].onclick = function () {
                previewdata(this);
            };
        }
    }


}
function previewdata(tableCell) {
    console.log(tableCell)

    // organization = tableCell.cells[3].innerText
    resolution = tableCell.cells[0].innerText
    dataname = tableCell.cells[4].innerText
    datafile = tableCell.cells[3].innerText
    organization = tableCell.cells[5].innerText
    ixp = tableCell.cells[6].innerText
    csvelement = tableCell.cells[1].innerText

    // organizationproper = ixp.replace(/\./gi, "").replace(/ /gi, "_")
    // ixpproper = ixp.replace(/\./gi, "").replace(/ /gi, "_")
    // datafilepoper = datafilepoper.replace(/\./gi, "").replace(/ /gi, "_")

    var $BOX_PANEL = $("#" + dataname).closest('.closable');
    $BOX_PANEL.remove();
    $.ajax({
        url: "./app/html/templatepreview.html",
        async: false,
        success: function (template) {
            //Parse it (optional, only necessary if template is to be used again)
            Mustache.parse(template);
            //Render the data into the template
            var rendered = Mustache.render(template, {
                dataname: dataname,
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

    if (!DATA[Organization]["ixplist"][ixp]["downloadfiles"][dataname]) {
        $.ajax({
            url: datafile,
            async: false,
            success: function (csvd) {
                DATA[Organization]["ixplist"][ixp]["downloadfiles"][dataname] = $.csv.toArrays(csvd);
            },
            dataType: "text",
            complete: function () {
                // call a function on complete
            }
        });

    }
    var labels = []
    var datas = []
    size = DATA[Organization]["ixplist"][ixp]["downloadfiles"][dataname].length
    DATA[Organization]["ixplist"][ixp]["downloadfiles"][dataname].forEach(function (element, index) {
        if ((size - index) <= 300) {
            labels.push(element[0])
            datas.push(element[1])
        }
    });


    // Line chart
    var ctx = document.getElementById(dataname);
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: dataname,
                backgroundColor: "rgba(38, 185, 154, 0.31)",
                borderColor: "rgba(38, 185, 154, 0.7)",
                pointBorderColor: "rgba(38, 185, 154, 0.7)",
                pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                //pointBorderWidth: 1,
                data: datas
            }]
        },
        options: { elements: { point: { radius: 0 } } }
    });
}