// ==========================================================================
// Project:   Fotofoo.UploadView
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document Your View Here)

  @extends SCUI.Upload
*/
Fotofoo.UploadView = SCUI.UploadView.extend(
/** @scope Fotofoo.UploadView.prototype */ {

  layout: { width: 250, height: 35, centerX: 0, centerY: 5 },

  uploadTarget: function() {
    var id = Fotofoo.folderController.get('guid') || '/',
        safeId = Fotofoo.encodeGuid(id);
    return Fotofoo.urlJoin(Fotofoo.ROOT_MEDIA_URL, safeId);
  }.property()

});
