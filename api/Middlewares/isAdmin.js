import jwt  from "jsonwebtoken";

export const isAdmin = (req, res, next) => {
  try {
    const { id, role } = jwt.verify(
      req.headers?.authorization.split(" ")[1],
      process.env.SECRET_JWT
    );
    req.userId = id;
    req.role = role;
    if (role != "admin") {
      return res.status(401).json({
        message: "you don't have a permission",
        success: false,
      });
    }
    return next();
  } catch (error) {
    console.log(error)

    return res.status(401).json({
      message: "you don't have a permission",
      success: false,
    });
  }
};
