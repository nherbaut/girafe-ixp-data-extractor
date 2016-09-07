var timeFormat = 'MM/DD/YYYY HH:mm';
var targetfolder = "./target/";
var targetfile = targetfolder + "target.csv";
var urlVideo = "http://localhost:9002/cdn.mpd";
var urlVideoSD = "http://localhost:9003/cdnld.mpd";
var urlVideoHD = "http://localhost:9003/cdnhd.mpd";
var urlMPD = "/api/simu/mpd/";


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
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "<b>" + element[0] + "</b>";
    cell2.innerHTML = element[1];
    cell3.innerHTML = element[2].replace(/\./gi, ", ");
}, this);
// remove last value (to keep visual effect)
table.deleteRow(table.children[1].children.length)

if (table != null) {
    for (var i = 1; i < table.rows.length; i++) {
        table.rows[i].onclick = function () {
            tableText(this);
        };
    }
}

function tableText(tableCell) {
    ixp = tableCell.cells[0].innerText
    propername=ixp.replace(/\./gi, "")
    var $BOX_PANEL = $("#"+propername).closest('.closable');
    $BOX_PANEL.remove();
    $.ajax({
        url: "./app/html/template.html",
        async: false,
        success: function (template) {
            //Parse it (optional, only necessary if template is to be used again)
            Mustache.parse(template);
            //Render the data into the template
            var rendered = Mustache.render(template, {ixpname: ixp,ixppropername:propername});
            $("#ixp").before(rendered);
        },
        dataType: "text",
        complete: function () {
            // call a function on complete
        }
    });

    $.ajax({
        url: targetfolder + ixp + ".csv",
        async: false,
        success: function (csvd) {
            dataixp = $.csv.toArrays(csvd);
        },
        dataType: "text",
        complete: function () {
            // call a function on complete
        }
    });
    refresh();

    var table = document.getElementById(ixp);
    var row = table.insertRow(1);
    dataixp.forEach(function (element) {
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = "<b>" + element[0] + "</b>";
        cell2.innerHTML = element[1];
        cell3.innerHTML = humanFileSize(element[2]*1024*1024,true);
    }, this);
    table.deleteRow(table.children[1].children.length)
}