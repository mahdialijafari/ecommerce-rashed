import catchAsync from "../Utils/catchAsync.js";
import Order from "../Models/orderMd.js";

export const hitProduct = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const fromDate = new Date(req.query.fromDate); // e.g., '2020-01-01'
  const toDate = new Date(req.query.toDate); // e.g., '2020-12-31'

  const mostSoldProducts = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: fromDate,
          $lte: toDate,
        },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        totalQuantity: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalQuantity: -1 } },
    {
      $lookup: {
        from: "Product",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        _id: 0,
        productId: "$_id",
        totalQuantity: 1,
        productName: "$product.name",
        productImage: "$product.images",
        price: "$product.price",
      },
    },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ]);
  return res.status(200).json({
    success:true,
    data:mostSoldProducts
  })
});

export const hitCategory = catchAsync(async (req, res, next) => {
  const currentYear = new Date().getFullYear();

  const salesReport = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          category: "$items.category",
          month: { $month: "$createdAt" },
        },
        totalQuantity: { $sum: "$items.quantity" },
      },
    },
    {
      $sort: {
        "_id.category": 1,
        "_id.month": 1,
      },
    },
    {
      $group: {
        _id: "$_id.category",
        monthlySales: {
          $push: {
            month: "$_id.month",
            quantity: "$totalQuantity",
          },
        },
        totalYearlySales: { $sum: "$totalQuantity" },
      },
    },
    {
      $sort: { totalYearlySales: -1 },
    },
  ]);

  res.status(200).json({
    success: true,
    data: salesReport,
  });
});

export const bestCustomerByTotalPrice = catchAsync(async (req, res, next) => {
  // To be implemented
});

export const bestCustomerByOrderCount = catchAsync(async (req, res, next) => {
  // To be implemented
});
