# W2M

## Project Overview

This project is a web application built with Angular that serves as a hero management system. It allows users to view a list of superheroes, search for specific heroes, and manage their details (create, update, and delete). The application interacts with a local JSON server acting as a backend API to perform CRUD operations on hero data.

**Key Features:**
- **Hero Listing:** Display a comprehensive list of all available superheroes.
- **Hero Search:** Efficiently search for heroes by name.
- **Hero Details:** View detailed information for each hero.
- **Hero Management (CRUD):**
    - **Create:** Add new superheroes to the database.
    - **Update:** Modify existing superhero information.
    - **Delete:** Remove superheroes from the database.
- **Responsive Design:** Optimized for various screen sizes.
- **Loading Indicators:** Provides visual feedback during data loading operations.
- **Confirmation Dialogs:** Ensures user intent for critical actions like deletion.

This project demonstrates the use of Angular's reactive forms, routing, services, and Material Design components for a modern and intuitive user experience.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.3.

## Development server

Run `npm start` to run both the backend and frontend servers concurrently.

The frontend will be available at `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Running servers separately

If you prefer, you can run the servers in separate terminals:

- For the backend server, run `npm run backend`.
- For the frontend dev server, run `ng serve`.
