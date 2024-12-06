"use client";

import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { FC, useEffect } from "react";

interface PrintTransactionReceiptProps {
  transaction: Prisma.TransactionGetPayload<{
    include: { employee: true; tank: true; car: true };
  }>;
}

const PrintTransactionReceipt: FC<PrintTransactionReceiptProps> = ({
  transaction,
}) => {
  useEffect(() => {
    // Trigger the print dialog when the component mounts
    window.print();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>إيصال العملية</h1>
      <table
        style={{ width: "100%", borderCollapse: "collapse", margin: "20px 0" }}
      >
        <tbody>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              رقم العملية
            </th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {transaction.id}
            </td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>الخزان</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {transaction.tank.name}
            </td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>الموظف</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {transaction.employee.name}
            </td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              المركبة
            </th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {transaction.car.carModel}
            </td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>الكمية</th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {transaction.amount}
            </td>
          </tr>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              تاريخ العملية
            </th>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {format(new Date(transaction.created), "yyyy-MM-dd")}
            </td>
          </tr>
        </tbody>
      </table>
      <p style={{ textAlign: "center" }}>شكراً لاستخدامك النظام</p>
    </div>
  );
};

export default PrintTransactionReceipt;
