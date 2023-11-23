import pool from "../db.js";
import bcrypt from "bcrypt";
import { jwtTokens } from "../utils/jwt.helpers.js";

class Controller {
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const users = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (users.rows.length === 0)
        return res.status(404).json({ error: "Данный пользователь не найден" });

      const validPassword = await bcrypt.compare(
        password,
        users.rows[0].password_hash
      );
      if (!validPassword)
        return res.status(401).json({ error: "Неверный пароль" });

      const token = jwtTokens(users.rows[0]);

      console.log(token);
      return res.json({ token: `Bearer ${token}` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async registerPatient(req, res) {
    try {
      const {
        firstName,
        lastName,
        middleName,
        birthday,
        phone,
        address,
        snils,
        email,
        password,
      } = req.body;

      const fullName = `${firstName} ${lastName} ${middleName}`;

      const userAlreadExists = await pool.query(
        "SELECT * FROM users WHERE email= $1",
        [email]
      );

      if (userAlreadExists.rows.length > 0) {
        return res
          .status(409)
          .json({ error: "Такой email уже зарегистрирован" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        "INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, 1]
      );

      const newUserId = newUser.rows[0].user_id;

      const newPatient = await pool.query(
        "INSERT INTO Patients (user_id, name, birthday, phone, address,snils) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [newUserId, fullName, birthday, phone, address, snils]
      );

      return res.json({ users: newUser.rows[0], patient: newPatient.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new Controller();

// async registerPatient(req, res) {
//   try {
//     const {
//       firstName,
//       lastName,
//       middleName,
//       email,
//       password,
//     } = req.body;

//     const fullName = `${firstName} ${lastName} ${middleName}`;

//     const userAlreadExists = await pool.query(
//       "SELECT * FROM users WHERE email= $1",
//       [email]
//     );

//     if (userAlreadExists.rows.length > 0) {
//       return res
//         .status(409)
//         .json({ error: "Такой email уже зарегистрирован" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await pool.query(
//       "INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *",
//       [email, hashedPassword, 3]
//     );

//     const newUserId = newUser.rows[0].user_id;

//     const newPatient = await pool.query(
//       "INSERT INTO admins (user_id, name) VALUES ($1, $2) RETURNING *",
//       [newUserId, fullName]
//     );

//     return res.json({ users: newUser.rows[0], patient: newPatient.rows[0] });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
