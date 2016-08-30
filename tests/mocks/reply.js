'use strict';

const elv = require('elv');

const me = new WeakMap();

class Response {
  constructor(code, payload) {
    me.set(this, {
      statusCode: elv.coalesce(code, 200),
      payload: payload,
      headers: {},
      settings: {
        charset: 'utf-8',
        encoding: 'utf8',
        passThrough: true,
        stringify: {},
        varyEtag: false
      }
    });
  }

  get statusCode() { return me.get(this).statusCode; }
  get headers() { return me.get(this).headers; }
  get payload() { return me.get(this).payload; }
  get settings() { return me.get(this).settings; }

  code(statusCode) {
    me.get(this).statusCode = statusCode;
    return this;
  }

  header(name, value, options) {
    me.get(this).headers[name] = value;
    return this;
  }

  type(mimeType) {
    me.get(this).headers['Content-Type'] = mimeType;
    return this;
  }
}

module.exports = (result) => {
  const code = (result instanceof Error) ? 500 : 200;
  return new Response(code, result);
};
