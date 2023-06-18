# Lighthouse BnB

The purpose of this project is to design a database and use server-side JavaScript to display the information from queries to web pages. We will be able to apply our existing knowledge of complex SQL queries, database and ERD (entity relationship diagram) design to integrate the database with a Node backend.

## Description

Lighthouse BnB is an app that will revolutionize the travel industry. It will allow homeowners to rent out their homes to people on vacation, creating an alternative to hotels and bed and breakfasts...There’s nothing else like it! Users can view property information, book reservations, view their reservations, and write reviews.

## Dependencies

- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [cookie-session](https://www.npmjs.com/package/cookie-session)
- [express](https://expressjs.com/)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [pg](https://www.npmjs.com/package/pg)

## Getting Started

Steps to install LighthouseBnB:

1. Fork and clone the following repository: [AliyaJK/lightbnb](https://github.com/AliyaJK/lightbnb)
2. Create a new database in `psql` called lightbnb
3. Connect to the database, as follows:

   ```sql
   \c lightbnb
   ```

   ```sql
   \i migrations/01_schema.sql
   ```

4. Populate database using seed files:

   ```sql
   \i seeds/01_seeds.sql
   ```

   ```sql
   \i seeds/02_seeds.sql
   ```

5. Install dependencies using npm install

6. Run the app using npm run local

7. You will find the app in your browser at [http://localhost:3000/](http://localhost:3000/)