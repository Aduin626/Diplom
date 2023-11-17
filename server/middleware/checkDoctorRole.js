function checkDoctorRole(req, res, next) {
    const roleId = req.user.role_id;
    if (roleId !== 2) {
      return res.status(403).json({ error: "Вы не доктор!" });
    }
    next();
  }

  export { checkDoctorRole };