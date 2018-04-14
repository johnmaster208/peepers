var request = require('request');
var cheerio = require('cheerio');
var emoji = require('node-emoji');
var ora = require('ora');

var snoopers = {
    results: [],
    generateRandomTimeout: function() {
        return parseInt((Math.random() * 10) * 1000);
    },
    workingAnim: ora('Snooping around '+emoji.get("coffee")+'...').start(),
    executeQuery: function(keywords=null, pagerLink=null) {
        var self = this;
        var url = '';
        if(keywords !== null) {
          url = `https://google.com/search?q=${keywords}`;
        } else {
          url = `https://google.com/${pagerLink}`
        }
        request(url,function(err, resp, html){
            if(!err && resp.statusCode == 200) {
                self.workingAnim.text = "Querying results...";
                var $ = cheerio.load(html);
                var $links = $('a');
                var $pagerLinkExists = $('a.fl').last().text() === 'Next' ? true : false;
                $links.each(function(i, element){
                    var $searchResult = $(element).parent('h3.r').text();
                    var $nextLink = $(element).text() === 'Next' ? $(element).attr('href') : false;
                    if($nextLink){
                        self.workingAnim.text = "Scraping...";
                        setTimeout(function() { self.executeQuery(null,$nextLink) }, self.generateRandomTimeout());
                    }
                    if($searchResult.length !== 0) {
                        self.results.push($searchResult);
                        self.workingAnim.text = self.results.length + " Results found.";
                    }
                })
                if(!$pagerLinkExists || self.results.count >= 100) {
                    self.workingAnim.text = "Gathering results...";
                    setTimeout(function() {
                        self.workingAnim.stop();
                        self.printResults();
                    }, self.generateRandomTimeout());
                }
            } else {
                self.workingAnim.stop();
                console.log(err);
                console.log("Something happened on the network side we couldn't make a request properly. Are you connected to the internet?")
            }
        });
    },
    printResults: function() {
        var self = this;
        console.log(self.results);
    }
}

module.exports = snoopers;