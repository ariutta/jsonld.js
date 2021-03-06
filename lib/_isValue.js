import {_isObject} from './_isObject';
export function _isValue(v) {
      // Note: A value is a @value if all of these hold true:
      // 1. It is an Object.
      // 2. It has the @value property.
      return _isObject(v) && ('@value' in v);
    }
