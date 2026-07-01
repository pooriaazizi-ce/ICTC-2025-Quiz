# Azmoon

Implementation of an ICT Challenge question from Sharif ICTC:
`https://sharifict.com/ictchallenge/`

This project stores and queries compact exam-result data for a large number of participants. It includes:

- a Node.js/Express backend for storing and reading results
- a React frontend for manual data entry and leaderboard display
- a binary storage approach that packs each answer into `2` bits

## Challenge Summary

Based on the challenge statement, the system models:

- `100000` participants
- `10` exams per participant
- `5` lessons per exam
- `4` possible states per lesson result

The four states are encoded as colors / levels:

- `0`: red
- `1`: yellow
- `2`: green
- `3`: blue

That means each participant has `50` stored values, and the whole dataset contains:

- `100000 × 10 × 5 = 5000000` values

Because each value has only `4` possible states, the backend stores each one in `2` bits, so the full dataset fits in about:

- `5000000 × 2 bits = 10000000 bits`
- `1250000 bytes`
- about `1.25 MB`

## Project Structure

- `backend/` Express API and binary storage logic
- `backend/src/server.js` main backend implementation
- `backend/data.bin` persisted binary dataset
- `frontend/` React client
- `frontend/src/utils/adding_form.js` manual value entry + random data generation
- `frontend/src/utils/show_top.js` top users for one lesson in one exam
- `frontend/src/utils/overal_top.js` top users across all exams
- `question.jpg` screenshot of the original challenge statement

## How It Works

The backend maps each `(userId, examId, lessonId)` triple to a linear index and stores its value in a packed byte buffer.

Implementation details in `backend/src/server.js`:

- total values: `5,000,000`
- each byte stores `4` values
- storage buffer size: `Math.ceil(5000000 / 4) = 1250000` bytes
- values are persisted in `data.bin`

The core storage flow is:

- compute a flat index for a participant/exam/lesson
- locate the target byte with `Math.floor(index / 4)`
- locate the `2`-bit offset with `(index % 4) * 2`
- clear the previous bits
- write the new value

## Available API Endpoints

The backend exposes these routes:

- `POST /api/set`  
  Stores one result for a participant, exam, and lesson.

- `GET /api/get`  
  Returns one stored value.

- `POST /api/randomize`  
  Fills the whole dataset with random values from `0` to `3`.

- `GET /api/top`  
  Returns the first `N` participants whose value is `3` for a given exam and lesson.

- `GET /api/top-weighted`  
  Returns the top `N` participants in one exam using weighted lesson scores.

- `GET /api/mean`  
  Returns the mean value and normalized percentage for one lesson in one exam.

- `GET /api/top-overall`  
  Returns the top `N` participants across all exams using weighted lesson scores.

## Frontend Features

The React app currently provides:

- manual submission of a result by participant, exam, lesson, and color
- full random dataset generation
- leaderboard for one lesson in one exam
- overall leaderboard across all exams

The UI text is in Persian and matches the challenge domain.

## Run the Project

## Prerequisites

- Node.js
- Yarn

## Backend

```bash
cd backend
yarn install
yarn dev
```

Backend runs on:

- `http://localhost:5000`

## Frontend

```bash
cd frontend
yarn install
yarn start
```

Frontend runs on:

- `http://localhost:3000`

## Notes

- The project already contains `node_modules` in both `backend/` and `frontend/`.
- The backend uses synchronous file operations for persistence.
- `GET /api/top` returns the first matching users with value `3`; it does not sort by any extra score.
- `GET /api/top-overall` and `GET /api/top-weighted` sort users by weighted sum where lesson weight equals lesson number.
- The frontend calls the backend with hardcoded URLs pointing to `http://localhost:5000`.

## Current Implementation Scope

This repository is a working prototype for the ICTC challenge problem. It demonstrates:

- compact storage under the memory constraint
- random initialization
- update and retrieval of per-lesson results
- simple leaderboard and aggregate queries

It does not currently include:

- participant names or profiles
- advanced validation or authentication
- optimized ranking structures for faster repeated top-N queries
- automated tests

## Related Challenge Reference

Challenge website:

- `https://sharifict.com/ictchallenge/`
