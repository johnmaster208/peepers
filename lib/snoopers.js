var request = require('request');
var cheerio = require('cheerio');
var emoji = require('node-emoji');
var ora = require('ora');

var snoopers = {
    workingAnim: ora('Working '+emoji.get("coffee")+'...'),
    executeKeywordQuery: function(keywords)  {
        var data = []; 
        var o = this.workingAnim.start();
        request(`https://google.com/search?q=${keywords}`,function(err, resp, html){
            if(!err && resp.statusCode == 200) {
                var $ = cheerio.load(html);
                var $links = $('a');
                $links.each(function(i, element){
                    var $searchResultLink = $(element).parent('h3.r').text();
                    var $nextPageLink = $(element).text() === 'Next' ? $(element).attr('href') : null;
                    if($searchResultLink.length !== 0) {
                        data.push($searchResultLink);
                        // while ( $nextPageLink !== null) {
                            if($nextPageLink !== null) {
                                data.concat(this.executePagerQuery($nextPageLink));
                            }
                        // }
                    }
                })                
                o.stop();
                return console.log(data);
            
            } else {
                o.stop();
                return console.log("Something happened on the network side we couldn't make a request properly. Are you connected to the internet?")
            }
        });  
    },
    executePagerQuery: function(nextPageLink) {
        var data = [];
        request(`https://google.com/${nextPageLink}`, function(err, resp, html){
            if(!err && resp.statusCode == 200) {
                var $ = cheerio.load(html);
                var $links = $('a');
                $links.each(function(i, element){
                    var $searchResultLink = $(element).parent('h3.r').text();
                    if($searchResultLink.length !== 0) {
                        data.push($searchResultLink);
                    }
                })                
                return data;
            } else {
                return console.log("Something happened on the network side we couldn't make a request properly. Are you connected to the internet?")
            }
        });
    }
}

module.exports = snoopers;