-- USERS
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

INSERT INTO users (username, password, role) VALUES
('admin', 'adminpass', 'ROLE_ADMIN'),
('teacher1', 'teachpass1', 'ROLE_TEACHER'),
('student1', 'studpass1', 'ROLE_STUDENT');

-- TEACHERS
CREATE TABLE teachers (
    id VARCHAR(5) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO teachers (id, name) VALUES
('T0001', 'Dr. Smith'),
('T0002', 'Prof. Johnson');

-- STUDENTS
CREATE TABLE students (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sex VARCHAR(10) CHECK (sex IN ('male', 'female')),
    entrance_age INT CHECK (entrance_age BETWEEN 10 AND 50),
    entrance_year INT CHECK (entrance_year >= 1900),
    student_class VARCHAR(50)
);

INSERT INTO students (id, name, sex, entrance_age, entrance_year, student_class) VALUES
('S000000001', 'Alice', 'female', 18, 2022, 'CS101'),
('S000000002', 'Bob', 'male', 19, 2021, 'CS102');

-- COURSES
CREATE TABLE courses (
    id VARCHAR(7) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    credit INT NOT NULL,
    grade INT NOT NULL,
    canceled_year INT
);

INSERT INTO courses (id, name, credit, grade, canceled_year) VALUES
('CSE1001', 'Data Structures', 3, 1, NULL),
('CSE1002', 'Algorithms', 4, 2, NULL);

-- COURSE_OFFERINGS
CREATE TABLE course_offering (
    course_id VARCHAR(7),
    teacher_id VARCHAR(5),
    year INT NOT NULL,
    PRIMARY KEY (course_id, teacher_id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (teacher_id) REFERENCES teachers(id)
);

INSERT INTO course_offering (course_id, teacher_id, year) VALUES
('CSE1001', 'T0001', 2023),
('CSE1002', 'T0002', 2023);

-- COURSE_CHOOSINGS
CREATE TABLE course_choosings (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    course_id VARCHAR(7) NOT NULL,
    teacher_id VARCHAR(5) NOT NULL,
    chosen_year INT NOT NULL,
    score INT CHECK (score >= 0 AND score <= 100),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id, teacher_id) REFERENCES course_offering(course_id, teacher_id)
);

INSERT INTO course_choosings (student_id, course_id, teacher_id, chosen_year, score) VALUES
('S000000001', 'CSE1001', 'T0001', 2023, 85),
('S000000002', 'CSE1002', 'T0002', 2023, 90);
