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
        })
    }
    searchThresholdSurpassed () {
        return this.results.length >= this.threshold ? true : false
    }
    generateRandomTimeout () {
        return parseInt((Math.random() * 10) * 1000);
    }
    workingAnim (status) {
        this.spinner.start()
        switch(status) {
            case STATUS.PENDING: {
                this.spinner.text = 'Peeping around ' + emoji.get("coffee") + '...'
                break
            }
            case STATUS.COMPLETED: {
                this.spinner.text = "Calculating Results...";
                break
            }
            case STATUS.PAGINATING: {
                this.spinner.text = "Paginating...";
                break
            }
            case STATUS.COMPILING: {
                this.spinner.text = "Compiling Results...";
                break;
            }
            case STATUS.ABORT: {
                this.spinner.text = 'Exiting after ' + this.threshold + ' search results...'
                break
            }
            case STATUS.SUCCESS: {
                this.spinner.succeed("Peeping SUCCESSFUL. " + this.results.length + " Results found. ")
                break
            }
            case STATUS.FAILURE: {
                this.spinner.text = "Peeping failed. Something happened on the network side we couldn't make a request properly. This typically means Google is blocking you, or something is wrong with your network."
                break
            }
            default: {
                this.spinner.text = "Working " + emoji.get("coffee") + '...'
            }
        }
        if(this.spinner.isSpinning) {
            this.spinner.stop()
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
                            this.printResults();
                            this.workingAnim(STATUS.ABORT);
                            return process.exit(22);
                        } else {
                            this.workingAnim(STATUS.PAGINATING)
                            this.executeQuery(null,$nextLink);
                        }
                    }
                    if($searchResult.length !== 0) {
                        this.workingAnim(STATUS.COMPILING)
                        this.results.push($searchResult);
                    }
                })
                if(pagerLinkExists) {
                    this.workingAnim(STATUS.PAGINATING)
                    setTimeout(() => {}, this.generateRandomTimeout())
                } else {
                    // this.workingAnim(STATUS.COMPLETED)
                    this.workingAnim(0)
                    // console.log(this.results.length + " Results found.")
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