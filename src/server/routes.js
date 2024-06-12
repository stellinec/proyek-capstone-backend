const {
  getSemuaUserHandler,
  getUserByIdHandler,
  registerHandler,
  loginHandler,
  deleteAccountHandler,
  updateAccountHandler,
  tambahPesananHandler,
  editPesananByIdHandler,
  deletePesananByIdHandler,
  tambahArtikelHandler,
  getArtikelByIdHandler,
  editArtikelByIdHandler,
  deleteArtikelByIdHandler,
  getSemuaPesananByUserHandler,
  getSemuaArtikelHandler,
  getPesananByIdHandler,
  verifyToken, getUserInfoHandler
  
  } = require('./handler');
  const routes = [
    {
      method: 'POST',
      path: '/register',
      handler: registerHandler,
    },
    {
      method: 'GET',
      path: '/user/{userId}',
      handler: getUserByIdHandler,
    },
    {
      method: 'PUT',
      path: '/user/{userId}',
      handler: updateAccountHandler,
      options: {
        pre: [verifyToken],
      },
    },
    {
      method: 'DELETE',
      path: '/user/{userId}',
      handler: deleteAccountHandler,
      options: {
        pre: [verifyToken],
      },
   },
    {
      method: 'POST',
      path: '/login',
      handler: loginHandler,
    },
    {
      method: 'POST',
      path: '/pesanan',
      handler: tambahPesananHandler,
      options: {
        pre: [verifyToken],
      },
    },
    {
      method: 'GET',
      path: '/pesanan/{id}',
      handler: getPesananByIdHandler,

    },
    {
      method: 'PUT',
      path: '/pesanan/{id}',
      handler: editPesananByIdHandler,
      options: {
        pre: [verifyToken],
      },
    },
    {
      method: 'DELETE',
      path: '/pesanan/{id}',
      handler: deletePesananByIdHandler,
      options: {
        pre: [verifyToken],
      },
   },
   {
    method: 'POST',
    path: '/artikel',
    handler: tambahArtikelHandler,
    options: {
      pre: [verifyToken],
    },
  },
  {
    method: 'GET',
    path: '/artikel/{artikelId}',
    handler: getArtikelByIdHandler,
  },
  {
    method: 'PUT',
    path: '/artikel/{artikelId}',
    handler: editArtikelByIdHandler,
    options: {
      pre: [verifyToken],
    },
  },
  {
    method: 'DELETE',
    path: '/artikel/{artikelId}',
    handler: deleteArtikelByIdHandler,
    options: {
      pre: [verifyToken],
    },
 },
    
  
    {
      method: 'GET',
      path: '/users',
      handler: getSemuaUserHandler,
    
    },
    {
      method: 'GET',
      path: '/artikels',
      handler: getSemuaArtikelHandler,
      
    },
    {
      method: 'GET',
      path: '/pesanan/history',
      handler: getSemuaPesananByUserHandler,
      options: {
        pre: [verifyToken],
      },
    },
    {
      method: 'GET',
      path: '/user',
      handler: getUserInfoHandler,
      options: {
        pre: [verifyToken],
      },
    },
    
  ];
  
   
  module.exports = routes;