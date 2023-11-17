function checkAdminRole(req, res, next) {
    const roleId = req.user.role_id;
    if (roleId !== 3) {
      return res.status(403).json({ error: "Вы не администратор!" });
    }
    next(); // Пользователь является администратором, продолжаем выполнение
  }

  export { checkAdminRole };