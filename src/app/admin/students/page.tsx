import { Mail, MoreVertical, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { TableWrap, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { getAdminStudents } from "@/lib/queries/admin";
import { formatCurrency } from "@/lib/utils";

export default async function AdminStudentsPage() {
  const adminStudents = await getAdminStudents();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage"
        title="Students"
        description="Everyone enrolled in an online course or in-clinic training program."
        actions={<Button icon={<UserPlus size={15} />}>Invite Student</Button>}
      />

      <TableWrap>
        <Thead>
          <tr>
            <Th>Student</Th>
            <Th>Enrolled</Th>
            <Th>Completed</Th>
            <Th>Total Spent</Th>
            <Th>Joined</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {adminStudents.map((s) => (
            <Tr key={s.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <Avatar initials={s.initials} size={34} />
                  <div className="min-w-0">
                    <p className="text-cream">{s.name}</p>
                    <p className="flex items-center gap-1 text-xs text-beige">
                      <Mail size={11} /> {s.email}
                    </p>
                  </div>
                </div>
              </Td>
              <Td>{s.coursesEnrolled} courses</Td>
              <Td>{s.coursesCompleted} courses</Td>
              <Td className="text-gold">{formatCurrency(s.totalSpent)}</Td>
              <Td className="text-beige">{s.joined}</Td>
              <Td>
                <Badge tone={s.status === "active" ? "sage" : "neutral"}>{s.status}</Badge>
              </Td>
              <Td className="text-right">
                <button className="text-beige hover:text-gold" aria-label="More actions">
                  <MoreVertical size={16} />
                </button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableWrap>
    </div>
  );
}
