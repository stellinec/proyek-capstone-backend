const { nanoid } = require("nanoid");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db, storeDataUser, storeRequest, storeArtikel } = require('../services/storeData');

// Secret key for JWT
const JWT_SECRET = "capstone"; // Replace with a strong secret key

const registerHandler = async (request, h) => {
  const { username, password, email, nomorTelepon, type } = request.payload;
  const id = nanoid(16);

  const userRef = db.collection('user').doc(id);

  // Check if the email already exists
  const querySnapshot = await db.collection('user').where('email', '==', email).get();
  if (!querySnapshot.empty) {
    const response = h.response({
      status: "fail",
      message: "Email sudah digunakan",
    });
    response.code(400);
    return response;
  }

  // Check if the username already exists
  const usernameSnapshot = await db.collection('user').where('username', '==', username).get();
  if (!usernameSnapshot.empty) {
    const response = h.response({
      status: "fail",
      message: "Username sudah digunakan",
    });
    response.code(400);
    return response;
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    username,
    password: hashedPassword,
    email,
    nomorTelepon,
    id,
    type,
  };

  // Create the user document
  await storeDataUser(id, newUser);

  // Create a pesanan subcollection for the user
  const pesananRef = userRef.collection('pesanan');

  // Respond with success
  const response = h.response({
    status: "success",
    message: "User berhasil ditambahkan",
    data: {
      userId: id,
    },
  });
  response.code(201);
  return response;
};



const getUserByIdHandler = async (request, h) => {
  const { userId } = request.params;

  try {
    const userRef = db.collection('user').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const response = h.response({
        status: "fail",
        message: "User tidak ditemukan",
      });
      response.code(404);
      return response;
    }

    const user = userDoc.data();

    return {
      status: "success",
      data: {
        user,
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam mengambil data pengguna",
    });
    response.code(500);
    return response;
  }
};

const updateAccountHandler = async (request, h) => {
  const { userId } = request.params;
  const { username, password, email, nomorTelepon } = request.payload;

  try {
    const userRef = db.collection('user').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const response = h.response({
        status: "fail",
        message: "Gagal memperbarui akun. Id tidak ditemukan",
      });
      response.code(404);
      return response;
    }

    // Construct update object with only provided fields
    const updateData = {};

    if (username !== undefined) {
      updateData.username = username;
    }

    if (password !== undefined) {
      updateData.password = password;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (nomorTelepon !== undefined) {
      updateData.nomorTelepon = nomorTelepon;
    }

    await userRef.update(updateData);

    const response = h.response({
      status: "success",
      message: "Akun berhasil diperbarui",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("Error updating account:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam memperbarui akun",
    });
    response.code(500);
    return response;
  }
};


const deleteAccountHandler = async (request, h) => {
  const { userId } = request.params;

  try {
    const userRef = db.collection('user').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const response = h.response({
        status: "fail",
        message: "Gagal menghapus akun. Id tidak ditemukan",
      });
      response.code(404);
      return response;
    }

    // Delete all requests associated with the user
    const requestsRef = userRef.collection('request');
    const requestsSnapshot = await requestsRef.get();
    const deleteRequestsPromises = requestsSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deleteRequestsPromises);

    // Delete the user account
    await userRef.delete();

    const response = h.response({
      status: "success",
      message: "Akun berhasil dihapus bersama dengan semua pesanannya",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("Error deleting account:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam menghapus akun",
    });
    response.code(500);
    return response;
  }
};


const loginHandler = async (request, h) => {
  const { username, password } = request.payload;

  try {
    const userQuerySnapshot = await db.collection('user').where('username', '==', username).limit(1).get();

    if (userQuerySnapshot.empty) {
      const response = h.response({
        status: "fail",
        message: "Username atau password salah",
      });
      response.code(401);
      return response;
    }

    const userData = userQuerySnapshot.docs[0].data();
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      const response = h.response({
        status: "fail",
        message: "Username atau password salah",
      });
      response.code(401);
      return response;
    }

    const token = jwt.sign(
      { userId: userData.id, username: userData.username, type: userData.type },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      status: "success",
      message: "Login berhasil",
      data: {
        token,
      },
    };
  } catch (error) {
    console.error("Error logging in:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam proses login",
    });
    response.code(500);
    return response;
  }
};

