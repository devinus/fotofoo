// ==========================================================================
// Project:   Fotofoo.MediaDataSource
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your Data Source Here)

  @extends SC.DataSource
*/
Fotofoo.MediaDataSource = SC.DataSource.extend(
/** @scope Fotofoo.MediaDataSource.prototype */ {

  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
    if (query.get('isLocal')) return NO;

    SC.Request.getUrl(Fotofoo.ROOT_MEDIA_URL)
      .set('isJSON', YES)
      .notify(this, this._didFetch, { query: query, store: store })
      .send();

    return YES;
  },

  _didFetch: function(request, params) {
    var store = params.store,
        query = params.query,
        response = request.get('response');

    if (SC.$ok(response)) {
      var storeKey = store.loadRecord(Fotofoo.Folder, response);
      store.loadQueryResults(query, [storeKey]);
      store.dataSourceDidFetchQuery(query);
    } else store.dataSourceDidErrorQuery(query, response);
  },

  // ..........................................................
  // RECORD SUPPORT
  // 

  retrieveRecord: function(store, storeKey) {
    var id = store.idFor(storeKey),
        params = { store: store, storeKey: storeKey },
        safeId = Fotofoo.encodeGuid(id),
        url = Fotofoo.urlJoin(Fotofoo.ROOT_MEDIA_URL, safeId);

    SC.Request.getUrl(url)
      .set('isJSON', YES)
      .notify(this, this._didRetrieveRecord, params)
      .send();

    return YES;
  },

  _didRetrieveRecord: function(request, params) {
    var store = params.store,
        storeKey = params.storeKey,
        response = request.get('response');

    if (SC.$ok(response)) {
      store.dataSourceDidComplete(storeKey, response);
    } else store.dataSourceDidError(storeKey, response);
  },

  createRecord: function(store, storeKey) {
    var id = store.idFor(storeKey),
        recordType = store.recordTypeFor(storeKey),
        data = store.readDataHash(storeKey),
        params = { store: store, storeKey: storeKey },
        safeId = Fotofoo.encodeGuid(id),
        url = Fotofoo.urlJoin(Fotofoo.ROOT_MEDIA_URL, safeId);

    if (recordType === Fotofoo.File) return NO;

    SC.Request.postUrl(url)
      .set('isJSON', YES)
      .notify(this, this._didCreateRecord, params)
      .send(data);

    return YES;
  },

  _didCreateRecord: function(request, params) {
    var store = params.store,
        storeKey = params.storeKey,
        response = request.get('response');

    if (SC.$ok(response)) {
      store.dataSourceDidComplete(storeKey, response, response.guid);
    } else store.dataSourceDidError(storeKey, response);
  },

  updateRecord: function(store, storeKey) {
    var id = store.idFor(storeKey),
        data = store.readDataHash(storeKey),
        params = { store: store, storeKey: storeKey },
        safeId = Fotofoo.encodeGuid(id),
        url = Fotofoo.urlJoin(Fotofoo.ROOT_MEDIA_URL, safeId);

    SC.Request.putUrl(url)
      .set('isJSON', YES)
      .notify(this, this._didUpdateRecord, params)
      .send(data);

    return YES;
  },

  _didUpdateRecord: function(request, params) {
    var store = params.store,
        storeKey = params.storeKey,
        response = request.get('response');

    if (SC.$ok(response)) {
      store.dataSourceDidComplete(storeKey, response, response.guid);
    } else store.dataSourceDidError(storeKey, response);
  },

  destroyRecord: function(store, storeKey) {
    return NO;
  }

}) ;
