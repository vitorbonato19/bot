const users = new Map();

function setUser(userId, user, username) {
  users.set(userId, user, username);
}

function getUser(userId) {
  return users.get(userId) || null;
}

module.exports = { setUser, getUser };
