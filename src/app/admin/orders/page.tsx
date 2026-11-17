import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { TableWrap, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { getAdminOrders } from "@/lib/queries/admin";
import { formatCurrency } from "@/lib/utils";
import { markOrderPaidAction } from "./actions";

const statusTone = { paid: "sage", pending: "gold", refunded: "rust" } as const;

export default async function AdminOrdersPage() {
  const adminOrders = await getAdminOrders();
  const totalPaid = adminOrders.filter((o) => o.status === "paid").reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage"
        title="Orders"
        description={`${adminOrders.length} transactions · ${formatCurrency(totalPaid)} collected`}
      />

      <TableWrap>
        <Thead>
          <tr>
            <Th>Order</Th>
            <Th>Student</Th>
            <Th>Course</Th>
            <Th>Amount</Th>
            <Th>Method</Th>
            <Th>Date</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {adminOrders.map((o) => (
            <Tr key={o.id}>
              <Td className="text-beige">{o.id}</Td>
              <Td>{o.student}</Td>
              <Td className="text-beige">{o.course}</Td>
              <Td className="text-gold">{formatCurrency(o.amount)}</Td>
              <Td className="text-beige">{o.method}</Td>
              <Td className="text-beige">{o.date}</Td>
              <Td>
                <Badge tone={statusTone[o.status]}>{o.status}</Badge>
              </Td>
              <Td className="text-right">
                {o.status === "pending" && (
                  <form action={markOrderPaidAction}>
                    <input type="hidden" name="orderId" value={o.rawId} />
                    <button type="submit" className="text-xs text-gold hover:text-gold-soft">
                      Mark Paid
                    </button>
                  </form>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableWrap>
    </div>
  );
}
