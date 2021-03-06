import {Processor} from './Processor';
import {JsonLdError} from './JsonLdError';
import {documentLoader} from './documentLoader';
import {expand} from './expand';
import {compact} from './compact';
export const flatten = function(input, ctx, options, callback) {
      if (arguments.length < 1) {
        return setImmediate(function() {
          callback(new TypeError('Could not flatten, too few arguments.'));
        });
      }

      // get arguments
      if (typeof options === 'function') {
        callback = options;
        options = {};
      } else if (typeof ctx === 'function') {
        callback = ctx;
        ctx = null;
        options = {};
      }
      options = options || {};

      // set default options
      if (!('base' in options)) {
        options.base = (typeof input === 'string') ? input : '';
      }
      if (!('documentLoader' in options)) {
        options.documentLoader = documentLoader;
      }

      // expand input
      expand(input, options, function(err, _input) {
        if (err) {
          return callback(new JsonLdError(
            'Could not expand input before flattening.',
            'jsonld.FlattenError', {
              cause: err
            }));
        }

        var flattened;
        try {
          // do flattening
          flattened = new Processor().flatten(_input);
        } catch (ex) {
          return callback(ex);
        }

        if (ctx === null) {
          return callback(null, flattened);
        }

        // compact result (force @graph option to true, skip expansion)
        options.graph = true;
        options.skipExpansion = true;
        compact(flattened, ctx, options, function(err, compacted) {
          if (err) {
            return callback(new JsonLdError(
              'Could not compact flattened output.',
              'jsonld.FlattenError', {
                cause: err
              }));
          }
          callback(null, compacted);
        });
      });
    };
