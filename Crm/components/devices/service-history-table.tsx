import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ServiceHistoryItem {
  id: string
  date: string
  type: string
  technician: string
  description: string
  parts_used: string[]
}

interface ServiceHistoryTableProps {
  serviceHistory: ServiceHistoryItem[]
}

export function ServiceHistoryTable({ serviceHistory }: ServiceHistoryTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Typ</TableHead>
          <TableHead>Technik</TableHead>
          <TableHead>Opis</TableHead>
          <TableHead>Użyte części</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {serviceHistory.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{new Date(item.date).toLocaleDateString("pl-PL")}</TableCell>
            <TableCell>{item.type}</TableCell>
            <TableCell>{item.technician}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell>{item.parts_used.join(", ")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