const logoutHandler = async (request, h) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    const response = h.response({
      status: "fail",
      message: "Authorization header tidak ada",
    });
    response.code(401);
    return response;
  }

  const token = authHeader.split(" ")[1];
  try {
    // Add the token to the blacklist
    await db.collection('blacklistedTokens').doc(token).set({ invalidatedAt: new Date().toISOString() });

    const response = h.response({
      status: "success",
      message: "Logout berhasil",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("Error blacklisting token:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan saat logout",
    });
    response.code(500);
    return response;
  }
};



const verifyToken = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    const response = h.response({
      status: "fail",
      message: "Authorization header tidak ada",
    });
    response.code(401);
    throw response;
  }

  const token = authHeader.split(" ")[1];
  try {
    // Check if the token is blacklisted
    const blacklistedRef = db.collection('blacklistedTokens').doc(token);
    const blacklistedDoc = await blacklistedRef.get();
    if (blacklistedDoc.exists) {
      const response = h.response({
        status: "fail",
        message: "Token tidak valid",
      });
      response.code(401);
      throw response;
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // You may want to verify the token against the user's data in Firestore here

    request.user = decoded;
    return h.continue;
  } catch (err) {
    const response = h.response({
      status: "fail",
      message: "Token tidak valid",
    });
    response.code(401);
    throw response;
  }
};




const tambahPesananHandler = async (request, h) => {
  const { alamat } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const newPesanan = { userId: request.user.userId, alamat, id, createdAt };

  try {
    console.log("User ID:", request.user.userId);
    // Check if the user account exists
    const userRef = db.collection('user').doc(request.user.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      console.log("User document not found.");
      const response = h.response({
        status: "fail",
        message: "User tidak ditemukan",
      });
      response.code(404);
      return response;
    }

    const isClient = userDoc.data().type === 'client';

    if (!isClient) {
      const response = h.response({
        status: "fail",
        message: "Hanya client yang dapat membuat pesanan",
      });
      response.code(403);
      return response;
    }

    // Add the new order to Firestore
    await storeRequest(id, newPesanan);

    const response = h.response({
      status: "success",
      message: "Pesanan berhasil ditambahkan",
      data: {
        pesananId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error("Error adding new order:", error);
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan pesanan",
    });
    response.code(500);
    return response;
  }
};


const getPesananByIdHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const pesananRef = db.collection('request').doc(id);
    const pesananDoc = await pesananRef.get();

    if (!pesananDoc.exists) {
      const response = h.response({
        status: "fail",
        message: "Pesanan tidak ditemukan",
      });
      response.code(404);
      return response;
    }

    const pesananData = pesananDoc.data();

    const response = h.response({
      status: "success",
      data: {
        pesanan: pesananData,
      },
    });
    return response;
  } catch (error) {
    console.error("Error retrieving pesanan:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam mengambil pesanan",
    });
    response.code(500);
    return response;
  }
};


