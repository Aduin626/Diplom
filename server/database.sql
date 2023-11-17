CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Создание таблицы пользователей
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES Roles(role_id),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL -- Пароль в хешированном виде
);

-- Создание таблицы сессий для управления активными сессиями пользователей
CREATE TABLE Sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES Users(user_id),
    session_token UUID NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы администраторов
CREATE TABLE Admins (
    admin_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES Users(user_id),
    name VARCHAR(50) NOT NULL,

);

-- Создание таблицы докторов
CREATE TABLE Doctors (
    doctor_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES Users(user_id),
    name VARCHAR(50) NOT NULL,
    specialty VARCHAR(50) NOT NULL,
);

-- Создание таблицы пациентов
CREATE TABLE Patients (
    patient_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES Users(user_id),
    name VARCHAR(50) NOT NULL,
    birthday DATE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(50) NOT NULL
    snils VARCHAR(50) UNIQUE NOT NULL;
);

-- Создание таблицы записей на прием
CREATE TABLE Appointments (
    appoint_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES Patients(patient_id),
    schedule_id INTEGER NOT NULL REFERENCES Schedule(schedule_id),
    problem_description TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Создание таблицы расписаний:
CREATE TABLE Schedule (
    schedule_id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL REFERENCES Doctors(doctor_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE
);

-- Создание таблицы документов
CREATE TABLE Documents (
    document_id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    issue_date DATE NOT NULL,
    admin_id INTEGER NOT NULL REFERENCES Admins(admin_id)
);

-- Создание таблицы медицинских карт
CREATE TABLE Medcards (
    medcard_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES Patients(patient_id),
    history TEXT NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    allergies TEXT,
    chronic_diseases TEXT,
    current_medications TEXT,
    surgical_history TEXT,
    family_history TEXT,
    lifestyle TEXT,
    diagnoses TEXT,
    vaccinations TEXT,
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
-- Создание таблицы уведомлений склада
CREATE TABLE Notif_warehouse (
    notif_id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES Admins(admin_id),
    text TEXT NOT NULL,
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Создание таблицы уведомлений
CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    chat_id
    text TEXT NOT NULL,
    date TIMESTAMP WITHOUT TIME ZONE NOT NULL
);

-- Создание таблицы для склада
CREATE TABLE Warehouse (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    serial VARCHAR(50) NOT NULL,
    qr TEXT NOT NULL
);

-- Создание таблицы рецептов
CREATE TABLE Receipts (
    receipt_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES Patients(patient_id),
    doctor_id INTEGER NOT NULL REFERENCES Doctors(doctor_id),
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    description TEXT NOT NULL
);


CREATE TABLE PrescriptionWarehouseItems (
    prescription_item_id SERIAL PRIMARY KEY,
    receipt_id INTEGER NOT NULL REFERENCES Receipts(receipt_id),
    item_id INTEGER NOT NULL REFERENCES Warehouse(item_id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    dosage TEXT
);

CREATE TABLE Warehouse(
    item_id INTEGER PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    serial VARCHAR(50) NOT NULL,
    qr TEXT NOT NULL
);

-- Chat (
--     chat_id SERIAL PRIMARY KEY,
--     name


-- )
-- chat_member(
--     chat_id
--     user_id
-- )

CREATE TABLE friends (
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES Users(user_id) ON DELETE CASCADE
);