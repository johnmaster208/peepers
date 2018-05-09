var peepers = require('../../lib/peepers');
var expect = require('chai').expect;
var sinon = require('sinon');

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


});