const editPesananByIdHandler = async (request, h) => {
  const { id } = request.params;
  const { berat, harga, alamat } = request.payload;
  const updatedAt = new Date().toISOString();
  const userRole = request.user.type; // Get the user's role

  try {
    // Check if the user is a client
    if (userRole === 'client') {
      const requestRef = db.collection('request').where('userId', '==', request.user.userId).where('id', '==', id);
      const requestDoc = await requestRef.get();

      // Check if the request exists
      if (requestDoc.empty) {
        const response = h.response({
          status: "fail",
          message: "Pesanan tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya",
        });
        response.code(404);
        return response;
      }

      // Update the alamat field of the request document
      requestDoc.forEach(async (doc) => {
        await doc.ref.update({ alamat, updatedAt });
      });
  
      const response = h.response({
        status: "success",
        message: "Alamat pesanan berhasil diupdate",
      });
      response.code(200);
      return response;
    } 
    // Check if the user is a mitra
    else if (userRole === 'mitra') {
      const requestRef = db.collection('request').where('id', '==', id);
      const requestQuerySnapshot = await requestRef.get();

        if (!requestQuerySnapshot.empty) {
          // There should be only one request document associated with the user
          const requestDoc = requestQuerySnapshot.docs[0];
          
          // Update the fields of the request document
          const updateData = {
            updatedAt,
            idMitra: request.user.userId // Associate the request with the mitra
          };
          if (berat !== undefined) {
            updateData.berat = berat;
          }
          if (harga !== undefined) {
            updateData.harga = harga;
          }
          await requestDoc.ref.update(updateData);

          const response = h.response({
            status: "success",
            message: "Berat dan harga pesanan berhasil diupdate",
          });
          response.code(200);
          return response;
        }

      // If no request is found
      const response = h.response({
        status: "fail",
        message: "Pesanan tidak ditemukan atau Anda tidak memiliki izin untuk mengeditnya",
      });
      response.code(404);
      return response;
    } else {
      // If user's role is neither client nor mitra
      const response = h.response({
        status: "fail",
        message: "User tidak diizinkan untuk melakukan aksi ini",
      });
      response.code(403);
      return response;
    }
  } catch (error) {
    console.error("Error editing pesanan:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam mengedit pesanan",
    });
    response.code(500);
    return response;
  }
};

const deletePesananByIdHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const requestRef = db.collection('request').where('userId', '==', request.user.userId).where('id', '==', id);
    const requestDoc = await requestRef.get();

    if (requestDoc.empty) {
      const response = h.response({
        status: "fail",
        message: "Pesanan tidak ditemukan",
      });
      response.code(404);
      return response;
    }

    // Delete the pesanan
    requestDoc.forEach(async (doc) => {
      await doc.ref.delete();
    });

    const response = h.response({
      status: "success",
      message: "Pesanan berhasil dibatalkan",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("Error deleting pesanan:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam membatalkan pesanan",
    });
    response.code(500);
    return response;
  }
};



