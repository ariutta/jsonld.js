import {_isString} from './_isString';
import {Processor} from './Processor';
import {JsonLdError} from './JsonLdError';
import {_rdfParsers} from './_rdfParsers';
import {RDF} from './literalVarDecs';
export const fromRDF = function(dataset, options, callback) {
      if (arguments.length < 1) {
        return setImmediate(function() {
          callback(new TypeError('Could not convert from RDF, too few arguments.'));
        });
      }

      // get arguments
      if (typeof options === 'function') {
        callback = options;
        options = {};
      }
      options = options || {};

      // set default options
      if (!('useRdfType' in options)) {
        options.useRdfType = false;
      }
      if (!('useNativeTypes' in options)) {
        options.useNativeTypes = false;
      }

      if (!('format' in options) && _isString(dataset)) {
        // set default format to nquads
        if (!('format' in options)) {
          options.format = 'application/nquads';
        }
      }

      setImmediate(function() {
        // handle special format
        var rdfParser;
        if (options.format) {
          // check supported formats
          rdfParser = options.rdfParser || _rdfParsers[options.format];
          if (!rdfParser) {
            return callback(new JsonLdError(
              'Unknown input format.',
              'jsonld.UnknownFormat', {
                format: options.format
              }));
          }
        } else {
          // no-op parser, assume dataset already parsed
          rdfParser = function() {
            return dataset;
          };
        }

        var callbackCalled = false;
        try {
          // rdf parser may be async or sync, always pass callback
          dataset = rdfParser(dataset, function(err, dataset) {
            callbackCalled = true;
            if (err) {
              return callback(err);
            }
            _declobberedfromRDF(dataset, options, callback);
          });
        } catch (e) {
          if (!callbackCalled) {
            return callback(e);
          }
          throw e;
        }
        // handle synchronous or promise-based parser
        if (dataset) {
          // if dataset is actually a promise
          if ('then' in dataset) {
            return dataset.then(function(dataset) {
              _declobberedfromRDF(dataset, options, callback);
            }, callback);
          }
          // parser is synchronous
          _declobberedfromRDF(dataset, options, callback);
        }

        function _declobberedfromRDF(dataset, options, callback) {
          // convert from RDF
          new Processor().fromRDF(dataset, options, callback);
        }
      });
    };
