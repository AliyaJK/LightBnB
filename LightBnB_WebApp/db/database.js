const properties = require("./json/properties.json");
const users = require("./json/users.json");

const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`,[email])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(`INSERT INTO users (name, email, password) queryParams ($1, $2, $3) RETURNING *`, [user.name, user.email, user.password]
  )
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
      return null;
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(
      `SELECT reservations.*, properties.*, AVG(property_reviews.rating) as avarage_rating
      FROM reservations
      JOIN properties ON reservations.property_id = properties.id
      JOIN property_reviews ON properties.id = property_reviews.property_id
      WHERE reservations.guest_id = $1
      GROUP BY reservations.id, properties.id
      ORDER BY reservations.start_date ASC
      LIMIT $2;`,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
// const getAllProperties = function (options, limit = 10) {
//   const queryParams = [];

//   let queryString = `SELECT properties.*, AVG(property_reviews.rating) AS average_rating
//   FROM properties
//   LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
//   WHERE 1=1`;

//   if (options.city) {
//     queryParams.push(`%${options.city}%`);
//     queryString += ` AND city LIKE $${queryParams.length}`;
//   }

//   if (options.owner_id) {
//     queryParams.push(`${options.owner_id}`);
//     queryString += ` AND properties.owner_id = $${queryParams.length}`;
//   }

//   if (options.minimum_price_per_night) {
//     queryParams.push(`${options.minimum_price_per_night}`);
//     queryString += ` AND properties.cost_per_night >= $${queryParams.length}`;
//   }

//   if (options.maximum_price_per_night) {
//     queryParams.push(`${options.maximum_price_per_night}`);
//     queryString += ` AND properties.cost_per_night <= $${queryParams.length}`;
//   }

//   if (options.minimum_rating) {
//     queryParams.push(`${options.minimum_rating}`);
//     queryString += ` AND AVG(property_reviews.rating) >= $${queryParams.length}`;
//   }

//   queryString += `
//   GROUP BY properties.id HAVING 1=1
//   ORDER BY cost_per_night
//   LIMIT $${queryParams.length + 1};
// `;

//   queryParams.push(limit);

//   return pool
//     .query(queryString, queryParams)
//     .then((result) => {
//       return result.rows;
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// };

const getAllProperties = function (options, limit = 10) {
  const queryParams = [];
  let queryString = `
    SELECT properties.*, AVG(property_reviews.rating) AS average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  let whereClause = '';
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereClause += `city LIKE $${queryParams.length} `;
  }
  if (options.owner_id) {
    queryParams.push(options.owner_id);
    whereClause += `${whereClause ? 'AND ' : ''}owner_id = $${queryParams.length} `;
  }
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    whereClause += `${whereClause ? 'AND ' : ''}cost_per_night >= $${queryParams.length} `;
  }
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    whereClause += `${whereClause ? 'AND ' : ''}cost_per_night <= $${queryParams.length} `;
  }
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    whereClause += `${whereClause ? 'AND' : ''}AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  if (whereClause) {
    queryString += `WHERE ${whereClause}`;
  }

  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length + 1};
  `;

  queryParams.push(limit);

  return pool.query(queryString, queryParams)
    .then((res) => res.rows)
    .catch((err) => {
      console.log(err.message);
      return [];
    });
};


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
