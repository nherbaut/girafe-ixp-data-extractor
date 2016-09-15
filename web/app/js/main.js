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
var TABLE = {}

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


    DATA[Organization]["ixplist"]["Table"] = []
    id = 0
    DATA[Organization]["ixplist"].forEach(function (element) {


        DATA[Organization]["ixplist"]["Table"][id] = [];
        DATA[Organization]["ixplist"]["Table"][id][0] = "<b>" + element[1] + "</b>";
        DATA[Organization]["ixplist"]["Table"][id][1] = humanFileSize(DATA[Organization]["ixplist"][element[1]]["totalBW"] * 1024 * 1024, true);
        DATA[Organization]["ixplist"]["Table"][id][2] = parseInt(DATA[Organization]["ixplist"][element[1]]["contentBW"] / DATA[Organization]["ixplist"][element[1]]["totalBW"] * 100) + "%";
        // cell4.style = "display:none;"
        DATA[Organization]["ixplist"]["Table"][id][3] = Organization;
        // cell5.style = "display:none;"
        DATA[Organization]["ixplist"]["Table"][id][4] = element[2];
        id = id + 1

        // console.log(element)

    });
    // remove last value (to keep visual effect)
    // table.deleteRow(table.children[1].children.length)


    TABLE[propername] = $('#' + propername).DataTable({
        data: DATA[Organization]["ixplist"]["Table"],
        columns: [
            {title: "Name"},
            {title: "Bandwidth"},
            {title: "Content part"},
            {title: ""},
            {title: ""}
        ],
        "columnDefs": [
            {
                "targets": [3],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [4],
                "visible": false,
                "searchable": false
            }
        ],
        "dom": '<"top"fi>rt<"bottom"Bp><"clear">',
        "iDisplayLength": 10,
        buttons: [
            {
                extend: "copy",
                className: "btn-sm"
            },
            {
                extend: "csv",
                className: "btn-sm"
            }
        ],
        responsive: true,
        "info": false,
        "order": [[1, "desc"]]
    });

    $('#' + propername).on('click', 'tr', function () {
        var data = TABLE[this.offsetParent.id].row(this).data();
        loadixp(data);
    });

}


