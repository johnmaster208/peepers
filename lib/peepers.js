import request from 'request-promise'
import cheerio from 'cheerio'
import emoji from 'node-emoji'
import ora from 'ora'
import { STATUS } from '../constants/index'
class Peepers {
    constructor() {
        this.results = []
        this.threshold = 100
        this.spinner = ora({
            spinner: 'arc'
        }).start()
    }
    searchThresholdSurpassed () {
        return this.results.length >= this.threshold ? true : false
    }
    generateRandomTimeout () {
        return parseInt((Math.random() * 10) * 1000);
    }
    workingAnim (status=null) {
        switch(status) {
            case STATUS.PENDING: {
                this.spinner.text = 'Peeping around ' + emoji.get("coffee") + '...'
                break
            }
            case STATUS.COMPLETED: {
                this.spinner.text = "Calculating Results...";
                this.spinner.text = this.results.length + " Results found.";
                break
            }
            case STATUS.PAGINATING: {
                this.spinner.text = "Paginating...";
                break
            }
            case STATUS.ABORT: {
                this.spinner.text = 'Exiting after ' + this.threshold + ' search results...'
                this.spinner.stop()
                break
            }
            case STATUS.SUCCESS: {
                this.spinner.succeed('Peeping SUCCESSFUL ' + emoji.get("smiley"))
                break
            }
            case STATUS.FAILURE: {
                this.spinner.text = "Peeping failed. Something happened on the network side we couldn't make a request properly. This typically means Google is blocking you, or something is wrong with your network."
                this.spinner.stop()
                break
            }
            default: {
                this.spinner.stop()
                // return
            }
        }
    }
    executeQuery (keywords=null, pagerLink=null) {
        const url = keywords !== null ? `https://google.com/search?q=${keywords}` : `https://google.com/${pagerLink}`
        this.workingAnim(STATUS.PENDING)
        request(url)
        .then( resp => {
            if(resp) { 
                let $ = cheerio.load(resp)
                let $links = $('a');
                let pagerLinkExists = $('table#nav').find('a').last().text() === 'Next' ? true : false;
                $links.each( (i, element) => {
                    let $searchResult = $(element).parent('h3.r').text();
                    let $nextLink = $(element).text() === 'Next' ? $(element).attr('href') : false;
                    if($nextLink){
                        if(this.searchThresholdSurpassed()) {
                            this.workingAnim(STATUS.ABORT);
                            this.printResults();
                            console.log('Exiting after ' + this.threshold + ' search results...');
                            return process.exit(22);
                        } else {
                            this.executeQuery(null,$nextLink);
                        }
                    }
                    if($searchResult.length !== 0) {
                        this.results.push($searchResult);
                        this.workingAnim(STATUS.PAGINATING)
                    }
                })
                if(pagerLinkExists) {
                    this.workingAnim(STATUS.PAGINATING)
                    setTimeout(() => {}, this.generateRandomTimeout())
                } else {
                    // this.workingAnim(STATUS.COMPLETED)
                    this.workingAnim(0)
                    console.log(this.results.length + " Results found.")
                    this.printResults()

                }
            } else {
                this.workingAnim(STATUS.FAILURE)
            }
            
        })
        .catch( err => {
            console.log(err)
        });
    }
    printResults() { 
        console.log(this.results);
        this.workingAnim(STATUS.SUCCESS)
    }
}

export default Peepers