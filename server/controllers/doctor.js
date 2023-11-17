import pool from "../db.js";

class Controller {
  async getPatients(req, res) {
    try {
      const patients = await pool.query("SELECT * FROM Patients");
      res.json(patients.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async createReceipts(req, res) {
    try {
      const { patient_id, issue_date, expiry_date, description, items } =
        req.body;

      const userId = req.user.user_id;
      const doctorIdQueryResult = await pool.query(
        "SELECT doctor_id FROM doctors WHERE user_id =$1",
        [userId]
      );

      const doctorId = doctorIdQueryResult.rows[0].doctor_id;

      const receiptResult = await pool.query(
        "INSERT INTO Receipts (patient_id, doctor_id, issue_date, expiry_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING receipt_id",
        [patient_id, doctorId, issue_date, expiry_date, description]
      );
      const receiptId = receiptResult.rows[0].receipt_id;

      // Добавление информации о препаратах в рецепт
      for (const item of items) {
        // Проверка наличия препарата в таблице Warehouse по названию, чтобы получить его item_id
        const warehouseResult = await pool.query(
          "SELECT item_id FROM Warehouse WHERE name = $1",
          [item.name]
        );

        if (warehouseResult.rows.length === 0) {
          throw new Error(
            `Препарат с названием ${item.name} не найден на складе.`
          );
        }

        const item_id = warehouseResult.rows[0].item_id;

        // Вставка информации о препарате в связующую таблицу PrescriptionWarehouseItems
        await pool.query(
          "INSERT INTO PrescriptionWarehouseItems (receipt_id, item_id, quantity, dosage) VALUES ($1, $2, $3, $4)",
          [receiptId, item_id, item.quantity, item.dosage || ""]
        );
      }

      res
        .status(201)
        .json({ message: "Рецепт успешно создан", receiptId: receiptId });
    } catch (error) {
      // Откат транзакции в случае ошибки
      await pool.query("ROLLBACK");
      res.status(500).json({ error: error.message });
    }
  }

  async getSchedule(req, res) {
    try {
      // Предполагается, что doctorId получен после аутентификации и хранится в req.user
      const userId = req.user.user_id;
      const doctorIdQueryResult = await pool.query(
        "SELECT doctor_id FROM doctors WHERE user_id =$1",
        [userId]
      );

      const doctorId = doctorIdQueryResult.rows[0].doctor_id;

      const query = `
            SELECT 
              s.schedule_id, 
              s.start_time, 
              s.end_time, 
              a.problem_description,
              p.name AS patient_name,
              p.phone AS patient_phone
            FROM Schedule s
            LEFT JOIN Appointments a ON s.schedule_id = a.schedule_id
            LEFT JOIN Patients p ON a.patient_id = p.patient_id
            WHERE s.doctor_id = $1 AND s.is_booked = TRUE
            ORDER BY s.start_time;
          `;

      const result = await pool.query(query, [doctorId]);
      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Расписание не найдено или нет запланированных приемов.",
        });
      }

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ошибка сервера при получении расписания." });
    }
  }

  async getAvailableMedications(req, res) {
    try {
      const query =
        "SELECT item_id, name, serial, qr FROM Warehouse ORDER BY name;";

      const result = await pool.query(query);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Препараты на складе не найдены." });
      }

      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ошибка сервера при получении списка препаратов." });
    }
  }

  async getMedcard(req, res) {
    try {
      const patientId = req.params.id;

      const query = `
      SELECT 
      m.medcard_id,
      m.patient_id,
      p.name AS patient_name,
      m.history,
      m.blood_type,
      m.allergies,
      m.chronic_diseases,
      m.current_medications,
      m.surgical_history,
      m.family_history,
      m.lifestyle,
      m.diagnoses,
      m.vaccinations,
      m.contact_info,
      m.created_at,
      m.updated_at
    FROM Medcards m
    JOIN Patients p ON m.patient_id = p.patient_id
    WHERE m.patient_id = $1;
      `;

      const result = await pool.query(query, [patientId]);
      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Медицинская карта не найдена." });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Ошибка сервера при получении медицинской карты." });
    }
  }
}

export default new Controller();
