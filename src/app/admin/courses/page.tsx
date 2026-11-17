import { Building2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TableWrap, Thead, Tbody, Tr, Th, Td } from "@/components/ui/Table";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { RowActionsMenu, RowActionItem } from "@/components/ui/RowActionsMenu";
import { listCourses } from "@/lib/queries/courses";
import { formatCurrency } from "@/lib/utils";
import { deleteCourseAction } from "./actions";

const formatLabel = {
  online: "Online",
  "in-clinic": "In-Clinic",
  bundle: "Course + Device",
} as const;

export default async function AdminCoursesPage() {
  const courses = await listCourses();
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Manage"
        title="Courses"
        description="All online courses, in-clinic programs and bundles available in the academy."
        actions={
          <Button href="/admin/courses/new" icon={<Plus size={15} />}>
            Add Course
          </Button>
        }
      />

      <TableWrap>
        <Thead>
          <tr>
            <Th>Course</Th>
            <Th>Format</Th>
            <Th>Price</Th>
            <Th>Enrolled</Th>
            <Th>Revenue</Th>
            <Th>Rating</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </Thead>
        <Tbody>
          {courses.map((c) => (
            <Tr key={c.slug}>
              <Td>
                <div>
                  <p className="text-cream">{c.title}</p>
                  <p className="text-xs text-beige">{c.category}</p>
                </div>
              </Td>
              <Td>
                <Badge tone={c.format === "online" ? "outline" : "gold"}>
                  {c.format === "in-clinic" && <Building2 size={11} />}
                  {formatLabel[c.format]}
                </Badge>
              </Td>
              <Td>{formatCurrency(c.price)}</Td>
              <Td>{c.studentsEnrolled}</Td>
              <Td className="text-gold">{formatCurrency(c.price * c.studentsEnrolled)}</Td>
              <Td>
                <span className="flex items-center gap-1 text-beige">
                  <Star size={13} className="text-gold" fill="currentColor" /> {c.rating}
                </span>
              </Td>
              <Td>
                <Badge tone="sage">Published</Badge>
              </Td>
              <Td className="text-right">
                <RowActionsMenu>
                  <RowActionItem>
                    <Link
                      href={`/admin/courses/${c.slug}/manage`}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-cream hover:bg-ink/40"
                    >
                      <Pencil size={13} /> Edit
                    </Link>
                  </RowActionItem>
                  <RowActionItem>
                    {c.studentsEnrolled > 0 ? (
                      <span
                        className="flex items-center gap-2 px-3 py-2 text-xs text-beige/50"
                        title="Courses with enrolled students can't be deleted"
                      >
                        <Trash2 size={13} /> Delete
                      </span>
                    ) : (
                      <form action={deleteCourseAction}>
                        <input type="hidden" name="courseSlug" value={c.slug} />
                        <ConfirmSubmitButton
                          confirmMessage={`Delete "${c.title}"? This removes all its modules, lessons and uploaded files. This can't be undone.`}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-cream hover:bg-ink/40 hover:text-rust"
                        >
                          <Trash2 size={13} /> Delete
                        </ConfirmSubmitButton>
                      </form>
                    )}
                  </RowActionItem>
                </RowActionsMenu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </TableWrap>
    </div>
  );
}
