const {
  getSemuaUserHandler,
  getUserByIdHandler,
  registerHandler,
  loginHandler,
  deleteAccountHandler,
  updateAccountHandler,
  tambahPesananHandler,
  deletePesananByIdHandler,
  tambahArtikelHandler,
  getArtikelByIdHandler,
  editArtikelByIdHandler,
  deleteArtikelByIdHandler,
  getSemuaPesananByUserHandler,
  getPesananByIdHandler,
  verifyToken, 
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
      options: {
        pre: [verifyToken],
      },
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
    options: {
      pre: [verifyToken],
    },
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
      options: {
        pre: [verifyToken],
      },
    },
    {
      method: 'GET',
      path: '/{userId}/pesanan/history',
      handler: getSemuaPesananByUserHandler,
      options: {
        pre: [verifyToken],
      },
    },
  ];
  
   
  module.exports = routes;