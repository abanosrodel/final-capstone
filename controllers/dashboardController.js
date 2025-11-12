const DashboardModel = require('../models/dashboardModel');

const getDashboardStats = (req, res) => {
  DashboardModel.getTotalSales((err1, salesResult) => {
    if (err1) return res.status(500).json({ error: err1 });

    DashboardModel.getTotalCustomers((err2, customerResult) => {
      if (err2) return res.status(500).json({ error: err2 });

      DashboardModel.getTotalProducts((err3, productResult) => {
        if (err3) return res.status(500).json({ error: err3 });

        DashboardModel.getTotalOrders((err4, orderResult) => {
          if (err4) return res.status(500).json({ error: err4 });

          DashboardModel.getMonthlySales((err5, monthlySalesResult) => {
            if (err5) return res.status(500).json({ error: err5 });

            DashboardModel.getWeeklySales((err6, weeklySalesResult) => {
              if (err6) return res.status(500).json({ error: err6 });

              res.json({
                totalSales: salesResult[0]?.totalSales || 0,
                totalCustomers: customerResult[0]?.totalCustomers || 0,
                totalProducts: productResult[0]?.totalProducts || 0,
                totalOrders: orderResult[0]?.totalOrders || 0,
                monthlySales: monthlySalesResult || [],
                weeklySales: weeklySalesResult || []
              });
            });
          });
        });
      });
    });
  });
};

module.exports = {
  getDashboardStats
};
