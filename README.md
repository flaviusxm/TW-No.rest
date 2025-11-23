# Read Write Share

**Read Write Share** este aplicatia dezvoltata ca rezultat al proiectului **"Aplicatie web pentru gestionarea notitelor de curs/seminar"**.

## Tehnologii si unelte folosite

- **Front-end:** React, TailwindCSS  
- **Back-end:** Node.js, Express.js  
- **Baza de date:** MariaDB  
- **Unelte:** DBeaver, Postman  

## Nume echipa
- **No.rest**

## Membri echipa
- **Pirjoleanu Mihai Flavius**
- **Ciobanu Horia Matei**

## Functionalitati Principale

### 1. Autentificare
- Autentificare securizata cu Google OAuth

### 2. Gestiune Notite
- Creare, editare si stergere notite

### 3. Organizare
- Categorizare notite pe materii  
- Filtrare si sortare notite

### 4. Partajare
- Partajare individuala cu alti utilizatori  
- Creare si gestionare grupuri de studiu

### 5. Fisiere Atașate
- Incarcare multiple tipuri de fisiere  
- Gestiune storage si organizare fisiere

### 6. Gamificare
- Sistem de badge-uri si realizari  
- Progres utilizator

---

## Necesare

- **Git** 
- **Node.js**  
- **MariaDB** 


## Pasi de Rulare

### 1. Cloneaza Repository-ul
```bash
git clone <url-repository>
cd TW-NO.REST
```

### 2. Creeaza Baza de Date

**Optiunea 1: CLI **
```bash
# Deschide terminal si conecteaza-te la MariaDB:
mysql -u root -p

# ruleaza:
CREATE DATABASE Read_White_Share;
EXIT;
```

**Optiunea 2: GUI Tool DBeaver/HeidiSQL etc**
- Deschide DBeaver sau HeidiSQL
- Conecteaza-te la MariaDB (localhost, port 3306)
- Click dreapta pe Databases
- Create new database
- Nume: `<>`

### 3. Configureaza Dependintele
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend  
npm install
```

### 4. Configureaza Fisierul .env
In folderul `backend/`, creeaza fisierul `.env` cu urmatorul continut:

```env
# Configurare Baza de Date
DB_HOST=                             // host de la baza de date
DB_PORT=                             // port de la baza de date  
DB_USER=                             // nume user baza de date
DB_PASS=                             // parola baza de date
DB_NAME=                             // numele bazei de date

# Configurare Aplicatie
PORT=                                // port backend

# Configurare Google OAuth
GOOGLE_CL_ID=                        // google id => from google console
GOOGLE_CL_SECRET=                    // google secret key => from google console

# Configurare Timezone
TZ=Europe/Bucharest                  // timezone aplicatie

```

### 5. Porneste Aplicatia
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