function loadixp(tableCell) {

    tableCell.forEach(function (element, index) {
        var div = document.createElement("div");
        div.innerHTML = element;
        // var text = div.textContent || div.innerText || "";
        tableCell[index] = div.innerText
    });

    organization = tableCell[3]
    ixp = tableCell[0]
    iddown = tableCell[4]

    // console.log(Organization + " " + ixp)
    organizationproper = organization.replace(/\./gi, "").replace(/ /gi, "_")
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

    datacontent = [0, 0];
    dataname = ["Other", "Other Content"];
    datacolor = ["#E5E5E5", "#6495ED"];

    DATA[Organization]["ixplist"][ixp].forEach(function (asn) {
        if (asn != "") {
            if (asn[2] == "Content") {
                if (parseInt(asn[1]) > (DATA[Organization]["ixplist"][ixp]["contentBW"] / 20)) {
                    datacontent.push(asn[1]);
                    dataname.push(asn[0]);
                    datacolor.push(randomColor(0.7))
                }
                else {
                    datacontent[1] = datacontent[1] + parseInt(asn[1]);
                }
            }
            else {
                datacontent[0] = datacontent[0] + parseInt(asn[1]);
            }
        }
    });



    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: datacontent,
                backgroundColor: datacolor,
            }],
            labels: dataname
        },
        options: {
            responsive: true,
            tooltipEvents: [],
            legend: { position: 'bottom', },
            // showTooltips: false,
            // onAnimationComplete: function () {
            //     this.showTooltip(this.segments, true);
            // },
            // tooltipTemplate: "<%= label %> - <%= value %>%"

        }
    };
    var ctx = document.getElementById(organizationproper + ixpproper + "-pie").getContext("2d");
    window.myPie = new Chart(ctx, config);


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
    var table2 = document.getElementById(organizationproper + ixpproper);

    DATA[Organization]["ixplist"][ixp]["Table"] = []
    dataSet = DATA[Organization]["ixplist"][ixp]["Table"]
    // var row = table.insertRow(1);
    id = 0
    DATA[Organization]["ixplist"][ixp]["downloadfiles"].forEach(function (element) {
        if (element[0].indexOf(iddown) !== -1) {

            var split = element[0].split(".csvx")[0].split("_");
            resolution = split[split.length - 1];
            csvelement = element[0].substring(0, element[0].length - 1);
            DATA[Organization]["ixplist"][ixp]["Table"][id] = [];
            DATA[Organization]["ixplist"][ixp]["Table"][id][0] = resolution;
            DATA[Organization]["ixplist"][ixp]["Table"][id][1] = "<b>" + csvelement + "</b>";
            DATA[Organization]["ixplist"][ixp]["Table"][id][2] = '<a href="' + outfolder + Organization + "/" + element[0] + '" download="' + csvelement + '"> Save <i class="fa fa-save"></i>   </a>'
            DATA[Organization]["ixplist"][ixp]["Table"][id][3] = outfolder + Organization + "/" + element[0];
            DATA[Organization]["ixplist"][ixp]["Table"][id][4] = element[0];
            DATA[Organization]["ixplist"][ixp]["Table"][id][5] = organization;
            DATA[Organization]["ixplist"][ixp]["Table"][id][6] = ixp;
            id = id + 1
        }
        // console.log(element)

    });
    // remove last value (to keep visual effect)
    // table.deleteRow(table.children[1].children.length)


    TABLE[organizationproper + ixpproper] = $('#' + organizationproper + ixpproper).DataTable({
        data: DATA[Organization]["ixplist"][ixp]["Table"],
        columns: [
            {title: "Name"},
            {title: "Resolution"},
            {title: ""},
            {title: ""},
            {title: ""},
            {title: ""},
            {title: ""}
        ],
        "columnDefs": [
            {
                "targets": [3],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [4],
                "visible": false,
                "searchable": false
            }, {
                "targets": [5],
                "visible": false,
                "searchable": false
            }, {
                "targets": [6],
                "visible": false,
                "searchable": false
            }
        ],
        // dom: "Bfrtip",
        "dom": '<"top"fi>rt<"bottom"Bp><"clear">',
        "iDisplayLength": 5,
        buttons: [
            {
                extend: "copy",
                className: "btn-sm"
            },
            {
                extend: "csv",
                className: "btn-sm"
            }
        ],
        responsive: true,
        "info": false,
        "order": [[1, "desc"]]
    });

    $('#' + organizationproper + ixpproper).on('click', 'tr', function () {
        var data = TABLE[this.offsetParent.id].row(this).data();
        previewdata(data);

    });


}
function previewdata(tableCell) {
    // console.log(tableCell)
    tableCell.forEach(function (element, index) {
        var div = document.createElement("div");
        div.innerHTML = element;
        // var text = div.textContent || div.innerText || "";
        tableCell[index] = div.innerText
    });


    // organization = tableCell.cells[3].innerText
    resolution = tableCell[0]
    dataname = tableCell[4]
    datafile = tableCell[3]
    organization = tableCell[5]
    ixp = tableCell[6]
    csvelement = tableCell[1]

    organizationproper = organization.replace(/\./gi, "").replace(/ /gi, "_")
    // ixpproper = ixp.replace(/\./gi, "").replace(/ /gi, "_")
    datanamepoper = dataname.replace(/\./gi, "").replace(/ /gi, "_")

    var $BOX_PANEL = $("#" + datanamepoper).closest('.closable');
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
                datanamepoper: datanamepoper,
                orgapropername: organizationproper,
                folder: outfolder,
                ixpname: ixp,
                ixppropername: ixpproper,
                csvelement: csvelement
            });
            $("#preview").before(rendered);
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
    var ctx = document.getElementById(datanamepoper);
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
        options: {elements: {point: {radius: 0}}}
    });
}