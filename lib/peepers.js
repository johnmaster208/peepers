var request = require('request');
var cheerio = require('cheerio');
var emoji = require('node-emoji');
var ora = require('ora');

var peepers = {
    results: [],
    threshold: 100,
    searchThresholdSurpassed: function() {
        var self = this;
        if(self.results.length >= self.threshold){
            return true;
        } else {
            return false;
        }
    },
    generateRandomTimeout: function() {
        return parseInt((Math.random() * 10) * 1000);
    },
    workingAnim: ora('Peeping around '+emoji.get("coffee")+'...'),
    executeQuery: function(keywords=null, pagerLink=null) {
        var self = this;
        self.workingAnim.start();
        var url = '';
        if(keywords !== null) {
          url = `https://google.com/search?q=${keywords}`;
        } else {
          url = `https://google.com/${pagerLink}`
        }
        request(url,function(err, resp, html){
            self.workingAnim.text = "Querying results...";
            // console.log(resp)
            setTimeout((function(){}),self.generateRandomTimeout());
            if(!err && resp.statusCode == 200) {
                self.workingAnim.text = "Scraping...";
                setTimeout((function(){}),self.generateRandomTimeout());
                var $ = cheerio.load(html);
                console.log($);
                var $links = $('a');
                var $pagerLinkExists = $('table#nav').find('a').last().text() === 'Next' ? true : false;
                $links.each(function(i, element){
                    var $searchResult = $(element).parent('h3.r').text();
                    var $nextLink = $(element).text() === 'Next' ? $(element).attr('href') : false;
                    if($nextLink){
                        if(self.searchThresholdSurpassed()) {
                            self.workingAnim.stop();
                            self.printResults();
                            console.log('Exiting after ' + self.threshold + ' search results...');
                            return process.exit(22);
                        } else {
                            self.executeQuery(null,$nextLink);
                        }
                    }
                    if($searchResult.length !== 0) {
                        self.results.push($searchResult);
                        self.workingAnim.text = self.results.length + " Results found.";
                    }
                })
                if($pagerLinkExists) {
                    self.workingAnim.text = "Paginating...";
                    setTimeout((function(){}),self.generateRandomTimeout());
                } else {
                    self.workingAnim.text = "Calculating Results...";
                    self.workingAnim.stop();
                    self.printResults();
                    console.log('Peeping COMPLETE.');
                    console.log('Found ' + self.results.length + ' results.');
                    return process.exit(22);
                }
            } else {
                self.workingAnim.stop();
                console.log(err);
                console.log("Something happened on the network side we couldn't make a request properly. This typically means Google is blocking you, or something is wrong with your network. Try again later.")
            }
        });
    },
    printResults: function() {
        var self = this;
        console.log(self.results);
    }
}

module.exports = peepers;