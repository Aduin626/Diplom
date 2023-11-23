import express from "express";
import pool from "../db.js";

class Controller {
  async getAllDoctors(req, res) {
    try {
      const doctors = await pool.query("SELECT * FROM doctors");
      res.json(doctors.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getSchedule(req, res) {
    try {
      const doctorId = req.params.id;

      const roleId = req.user.role_id;
      console.log(doctorId);

      const schedule = await pool.query(
        "SELECT * FROM schedule WHERE doctor_id = $1 AND is_booked=$2 ORDER BY start_time",
        [doctorId, false]
      );

      if (schedule.rows.length === 0) {
        return res
          .status(404)
          .json({ error: "Расписание для данного врача не найдено." });
      }

      return res.status(200).json(  schedule.rows );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createAppointment(req, res) {
    try {
      const { scheduleId, problemDescription } = req.body;
      const userId = req.user.user_id;
      const patientIdQueryResult = await pool.query(
        "SELECT patient_id FROM patients WHERE user_id =$1",
        [userId]
      );

      if (patientIdQueryResult.rows.length === 0) {
        // Если не удалось найти пациента с указанным user_id
        return res.status(404).json({ error: "Пациент не найден" });
      }

      const patientId = patientIdQueryResult.rows[0].patient_id;

      // Создание записи на прием
      const result = await pool.query(
        "INSERT INTO Appointments (patient_id, schedule_id, problem_description, status) VALUES ($1, $2, $3, $4) RETURNING *",
        [patientId, scheduleId, problemDescription, false]
      );

      await pool.query(
        "UPDATE Schedule SET is_booked = true WHERE schedule_id = $1",
        [scheduleId]
      );

      // Возвращаем созданную запись
      return res.status(201).json({ appointment: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getAppointments(req, res) {
    try {
      const userId = req.user.user_id;
      const patientIdQueryResult = await pool.query(
        "SELECT patient_id FROM patients WHERE user_id =$1",
        [userId]
      );
      const patientId = patientIdQueryResult.rows[0].patient_id;

      const userAppointments = await pool.query(
        "SELECT app.appoint_id, app.problem_description, app.status, app.created_at, sch.start_time, sch.end_time, sch.date, doc.name AS doctor_name, doc.specialty FROM Appointments app JOIN Schedule sch ON app.schedule_id = sch.schedule_id JOIN Doctors doc ON sch.doctor_id = doc.doctor_id WHERE app.patient_id = $1 ORDER BY sch.start_time",
        [patientId]
      );

      return res.status(200).json({ appointments: userAppointments.rows });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async deleteAppointment(req, res) {
    try {
      const appointmentId = req.params.id;

      // Получаем информацию о записи на прием
      const appointmentInfo = await pool.query(
        "SELECT * FROM Appointments WHERE appoint_id = $1",
        [appointmentId]
      );

      if (appointmentInfo.rows.length === 0) {
        return res.status(404).json({ error: "Запись на прием не найдена" });
      }

      const scheduleId = appointmentInfo.rows[0].schedule_id;

      // Устанавливаем статус талона в false
      await pool.query(
        "UPDATE Schedule SET is_booked = false WHERE schedule_id = $1",
        [scheduleId]
      );

      // Удаляем запись на прием
      await pool.query("DELETE FROM Appointments WHERE appoint_id = $1", [
        appointmentId,
      ]);

      return res.status(204).send(); // Возвращаем успешный статус без содержания
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateAppointment(req, res) {
    try {
      const appointmentId = req.params.id; // Получаем идентификатор записи на прием из параметра запроса
      const { scheduleId, problemDescription } = req.body; // Получаем обновленные данные из тела запроса

      // Получаем информацию о записи на прием
      const appointmentInfo = await pool.query(
        "SELECT * FROM Appointments WHERE appoint_id = $1",
        [appointmentId]
      );

      if (appointmentInfo.rows.length === 0) {
        return res.status(404).json({ error: "Запись на прием не найдена" });
      }

      const oldScheduleId = appointmentInfo.rows[0].schedule_id;

      await pool.query(
        "UPDATE Schedule SET is_booked = false WHERE schedule_id = $1",
        [oldScheduleId]
      );

      const result = await pool.query(
        "UPDATE Appointments SET schedule_id = $1, problem_description = $2 WHERE appoint_id = $3 RETURNING *",
        [scheduleId, problemDescription, appointmentId]
      );

      await pool.query(
        "UPDATE Schedule SET is_booked = true WHERE schedule_id = $1",
        [scheduleId]
      );

      return res.status(200).json({ appointment: result.rows[0] });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getReceipt(req, res) {
    try {
      const userId = req.user.user_id;
      const patientIdQueryResult = await pool.query(
        "SELECT patient_id FROM patients WHERE user_id =$1",
        [userId]
      );
      const patientId = patientIdQueryResult.rows[0].patient_id;
  
      const query = `
        SELECT
          r.receipt_id,
          r.issue_date,
          r.expiry_date,
          r.description,
          json_agg(json_build_object('name', w.name, 'qr', w.qr, 'quantity', pwi.quantity, 'dosage', pwi.dosage)) AS medications
        FROM Receipts r
        JOIN PrescriptionWarehouseItems pwi ON r.receipt_id = pwi.receipt_id
        JOIN Warehouse w ON pwi.item_id = w.item_id
        WHERE r.patient_id = $1
        GROUP BY r.receipt_id
        ORDER BY r.issue_date DESC;
      `;
  
      const result = await pool.query(query, [patientId]);
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Рецепты не найдены." });
      }
  
      return res.status(200).json({ receipts: result.rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера при получении рецептов." });
    }
  }

  async deleteReceipt(req, res) {
    try {
      const receiptId = req.params.id;

      const deleteQuery = "DELETE FROM Receipts WHERE receipt_id = $1;";
      const result = await pool.query(deleteQuery, [receiptId]);

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Рецепт не найден." });
      }

      res.status(200).json({ message: "Рецепт успешно удален." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Ошибка сервера при удалении рецепта." });
    }
  }
}

export default new Controller();
