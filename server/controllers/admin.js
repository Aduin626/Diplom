import pool from "../db.js";
import bcrypt from "bcrypt";

class Controller {
  //Врачи

  //добавление врачей
  async addDoctor(req, res) {
    try {
      const { firstName, lastName, middleName, specialty, email, password } =
        req.body;

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

      console.log(req.user.user_id);
      const newUser = await pool.query(
        "INSERT INTO users (email, password_hash, role_id) VALUES ($1, $2, $3) RETURNING *",
        [email, hashedPassword, 2]
      );

      const newUserId = newUser.rows[0].user_id;

      const doctorAdd = await pool.query(
        "INSERT INTO doctors (user_id, name,  specialty) VALUES ($1, $2,$3)",
        [newUserId, fullName, specialty]
      );
      return res.json({ user: newUser.rows[0], doctorAdd: doctorAdd.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //список врачей
  async getAllDoctors(req, res) {
    try {
      const doctors = await pool.query("SELECT * FROM doctors");
      res.json(doctors.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Удаление врача
  async deleteDoctor(req, res) {
    try {
      const doctorId = req.params.id;

      const doctor = await pool.query(
        "SELECT user_id FROM doctors WHERE doctor_id = $1",
        [doctorId]
      );

      if (doctor.rows.length === 0) {
        return res.status(404).json({ error: "Врач не найден." });
      }

      // Удаляем врача из таблицы doctors
      await pool.query("DELETE FROM doctors WHERE doctor_id = $1", [doctorId]);

      // Удаляем пользователя из таблицы users
      const userId = doctor.rows[0].user_id;
      await pool.query("DELETE FROM users WHERE user_id = $1", [userId]);

      res
        .status(200)
        .json({ message: "Врач и связанный пользователь успешно удалены." });
      res
        .status(200)
        .json({ message: "Врач и связанный пользователь успешно удалены." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //редактирование врача
  async updateDoctor(req, res) {
    try {
      const doctorId = req.params.id;
      const { firstName, lastName, middleName, specialty, email, password } =
        req.body;
      const fullName = `${firstName} ${lastName} ${middleName}`;

      const user = await pool.query(
        "SELECT * FROM users WHERE email = $1 AND user_id = (SELECT user_id FROM doctors WHERE doctor_id = $2)",
        [email, doctorId]
      );

      if (user.rows.length === 0) {
        return res.status(404).json({ error: "Врач с таким email не найден." });
      }

      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await pool.query(
          "UPDATE users SET email = $1, password_hash = $2 WHERE user_id = $3",
          [email, hashedPassword, user.rows[0].user_id]
        );
      } else {
        await pool.query("UPDATE users SET email = $1 WHERE user_id = $2", [
          email,
          user.rows[0].user_id,
        ]);
      }

      const updatedDoctor = await pool.query(
        "UPDATE doctors SET name = $1, specialty = $2 WHERE doctor_id = $3 RETURNING *",
        [fullName, specialty, doctorId]
      );

      if (updatedDoctor.rows.length === 0) {
        return res.status(404).json({ error: "Врач не найден." });
      }

      // Возвращаем обновленные данные
      return res.json({ user: user.rows[0], doctor: updatedDoctor.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  //Талоны

  //создание талонов
  async createSchedule(req, res) {
    try {
      const { doctorId, date, startTimes, endTimes } = req.body;

      if (startTimes.length !== endTimes.length) {
        return res
          .status(400)
          .json({ error: "Несоответствие временных интервалов." });
      }

      for (let i = 0; i < startTimes.length; i++) {
        await pool.query(
          "INSERT INTO schedule (doctor_id,is_booked,date, start_time, end_time) VALUES ($1, $2, $3, $4,$5)",
          [doctorId, false, date, startTimes[i], endTimes[i]]
        );
      }

      return res.status(201).json({ message: "Расписание успешно создано." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //получение талонов конкретного врача
  async getSchedule(req, res) {
    try {
      const doctorId = req.params.id;

      const roleId = req.user.role_id;
      console.log(doctorId);

      const schedule = await pool.query(
        "SELECT sch.schedule_id, sch.doctor_id, sch.start_time, sch.end_time, sch.is_booked, doc.name FROM Schedule sch JOIN Doctors doc ON sch.doctor_id = doc.doctor_id WHERE sch.doctor_id = $1 ORDER BY sch.start_time",
        [doctorId]
      );

      if (schedule.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Расписание для данного врача не найдено." });
      }

      return res.status(200).json({ schedule: schedule.rows });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //получение всех талонов

  async getAllSchedules(req, res) {
    try {
      const roleId = req.user.role_id;

      const schedules = await pool.query(
        "SELECT sch.schedule_id, sch.doctor_id, sch.start_time, sch.end_time, sch.is_booked, doc.name as doctor_name FROM Schedule sch JOIN Doctors doc ON sch.doctor_id = doc.doctor_id ORDER BY sch.doctor_id, sch.start_time"
      );

      if (schedules.rows.length === 0) {
        return res.status(404).json({ error: "Расписание не найдено." });
      }

      return res.status(200).json({ schedules: schedules.rows });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  //удаление талона конкретного врача

  async deleteSchedule(req, res) {
    try {
      const scheduleId = req.params.id; // ID расписания получаем из параметров маршрута

      // Удаление расписания по ID
      const deleteOp = await pool.query(
        "DELETE FROM schedule WHERE schedule_id = $1",
        [scheduleId]
      );

      // Если не найдено ни одной записи для удаления, возвращаем ошибку
      if (deleteOp.rowCount === 0) {
        return res
          .status(404)
          .json({ error: "Талон не найдено или уже удален." });
      }

      return res.status(200).json({ message: "Талон успешно удален." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new Controller();
