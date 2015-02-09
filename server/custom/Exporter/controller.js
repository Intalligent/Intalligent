var Exporter = connection.model('Exporter');

require('../../core/controller.js');

function ExporterController(model) {
    this.model = model;
    this.searchFields = [];
}

ExporterController.inherits(Controller);

var controller = new ExporterController(Exporter);

exports.ExporterExport = function(req,res){
    var data = req.query, find = {}, fields = {};

    if (typeof data.model == 'undefined' ) {
        res.send(201, {result: 0, msg: "model is required"});
        return;
    }

    var Model = connection.model(data.model);

    if (data.fields) {
        var dataFields = String(data.fields).split(',');

        for (var i in dataFields) {
            fields[dataFields[i]] = 1;
        }
    }

    Model.find(find, fields, {limit: 1000}, function(err, items){
        if(err) throw err;

        var result = getXMLHeader();

        for (var i in items) {
            var item = items[i].toObject();

            result = result+   '<ss:Row>';

            for (var j in item) {
                if (j > 0) {
                    result = result+   '<ss:Cell  ss:StyleID="s28"><Data ss:Type="String">'+item[j]+'</Data></ss:Cell>';
                }
            }

            result = result+   '</ss:Row>';
        }

        result += getXMLFooter();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Export.xml");
        res.end(result, 'binary');
    });
};

function getXMLHeader() {
    var result = '';

    result = result+  '<?xml version="1.0"?>';
    result = result+  '<?mso-application progid="Excel.Sheet"?>';
    result = result+  '<Workbook';
    result = result+  '  xmlns:x="urn:schemas-microsoft-com:office:excel"';
    result = result+  '  xmlns="urn:schemas-microsoft-com:office:spreadsheet"';
    result = result+  '  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">';

    result = result+  '<Styles>';
    result = result+  ' <Style ss:ID="Default" ss:Name="Normal">';
    result = result+  '  <Alignment ss:Vertical="Bottom"/>';
    result = result+  '  <Borders/>';
    result = result+  '  <Font/>';
    result = result+  '  <Interior/>';
    result = result+  '  <NumberFormat/>';
    result = result+  '  <Protection/>';
    result = result+  ' </Style>';
    result = result+  ' <Style ss:ID="s27">';
    result = result+  '  <Font x:Family="Swiss" ss:Color="#000000" ss:Bold="1"/>';
    result = result+  ' </Style>';
    result = result+  ' <Style ss:ID="s28">';
    result = result+  '  <Font x:Family="Swiss" ss:Color="#000000" ss:Bold="0"/>';
    result = result+  ' </Style>';
    result = result+  ' <Style ss:ID="s21">';
    result = result+  '  <NumberFormat ss:Format="yyyy\-mm\-dd"/>';
    result = result+  ' </Style>';
    result = result+  ' <Style ss:ID="s22">';
    result = result+  '  <NumberFormat ss:Format="yyyy\-mm\-dd\ hh:mm:ss"/>';
    result = result+  ' </Style>';
    result = result+  ' <Style ss:ID="s23">';
    result = result+  '  <NumberFormat ss:Format="hh:mm:ss"/>';
    result = result+  ' </Style>';
    result = result+  '</Styles>';

    result = result+  ' <Worksheet ss:Name="Sheet1">';
    result = result+  '  <ss:Table>';

    return result;
}

function getXMLFooter() {
    var result = '';

    result = result+   '</ss:Table>';
    result = result+   '</Worksheet>';
    result = result+   '</Workbook>';

    return result;
}