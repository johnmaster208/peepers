var request = require('request');
var cheerio = require('cheerio');
var emoji = require('node-emoji');
var ora = require('ora');

var snoopers = {
    results: [],
    workingAnim: ora('Working '+emoji.get("coffee")+'...'),
    executeQuery: function(keywords=null, pagerLink=null) {
        var url = '';
        var o = this.workingAnim.start();
        var self = this;
        if(keywords !== null) {
          url = `https://google.com/search?q=${keywords}`;
        } else {
          url = `https://google.com/${pagerLink}`
        }
        request(url,function(err, resp, html){
            if(!err && resp.statusCode == 200) {
                var $ = cheerio.load(html);
                var $links = $('a');
                $links.each(function(i, element){
                    var $searchResult = $(element).parent('h3.r').text();
                    var $pagerLink = $(element).text() === 'Next' ? $(element).attr('href') : false;
                    if($searchResult.length !== 0) {
                        self.results.push($searchResult); 
                    }
                    if($pagerLink){
                        console.log('nextPage link is there, so requesting more links...');
                        self.executeQuery(null,$pagerLink);
                    }
                })                
                o.stop();
                return console.log(self.results);
            
            } else {
                o.stop();
                console.log(err);
                return console.log("Something happened on the network side we couldn't make a request properly. Are you connected to the internet?")
            }
        });  
    }
}

module.exports = snoopers;