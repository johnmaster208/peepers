var expect = require('expect');
var peepers = require('../../lib/peepers');
var sinon = require('sinon');

describe('Peepers', function() {

  describe('Gets initialized which...', function() {
    it('Expects Peepers JS import to be a typeof object.', function() {
      expect(typeof peepers).toBe('object');
    })
    it('Expects that constructor contains a results property.', function() {
      expect(peepers.hasOwnProperty('results')).toBe(true);
    });
    it('Expects results to be an array', function() {
      expect(Object.prototype.toString.call(peepers.results)).toBe('[object Array]');
    });
    it('Expects the results property has been uninitalized (set to 0).', function() {
      expect(peepers.results.length).toBe(0);
    });
    it('Expects that constructor contains a threshold property.', function() {
      expect(peepers.hasOwnProperty('threshold')).toBe(true);
    });
    it('Expects that the threshold property has been set to the default value.', function() {
      expect(peepers.threshold).toBe(100);
    });
    it('Expects that constructor contains a searchThresholdSurpassed function.', function() {
      expect(peepers.hasOwnProperty('searchThresholdSurpassed')).toBe(true);
    })
    it('Expects searchThresholdSurpassed to be a typeof function', function() {
      expect(typeof peepers.searchThresholdSurpassed).toBe('function');
    });
    it('Expects that constructor contains a generateRandomTimeout property.', function() {
      expect(peepers.hasOwnProperty('generateRandomTimeout')).toBe(true);
    });
    it('Expects generateRandomTimeout to be a typeof function.', function() {
      expect(typeof peepers.generateRandomTimeout).toBe('function');
    });
    it('Expects that constructor contains a workingAnim property', function() {
      expect(peepers.hasOwnProperty('workingAnim')).toBe(true);
    })
  });

});