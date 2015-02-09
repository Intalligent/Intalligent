var mongoose = require('mongoose');

var FTPFilesSchema = new mongoose.Schema({
    fileName: {type: String}
}, { collection: config.app.customCollectionsPrefix+'ftp_files' })

FTPFilesSchema.statics.checkRemoteFTP = function(){
    var FTPFiles = this;
    var Client = require('ftp');
    var fs = require('fs');

    FTPFiles.find({},{},{}, function(err, files){
        if(err) throw err;

        var c = new Client();
        c.on('ready', function() {
            console.log('conection ready');
            c.list('ftp',function(err, list) {
                if (err) throw err;

                for (var i in list) {
                    if (list[i].name != '.' && list[i].name != '..') {
                        var found = false;

                        for (var j in files) {
                            if (list[i].name == files[j].fileName) {
                                console.log('found');
                                found = true;
                            }
                        }

                        if (!found) {
                            FTPFiles.downloadFile(list[i].name);

                        }
                    }
                }
                //console.dir(list);
                c.end();
            });
        });
        // connect to localhost:21 as anonymous
        //c.connect({host: '176.34.111.43', port: 21, user: 'bigbase', password: 'db-TEAM{555}', secure: false});
        c.connect({host: 'beevou.com', port: 21, user: 'u50049046-beevou', password: 'db-TEAM{999}', secure: false});
    });
}

FTPFilesSchema.statics.downloadFile = function(name){
    var FTPFiles = this;
    var Client = require('ftp');
    var fs = require('fs');
    var c = new Client();

    c.on('ready', function() {
        c.get('ftp/'+name, function(err, stream) {
            if (err) throw err;
            stream.once('close', function() { c.end(); });
            stream.pipe(fs.createWriteStream('ftp/'+name));

            FTPFiles.create({
                fileName : name
            }, function(err){
                if(err) throw err;
            });

            c.end();
        });
    });

    c.connect({host: 'beevou.com', port: 21, user: 'u50049046-beevou', password: 'db-TEAM{999}', secure: false});
}

/*

 <Host>beevou.com</Host>
 <Port>21</Port>
 <Protocol>0</Protocol>
 <Type>0</Type>
 <User>u50049046-beevou</User>
 <Pass>db-TEAM{999}</Pass>
 <Account>u50049046-beevou</Account>
 <Logontype>4</Logontype>
 <TimezoneOffset>0</TimezoneOffset>
 <PasvMode>MODE_DEFAULT</PasvMode>
 <MaximumMultipleConnections>0</MaximumMultipleConnections>
 <EncodingType>Auto</EncodingType>
 <BypassProxy>0</BypassProxy>
 <Name>Beevou.com</Name>
 <Comments />
 <LocalDir />
 <RemoteDir />
 <SyncBrowsing>0</SyncBrowsing>Beevou.com&#x0A;

 <Host>176.34.111.43</Host>
 <Port>21</Port>
 <Protocol>0</Protocol>
 <Type>0</Type>
 <User>bigbase</User>
 <Pass>db-TEAM{555}</Pass>
 <Account>bigbase</Account>
 <Logontype>4</Logontype>
 <TimezoneOffset>0</TimezoneOffset>
 <PasvMode>MODE_ACTIVE</PasvMode>
 <MaximumMultipleConnections>0</MaximumMultipleConnections>
 <EncodingType>Auto</EncodingType>
 <BypassProxy>0</BypassProxy>
 <Name>Linux</Name>
 <Comments />
 <LocalDir />
 <RemoteDir />
 <SyncBrowsing>0</SyncBrowsing>Linux&#x0A;

*/

var FTPFiles = connection.model('FTPFiles', FTPFilesSchema);
module.exports = FTPFiles;