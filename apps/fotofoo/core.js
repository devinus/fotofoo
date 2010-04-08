// ==========================================================================
// Project:   Fotofoo
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Fotofoo = SC.Application.create(
  /** @scope Fotofoo.prototype */ {

  NAMESPACE: 'Fotofoo',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  // store: SC.Store.create().from(SC.Record.fixtures),
  store: SC.Store.create().from('Fotofoo.MediaDataSource'),

  // TODO: Add global constants or singleton objects needed by your app here.
  ROOT_MEDIA_URL: '/_media/',
  nowShowing: 'master',
  rootFolder: null,
  state: null,

  _SLASH_RE: /\//g,
  _ENCODED_PIPE_RE: /%7C/g,
  _MULTIPLE_SLASHES_RE: /\/+/g,
  _SURROUNDING_WHITESPACE_RE: /^\s+|\s+$/g,

  encodeGuid: function(guid) {
    var encoded = encodeURIComponent(guid.replace(this._SLASH_RE, '|'));
    return encoded.replace(this._ENCODED_PIPE_RE, '/');
  },

  urlJoin: function() {
    var joined = Array.prototype.join.call(arguments, '/');
    return joined.replace(this._MULTIPLE_SLASHES_RE, '/');
  },

  trim: function (str) {
    return String.prototype.trim ? String.prototype.trim.apply(str)
      : str.replace(this._SURROUNDING_WHITESPACE_RE, '');
  },

  _lastStateObserved: null,

  _stateDidChange: function() {
    var state = this.get('state');
    if (SC.typeOf(state) === SC.T_STRING) state = this.get(state);

    if (state !== this._lastStateObserved) {
      this._lastStateObserved = state;
      state.set('responderContext', this);
      this.makeFirstResponder(state);
    }
  }.observes('state')

}) ;
