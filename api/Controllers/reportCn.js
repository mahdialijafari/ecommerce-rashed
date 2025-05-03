import catchAsync from "../Utils/catchAsync.js";
import Order from "../Models/OrderModel.js"; // Assuming your order model path

export const hitProduct = catchAsync(async (req, res, next) => {
  // To be implemented
});

export const hitCategory = catchAsync(async (req, res, next) => {
  const currentYear = new Date().getFullYear();

  const salesReport = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
        }
      }
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          category: "$items.category",
          month: { $month: "$createdAt" }
        },
        totalQuantity: { $sum: "$items.quantity" }
      }
    },
    {
      $sort: {
        "_id.category": 1,
        "_id.month": 1
      }
    },
    {
      $group: {
        _id: "$_id.category",
        monthlySales: {
          $push: {
            month: "$_id.month",
            quantity: "$totalQuantity"
          }
        },
        totalYearlySales: { $sum: "$totalQuantity" }
      }
    },
    {
      $sort: { totalYearlySales: -1 }
    }
  ]);

  res.status(200).json({
    success: true,
    data: salesReport
  });
});

export const bestCustomerByTotalPrice = catchAsync(async (req, res, next) => {
  // To be implemented
});

export const bestCustomerByOrderCount = catchAsync(async (req, res, next) => {
  // To be implemented
});
