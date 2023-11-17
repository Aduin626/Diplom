function checkPatientRole(req, res, next) {
    const roleId = req.user.role_id;
    if (roleId !== 1) {
      return res.status(403).json({ error: "Вы не пациент!" });
    }
    next(); // Пользователь является администратором, продолжаем выполнение
  }

  export { checkPatientRole };