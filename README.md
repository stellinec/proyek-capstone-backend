# Register (CRUD)
## CREATE 
method: 'POST',
path: '/register',
body to test in postman : 
```
{
"username" : "Budi", 
"password" : "password",
"email" : "budi@gmail.com",
"nomorTelepon": "0811672899",
"type" : "client" or "admin" or "mitra"
}
```
## READ
method: 'GET',
path: '/user/{userId}',

## UPDATE
method: 'PUT',
path: '/user/{userId}',
body to test in postman : 
```
{
"username" : "Budi", 
"password" : "password",
"email" : "budi@gmail.com",
"nomorTelepon": "0811672899",
}
```

## DELETE
method: 'DELETE',
path: '/user/{userId}',

# Login
method: 'POST',
path: '/login',

# Penjemputan (CRD)
## CREATE 
method: 'POST',
path: '/pesanan',
body to test in postman : 
```
{
    "alamat" : "jln HALO", 
   "berat": 50.1,
   "harga": 700000,
   "userId" : "iFh6h_rOGI5HlHRs"
}
```
     
## READ
method: 'GET',
path: '/pesanan/{id}',

## DELETE
method: 'DELETE',
path: '/pesanan/{id}',

# Artikel (admin -> CRUD, user -> R)
## CREATE
method: 'POST',
path: '/artikel',
body to test in postman : 
```
{
"judul" : "Cara mengolah sampah", 
"isi" : "lorem",
"penulis" : "Adam"
}
```

## READ
method: 'GET',
path: '/artikel/{artikelId}',
   
## UPDATE
method: 'PUT',
path: '/artikel/{artikelId}',
body to test in postman : 
```
{
"judul" : "Cara mengolah sampah", 
"isi" : "lorem",
"penulis" : "Adam"
}
```
   
## DELETE
method: 'DELETE',
path: '/artikel/{artikelId}',

    
# Tambahan
## Retrieve all user
method: 'GET',
path: '/users',

## Retrieve user pesanan histories
method: 'GET',
path: '/{userId}/pesanan/history',
    
   

