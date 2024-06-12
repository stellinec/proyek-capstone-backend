const { nanoid } = require("nanoid");
const listPesanan = require("../services/listPesanan");
const listUser = require("../services/listUser");
const listArtikel = require("../services/listArtikel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { storeDataUser, storeRequest } = require('../services/storeData');

// Secret key for JWT
const JWT_SECRET = "capstone"; // Replace with a strong secret key

const registerHandler = async (request, h) => {
  const { username, password, email, nomorTelepon, type } = request.payload;
  const id = nanoid(16);

  // Check if the email already exists
  const isEmailExist = listUser.some((user) => user.email === email);
  if (isEmailExist) {
    const response = h.response({
      status: "fail",
      message: "Email sudah digunakan",
    });
    response.code(400);
    return response;
  }

  // Check if the username already exists
  const isUsernameExist = listUser.some((user) => user.username === username);
  if (isUsernameExist) {
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
  if (type === "client") {
    newUser.pesanan = [];
  }

  listUser.push(newUser);
  await storeDataUser(id, newUser);
  const isSuccess = listUser.filter((user) => user.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "User berhasil ditambahkan",
      data: {
        userId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "User gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getUserByIdHandler = (request, h) => {
  const { userId } = request.params;

  const user = listUser.find((user) => user.id === id);
  if (user !== undefined) {
    return {
      status: "success",
      data: {
        user,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "User tidak ditemukan",
  });
  response.code(404);
  return response;
};

const updateAccountHandler = (request, h) => {
  const { userId } = request.params;

  const { username, password, email, nomorTelepon } = request.payload;

  const index = listUser.findIndex((i) => i.id === userId);

  if (index !== -1) {
    listUser[index] = {
      ...listUser[index],
      username,
      password,
      email,
      nomorTelepon,
    };

    const response = h.response({
      status: "success",
      message: "Akun berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui akun. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteAccountHandler = (request, h) => {
  const { userId } = request.params;

  const index = listUser.findIndex((i) => i.id === userId);

  if (index !== -1) {
    listUser.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Akun berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Akun gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const loginHandler = async (request, h) => {
  const { username, password } = request.payload;
  const user = listUser.find((user) => user.username === username);
  if (!user) {
    const response = h.response({
      status: "fail",
      message: "Username atau password salah",
    });
    response.code(401);
    return response;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    const response = h.response({
      status: "fail",
      message: "Username atau password salah",
    });
    response.code(401);
    return response;
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, type: user.type },
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
};

const verifyToken = (request, h) => {
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
    const decoded = jwt.verify(token, JWT_SECRET);
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

  const isClient = request.user.type === 'client'; // Check if user is admin

  if (!isClient) {
    const response = h.response({
      status: "fail",
      message: "Hanya client yang dapat membuat pesanan ",
    });
    response.code(403);
    return response;
  }
  const user = listUser.find(user => user.id === request.user.userId);
  listPesanan.push(newPesanan);
  user.pesanan.push(newPesanan);
  await storeRequest(id, newPesanan);

  const isSuccess =
    listPesanan.filter((pesanan) => pesanan.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Pesanan berhasil ditambahkan",
      data: {
        pesananId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Pesanan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getPesananByIdHandler = (request, h) => {
  const { id } = request.params;

  const pesanan = listPesanan.find((pesanan) => pesanan.id === id);
  if (pesanan !== undefined) {
    return {
      status: "success",
      data: {
        pesanan,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Pesanan tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editPesananByIdHandler = (request, h) => {
  const { id } = request.params;
  const { berat, harga, alamat } = request.payload;
  const updatedAt = new Date().toISOString();
  const userRole = request.user.type; // Get the user's role

  if (userRole === 'client') {
    // If the user is a client, they can only update alamat
    if (alamat !== undefined) {
      const index = listPesanan.findIndex((i) => i.id === id);
      if (index !== -1) {
        listPesanan[index] = {
          ...listPesanan[index],
          alamat,
          updatedAt,
        };
        const response = h.response({
          status: "success",
          message: "Alamat pesanan berhasil diperbarui",
        });
        response.code(200);
        return response;
      }
    } else {
      // If client tries to update berat or harga
      const response = h.response({
        status: "fail",
        message: "Hanya mitra yang dapat menginputkan berat dan harga",
      });
      response.code(403);
      return response;
    }
  } else if (userRole === 'mitra') {
    // If the user is a mitra, they can only update berat and harga
    if (berat !== undefined || harga !== undefined) {
      const index = listPesanan.findIndex((i) => i.id === id);
      if (index !== -1) {
        listPesanan[index] = {
          ...listPesanan[index],
          berat,
          harga,
          updatedAt,
        };
        const response = h.response({
          status: "success",
          message: "Berat dan harga berhasil ditambahkan",
        });
        response.code(200);
        return response;
      }
    } else {
      // If mitra tries to update alamat
      const response = h.response({
        status: "fail",
        message: "Hanya client yang dapat memperbarui alamat",
      });
      response.code(403);
      return response;
    }
  } else {
    // If user's role is neither client nor mitra
    const response = h.response({
      status: "fail",
      message: "User tidak diizinkan untuk melakukan aksi ini",
    });
    response.code(403);
    return response;
  }
};



const deletePesananByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = listPesanan.findIndex((i) => i.id === id);

  if (index !== -1) {
    const [deletedPesanan] = listPesanan.splice(index, 1);

    const userIndex = listUser.findIndex(
      (user) => user.id === deletedPesanan.userId
    );
    if (userIndex !== -1) {
      const userPesananIndex = listUser[userIndex].pesanan.findIndex(
        (pesanan) => pesanan.id === id
      );
      if (userPesananIndex !== -1) {
        listUser[userIndex].pesanan.splice(userPesananIndex, 1);
      }
    }

    const response = h.response({
      status: "success",
      message: "Pesanan berhasil dibatalkan",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Pesanan gagal dibatalkan. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};


const tambahArtikelHandler = (request, h) => {
  const { judul, isi, penulis } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;
  console.log('User type:', request.user);
  const isAdmin = request.user.type === 'admin'; // Check if user is admin

  if (!isAdmin) {
    const response = h.response({
      status: "fail",
      message: "Hanya Admin yang dapat membuat artikel",
    });
    response.code(403);
    return response;
  }
  const newArtikel = { judul, isi, penulis, id, createdAt, updatedAt };
  listArtikel.push(newArtikel);
  const isSuccess = listArtikel.filter((i) => i.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Artikel berhasil ditambahkan",
      data: {
        artikelId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Artikel gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getArtikelByIdHandler = (request, h) => {
  const { artikelId } = request.params;

  const artikel = listArtikel.find((i) => i.id === artikelId);
  if (artikel !== undefined) {
    return {
      status: "success",
      data: {
        artikel,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Artikel tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editArtikelByIdHandler = (request, h) => {
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
  const index = listArtikel.findIndex((i) => i.id === artikelId);

  if (index !== -1) {
    listArtikel[index] = {
      ...listArtikel[index],
      judul,
      isi,
      penulis,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Artikel berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui artikel. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteArtikelByIdHandler = (request, h) => {
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
  const index = listArtikel.findIndex((i) => i.id === artikelId);

  if (index !== -1) {
    listArtikel.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Artikel berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Artikel gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const getSemuaPesananByUserHandler = (request, h) => {
  const { userId } = request.user;

  const userPesanan = listPesanan.filter(
    (pesanan) => pesanan.userId === userId
  );

  if (userPesanan.length > 0) {
    return {
      status: "success",
      data: {
        pesanan: userPesanan,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "User tidak memiliki pesanan",
  });
  response.code(404);
  return response;
};

const getSemuaUserHandler = () => ({
  status: "success",
  data: {
    listUser,
  },
});
const getSemuaArtikelHandler = () => ({
  status: "success",
  data: {
    listArtikel,
  },
});
const getUserInfoHandler = (request, h) => {
  const { userId } = request.user;
  const userInfo = listUser.find((user) => user.id === userId);
  if (userInfo) {
    return {
      status: "success",
      data: {
        userId,
        userInfo,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "User information not found",
  });
  response.code(404);
  return response;
};




module.exports = {
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
  verifyToken,getUserInfoHandler
};