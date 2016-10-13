'use strict';

const elv = require('elv');
const errs = require('errors-node');

module.exports = (e, reply) => {
  if (typeof e !== 'object')
    throw new TypeError('The argument "e" must be an object.');

  if (e === null)
    throw new TypeError('The argument "e" cannot be null.');

  if (typeof reply !== 'function')
    throw new TypeError('The argument "reply" must be a function.');

  if (e instanceof errs.FormatError) {
    return reply({
      message: elv.coalesce(e.message, errs.FormatError.defaultMessage)
    }).type('application/json').code(400);
  }

  if (e instanceof errs.ValidationError) {
    return reply({
      message: elv.coalesce(e.message, errs.ValidationError.defaultMessage),
      data: elv.coalesce(e.data, {})
    }).type('application/json').code(400);
  }

  if (e instanceof errs.CredentialsError) {
    if (typeof e.data !== 'string')
      throw new TypeError('No "data" property provided for specifying auth.');

    return reply({
      message: elv.coalesce(e.message, errs.CredentialsError.defaultMessage)
    }).type('application/json').code(401).header('WWW-Authenticate', e.data);
  }

  if (e instanceof errs.UnauthorizedError) {
    return reply({
      message: elv.coalesce(e.message, errs.UnauthorizedError.defaultMessage)
    }).type('application/json').code(403);
  }

  if (e instanceof errs.NotFoundError) {
    return reply({
      message: elv.coalesce(e.message, errs.NotFoundError.defaultMessage)
    }).type('application/json').code(404);
  }

  if (e instanceof errs.ConcurrencyError) {
    return reply({
      message: elv.coalesce(e.message, errs.ConcurrencyError.defaultMessage),
      data: elv.coalesce(e.data, {})
    }).type('application/json').code(409);
  }

  if (e instanceof errs.TempUnavailableError) {
    return reply({
      message: elv.coalesce(e.message, errs.TempUnavailableError.defaultMessage)
    }).type('application/json').code(503);
  }

  return reply({
    message: elv.coalesce(e.message, 'An unspecified error has occurred.')
  }).type('application/json').code(500);
};
