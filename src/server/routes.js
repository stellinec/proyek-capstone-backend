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
  getSemuaPesananHandler,
  getPesananByIdHandler,
  verifyToken, getUserInfoHandler,
  // postPredictHandler,
  logoutHandler
  
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
    path: '/article',
    handler: tambahArtikelHandler,
    options: {
      pre: [verifyToken],
    },
  },
  {
    method: 'GET',
    path: '/article/{artikelId}',
    handler: getArtikelByIdHandler,
  },
  {
    method: 'PUT',
    path: '/article/{artikelId}',
    handler: editArtikelByIdHandler,
    options: {
      pre: [verifyToken],
    },
  },
  {
    method: 'DELETE',
    path: '/article/{artikelId}',
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
      path: '/articles',
      handler: getSemuaArtikelHandler,
      
    },
    {
      method: 'GET',
      path: '/daftar/pesanan',
      handler: getSemuaPesananHandler,
      
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
    {
      method: 'GET',
      path: '/logout',
      handler: logoutHandler,
      options: {
        pre: [verifyToken],
      },
    },
    // {
    //   path: '/predict',
    //   method: 'POST',
    //   handler: postPredictHandler,
    //   options: {
    //     payload: {
    //       maxBytes: 1000000, 
    //       multipart: true, 
    //       allow: 'multipart/form-data',
    //     },
    //   },
    // },
    
  ];
  
   
  module.exports = routes;