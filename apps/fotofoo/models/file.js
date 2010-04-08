// ==========================================================================
// Project:   Fotofoo.File
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Fotofoo.File = SC.Record.extend(
/** @scope Fotofoo.File.prototype */ {

  guid: SC.Record.attr(String, { isRequired: YES }),
  type: SC.Record.attr(String, { defaultValue: 'File', isRequired: YES }),
  url: SC.Record.attr(String, { isRequired: YES }),
  name: SC.Record.attr(String, { defaultValue: 'untitled file', isRequired: YES }),
  width: SC.Record.attr(Number, { isRequired: YES }),
  height: SC.Record.attr(Number, { isRequired: YES }),
  folder: SC.Record.toOne('Fotofoo.Folder', { inverse: 'files' }),

  _FILENAME_WITHOUT_EXT_RE: /^(.*)\..*$/,

  description: function() {
    var name = this.get('name'),
        width = this.get('width') || '??',
        height = this.get('height') || '??';

    name = name ? name.replace(this._FILENAME_WITHOUT_EXT_RE, '$1') : 'Loading...';

    return "%@ (%@x%@)".fmt(name, width, height);
  }.property('name', 'width', 'height').cacheable()

}) ;
