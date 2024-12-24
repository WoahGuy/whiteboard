import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PriceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const PriceCheck = () => {
  const items: PriceItem[] = [
    { description: "Initial Design", quantity: 1, rate: 500, amount: 500 },
    { description: "Revisions", quantity: 2, rate: 250, amount: 500 },
    { description: "Final Delivery", quantity: 1, rate: 750, amount: 750 },
  ];

  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">${item.rate}</TableCell>
                <TableCell className="text-right">${item.amount}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="font-bold">
                Total
              </TableCell>
              <TableCell className="text-right font-bold">${total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PriceCheck;
