const db = require('../config/db');

const DashboardModel = {
  getTotalSales: (callback) => {
    const sql = "SELECT SUM(total) AS totalSales FROM orders WHERE payment_status = 'Paid'";
    db.query(sql, callback);
  },

  getTotalCustomers: (callback) => {
    const sql = "SELECT COUNT(*) AS totalCustomers FROM users WHERE role = 'customer'";
    db.query(sql, callback);
  },

    getTotalOrders: (callback) => {
    const sql = "SELECT COUNT(*) AS totalOrders FROM orders";
    db.query(sql, callback);
  },

  getTotalProducts: (callback) => {
    const sql = "SELECT COUNT(*) AS totalProducts FROM products";
    db.query(sql, callback);
  },

  getMonthlySales: (callback) => {
    const sql = `
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        SUM(total) AS monthlySales
      FROM orders
      WHERE payment_status = 'Paid'
      GROUP BY month
      ORDER BY month ASC
    `;
    db.query(sql, callback);
  },

  getWeeklySales: (callback) => {
  const sql = `
    SELECT 
      DATE_FORMAT(DATE_SUB(created_at, INTERVAL(WEEKDAY(created_at)) DAY), '%Y-%m-%d') AS week_start,
      SUM(total) AS weeklySales
    FROM orders
    WHERE payment_status = 'Paid'
    GROUP BY week_start
    ORDER BY week_start ASC
  `;
  db.query(sql, callback);
},

};



module.exports = DashboardModel;