const tambahArtikelHandler = async (request, h) => {
  const { judul, isi, penulis } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  try {
    // Check if the user is an admin
    const isAdmin = request.user.type === 'admin';

    if (!isAdmin) {
      const response = h.response({
        status: "fail",
        message: "Hanya Admin yang dapat membuat artikel",
      });
      response.code(403);
      return response;
    }

    // Create a new artikel document in Firestore
    const artikelRef = db.collection('artikel').doc(id);
    await artikelRef.set({ judul, isi, penulis, id, createdAt, updatedAt });

    const response = h.response({
      status: "success",
      message: "Artikel berhasil ditambahkan",
      data: {
        artikelId: id,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error("Error adding artikel:", error);
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan artikel",
    });
    response.code(500);
    return response;
  }
};


const getArtikelByIdHandler = async (request, h) => {
  const { artikelId } = request.params;

  try {
    // Get the artikel document from Firestore
    const artikelDoc = await db.collection('artikel').doc(artikelId).get();

    if (artikelDoc.exists) {
      const artikel = artikelDoc.data();
      return {
        status: "success",
        data: {
          artikel,
        },
      };
    } else {
      const response = h.response({
        status: "fail",
        message: "Artikel tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  } catch (error) {
    console.error("Error fetching artikel:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam mengambil artikel",
    });
    response.code(500);
    return response;
  }
};

const editArtikelByIdHandler = async (request, h) => {
  const { artikelId } = request.params;
  const { judul, isi, penulis } = request.payload;
  const updatedAt = new Date().toISOString();
  const isAdmin = request.user.type === 'admin'; // Check if user is admin

  if (!isAdmin) {
    const response = h.response({
      status: "fail",
      message: "Hanya Admin yang dapat memperbarui artikel",
    });
    response.code(403);
    return response;
  }

  try {
    // Update the artikel document in Firestore
    const artikelRef = db.collection('artikel').doc(artikelId);

    // Construct the update object based on the provided fields
    const updateData = {};
    if (judul !== undefined) {
      updateData.judul = judul;
    }
    if (isi !== undefined) {
      updateData.isi = isi;
    }
    if (penulis !== undefined) {
      updateData.penulis = penulis;
    }
    updateData.updatedAt = updatedAt;

    await artikelRef.update(updateData);

    const response = h.response({
      status: "success",
      message: "Artikel berhasil diperbarui",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("Error updating artikel:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam memperbarui artikel",
    });
    response.code(500);
    return response;
  }
};


const deleteArtikelByIdHandler = async (request, h) => {
  const { artikelId } = request.params;
  const isAdmin = request.user.type === 'admin'; // Check if user is admin

  if (!isAdmin) {
    const response = h.response({
      status: "fail",
      message: "Hanya Admin yang dapat menghapus artikel",
    });
    response.code(403);
    return response;
  }

  try {
    // Delete the artikel document from Firestore
    const artikelRef = db.collection('artikel').doc(artikelId);
    await artikelRef.delete();

    const response = h.response({
      status: "success",
      message: "Artikel berhasil dihapus",
    });
    response.code(200);
    return response;
  } catch (error) {
    console.error("Error deleting artikel:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam menghapus artikel",
    });
    response.code(500);
    return response;
  }
};


const getSemuaPesananByUserHandler = async (request, h) => {

  try {
    console.log("User ID:", request.user.userId);
    // Query Firestore to get all pesanan associated with the user
    const pesananQuerySnapshot = await db.collection('user').doc(request.user.userId).collection('request').get();
    const userPesanan = pesananQuerySnapshot.docs.map(doc => doc.data());

    if (userPesanan.length > 0) {
      return {
        status: "success",
        data: {
          pesanan: userPesanan,
        },
      };
    } else {
      const response = h.response({
        status: "fail",
        message: "User tidak memiliki pesanan",
      });
      response.code(404);
      return response;
    }
  } catch (error) {
    console.error("Error fetching pesanan:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam mengambil pesanan",
    });
    response.code(500);
    return response;
  }
};

const getSemuaUserHandler = async () => {
  try {
    // Query Firestore to get all users
    const userQuerySnapshot = await db.collection('user').get();
    const listUser = userQuerySnapshot.docs.map(doc => doc.data());

    return {
      status: "success",
      data: {
        listUser,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      status: "error",
      message: "Terjadi kesalahan dalam mengambil daftar pengguna",
    };
  }
};

const getSemuaArtikelHandler = async () => {
  try {
    // Query Firestore to get all articles
    const artikelQuerySnapshot = await db.collection('artikel').get();
    const listArtikel = artikelQuerySnapshot.docs.map(doc => doc.data());

    return {
      status: "success",
      data: {
        listArtikel,
      },
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      status: "error",
      message: "Terjadi kesalahan dalam mengambil daftar artikel",
    };
  }
};

const getSemuaPesananHandler = async () => {
  try {
    // Query Firestore to get all users
    const requestQuerySnapshot = await db.collection('request').get();
    const listRequest = requestQuerySnapshot.docs
        .map(doc => doc.data())
        .filter(request => !request.hasOwnProperty('idMitra'));

    return {
      status: "success",
      data: {
        listRequest,
      },
    };
  } catch (error) {
    console.error("Error fetching request:", error);
    return {
      status: "error",
      message: "Terjadi kesalahan dalam mengambil daftar pesanan",
    };
  }
};

const getUserInfoHandler = async (request, h) => {

  try {
    // Query Firestore to get user information
    
    const userDoc = await db.collection('user').doc(request.user.userId).get();
    const userInfo = userDoc.data();

    if (userInfo) {
      return {
        status: "success",
        data: {
          userId: request.user.userId,
          userInfo,
        },
      };
    } else {
      const response = h.response({
        status: "fail",
        message: "User information not found",
      });
      response.code(404);
      return response;
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    const response = h.response({
      status: "error",
      message: "Terjadi kesalahan dalam mengambil informasi pengguna",
    });
    response.code(500);
    return response;
  }
};


module.exports = {
  getSemuaUserHandler,
  getUserByIdHandler,
  registerHandler,
  loginHandler,
  logoutHandler,
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
  verifyToken,getUserInfoHandler
};