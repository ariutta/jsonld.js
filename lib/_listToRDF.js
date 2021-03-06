import {_objectToRDF} from './_objectToRDF';
import {RDF_FIRST,RDF_REST,RDF_NIL} from './literalVarDecs';
export function _listToRDF(list, issuer, subject, predicate, triples) {
      var first = {
        type: 'IRI',
        value: RDF_FIRST
      };
      var rest = {
        type: 'IRI',
        value: RDF_REST
      };
      var nil = {
        type: 'IRI',
        value: RDF_NIL
      };

      for (var i = 0; i < list.length; ++i) {
        var item = list[i];

        var blankNode = {
          type: 'blank node',
          value: issuer.getId()
        };
        triples.push({
          subject: subject,
          predicate: predicate,
          object: blankNode
        });

        subject = blankNode;
        predicate = first;
        var object = _objectToRDF(item);

        // skip null objects (they are relative IRIs)
        if (object) {
          triples.push({
            subject: subject,
            predicate: predicate,
            object: object
          });
        }

        predicate = rest;
      }

      triples.push({
        subject: subject,
        predicate: predicate,
        object: nil
      });
    }
