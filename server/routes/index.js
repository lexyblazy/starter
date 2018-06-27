const router = require("express").Router();
const {
  signup,
  isLoggedIn,
  signInWithEmailAndPassword,
  receiveToken
} = require("../controllers/authControllers");
require("../services/passport");

router.get("/", isLoggedIn, (req, res) => {
  res.send(["some data here"]);
});

router.post("/signup", signup);
router.post("/signin", signInWithEmailAndPassword, receiveToken);

module.exports = router;
