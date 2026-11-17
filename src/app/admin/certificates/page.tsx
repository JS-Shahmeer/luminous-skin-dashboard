import { Download } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { TableWrap, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { getAdminCertificates } from "@/lib/queries/admin";

export default async function AdminCertificatesPage() {
  const adminCertificates = await getAdminCertificates();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage"
        title="Certificates"
        description="Every certificate issued automatically on course completion."
      />

      <TableWrap>
        <Thead>
          <tr>
            <Th>Student</Th>
            <Th>Course</Th>
            <Th>Credential ID</Th>
            <Th>Issued</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {adminCertificates.map((c) => (
            <Tr key={c.id}>
              <Td>{c.student}</Td>
              <Td className="text-beige">{c.course}</Td>
              <Td className="text-beige">{c.credentialId}</Td>
              <Td className="text-beige">{c.issuedOn}</Td>
              <Td className="text-right">
                <button className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-soft">
                  <Download size={13} /> PDF
                </button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableWrap>
    </div>
  );
}
