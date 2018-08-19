var peepers = require('../../lib/peepers');
var expect = require('chai').expect;
var sinon = require('sinon');
var request = require('request');
var nock = require('nock');
var http = require('http');

describe('Peepers', function() {

  describe('Gets initialized which...', function() {
    it('Expects Peepers JS import to be a typeof object.', function() {
      expect(peepers).to.be.an('object');
    })
    it('Expects that constructor contains a results property.', function() {
      expect(peepers).to.have.property('results');
    });
    it('Expects results to be an array', function() {
      expect(peepers.results).to.be.an('array');
    });
    it('Expects the results property has been uninitalized (set to 0).', function() {
      expect(peepers.results.length).to.equal(0); 
    });
    it('Expects that constructor contains a threshold property.', function() {
      expect(peepers).to.have.property('threshold');
    });
    it('Expects that the threshold property has been set to the default value.', function() {
      expect(peepers.threshold).to.equal(100);
    });
    it('Expects that constructor contains a searchThresholdSurpassed function.', function() {
      expect(peepers).to.have.property('searchThresholdSurpassed');
    })
    it('Expects searchThresholdSurpassed to be a typeof function', function() {
      expect(peepers.searchThresholdSurpassed).to.be.a('function');
    });
    it('Expects that constructor contains a generateRandomTimeout property.', function() {
      expect(peepers).to.have.property('generateRandomTimeout');
    });
    it('Expects generateRandomTimeout to be a typeof function.', function() {
      expect(peepers.generateRandomTimeout).to.be.a('function');
    });
    it('Expects that constructor contains a workingAnim property', function() {
      expect(peepers).to.have.property('workingAnim');
    });
    it('Expects that constructor contains an executeQuery property.', function() {
      expect(peepers).to.have.property('executeQuery');
    });
    it('Expects executeQuery to be a typeof function.', function() {
      expect(peepers.executeQuery).to.be.a('function');
    });
    it('Expects that constructor contains a printResults property.', function() {
      expect(peepers).to.have.property('printResults');
    });
    it('Expects printResults to be a typeof function.', function() {
      expect(peepers.printResults).to.be.an('function');
    });
  });

  describe('Calls function executeQuery()...', function() {
    var executeQueryStub = sinon.stub(peepers, 'executeQuery');
    var mockKeywords = 'Foo';
    this.afterEach( function() {
      nock.cleanAll()
    })
    var webRequest = {
      "statusCode": 200,
      "body": "<html></html>",
      "headers": {
        "date": "Sat, 18 Aug 2018 01:54:43 GMT",
        "expires": "-1",
        "cache-control": "private, max-age=0",
        "content-type": "text/html; charset=ISO-8859-1",
        "server": "gws",
        "x-xss-protection": "1; mode=block",
        "x-frame-options": "SAMEORIGIN",
        "set-cookie": [
          "1P_JAR=2018-08-18-01; expires=Mon, 17-Sep-2018 01:54:43 GMT; path=/; domain=.google.com",
        ],
        "alt-svc": "quic=\":443\"; ma=2592000; v=\"44,43,39,35\"",
        "accept-ranges": "none",
        "vary": "Accept-Encoding",
        "connection": "close"
      },
      "request": {
        "uri": {
          "protocol": "https:",
          "slashes": true,
          "auth": null,
          "host": "www.google.com",
          "port": 443,
          "hostname": "www.google.com",
          "hash": null,
          "search": "?q=stonehenge",
          "query": "q=stonehenge",
          "pathname": "/search",
          "path": "/search?q=stonehenge",
          "href": "https://www.google.com/search?q=stonehenge"
        },
        "method": "GET",
        "headers": {
          "referer": "https://google.com/search?q=stonehenge"
        }
      }
    }
    var peepAPI = nock("https://google.com/")
      .get("/search")
      .query({
        q: "stonehenge"
      })
      .reply(200, webRequest);

    it('Expects the function to get invoked with keywords args...', function() {
      executeQueryStub(mockKeywords, null);
      expect(executeQueryStub.callCount).to.equal(1);
    });
    it('Expects to make a HTTP request and receive back an HTML document...', function(done) {
      executeQueryStub(mockKeywords, null);
      request(`https://google.com/search?q=${mockKeywords}`, function(err, resp, html){
        expect(html).to.not.be.undefined;
        done();
      });
    });
    it('Use nock for validation of headers and body...', function() {
      request({ url: 'http://google.com/search?q=stonehenge'}, function (err, resp) {
        expect(resp.headers['content-type']).to.be("text/html; charset=ISO-8859-1")
        expect(resp.body).to.not.be.undefined;
      });
    })
  });
});