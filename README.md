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

# Penjemputan  (client -> CRUD, mitra -> U)
## CREATE 
method: 'POST',
path: '/pesanan',
body to test in postman : 
```
{
    "alamat" : "jln HALO", 
}
```
     
## READ
method: 'GET',
path: '/pesanan/{id}',

## UPDATE (client)
method: 'PUT'
path: '/pesanan/{id}',
body to test in postman : 
```
{
    "alamat" : "jln HALO", 
}
```

## UPDATE (mitra)
method: 'PUT'
path: '/pesanan/{id}',
body to test in postman : 
```
{
    "berat" : 20, 
    "harga" : 2000
}
```

## DELETE
method: 'DELETE',
path: '/pesanan/{id}',

# Artikel (admin -> CRUD, client -> R)
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
path: '/pesanan/history',
    
## Retrieve userId, user info that currently login
method: 'GET',
path: '/user',

## Retrieve all artikel
method: 'GET',
path: '/artikels',
   

