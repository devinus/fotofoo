// ==========================================================================
// Project:   Fotofoo.Folder Fixtures
// Copyright: ©2010 Devin Torres
// ==========================================================================
/*globals Fotofoo */

sc_require('models/Folder');

Fotofoo.Folder.FIXTURES = [{
    guid: '/',
    name: '/',
    parentFolder: null,
    childFolders: ['/Folder1', '/Folder2', '/Folder3', '/Trash'],
    files: []
  }, {  
    guid: '/Folder1',
    name: 'Folder1',
    parentFolder: '/',
    childFolders: [],
    files: [
      '/Folder1/4397242135_9b68c918b2_m.jpg',
      '/Folder1/4394663666_06cae74ccf_m.jpg',
      '/Folder1/4389591430_fbbe67f9a0_m.jpg',
      '/Folder1/4405454460_e6b1d82012_m.jpg',
      '/Folder1/4392708003_637024bcbe_m.jpg',
      '/Folder1/4405381323_4f9af9e954_m.jpg',
      '/Folder1/4390169277_ab32b8cb3f_m.jpg',
      '/Folder1/4393763509_a7a254d7c3_m.jpg',
      '/Folder1/4406482566_b895d042ef_m.jpg'
    ]
  }, {
    guid: '/Folder2',
    name: 'Folder2',
    parentFolder: '/',
    childFolders: [],
    files: []
  }, {
    guid: '/Folder3',
    name: 'Folder3',
    parentFolder: '/',
    childFolders: [
      '/Folder3/SubFolder1',
      '/Folder3/SubFolder2',
      '/Folder3/SubFolder3'
    ],
    files: []
  }, {
    guid: '/Folder3/SubFolder1',
    name: 'SubFolder1',
    parentFolder: '/Folder3',
    childFolders: [],
    files: []
  }, {
    guid: '/Folder3/SubFolder2',
    name: 'SubFolder2',
    parentFolder: '/Folder3',
    childFolders: [],
    files: []
  }, {
    guid: '/Folder3/SubFolder3',
    name: 'SubFolder3',
    parentFolder: '/Folder3',
    childFolders: [],
    files: []
  },
  { guid: '/Trash', name: 'Trash' }
];
