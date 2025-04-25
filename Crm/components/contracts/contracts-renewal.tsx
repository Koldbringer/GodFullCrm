"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, FileTextIcon, AlertTriangleIcon } from "lucide-react"

export function ContractsRenewal() {
  const [contracts] = useState([
    {
      id: "C-1001",
      customer: "Acme Corp",
      type: "Serwisowy",
      startDate: "2023-01-15",
      endDate: "2024-01-14",
      value: 12000,
      status: "active"
    },
    {
      id: "C-1002",
      customer: "TechSolutions Inc",
      type: "Konserwacyjny",
      startDate: "2023-03-01",
      endDate: "2023-12-31",
      value: 8500,
      status: "expiring"
    },
    {
      id: "C-1003",
      customer: "Global Industries",
      type: "Serwisowy Premium",
      startDate: "2023-05-10",
      endDate: "2024-05-09",
      value: 24000,
      status: "active"
    },
    {
      id: "C-1004",
      customer: "Local Business Ltd",
      type: "Konserwacyjny",
      startDate: "2023-02-15",
      endDate: "2023-11-30",
      value: 6200,
      status: "expired"
    },
    {
      id: "C-1005",
      customer: "City Hospital",
      type: "Serwisowy Premium",
      startDate: "2023-04-01",
      endDate: "2024-03-31",
      value: 36000,
      status: "active"
    }
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Aktywny</Badge>
      case "expiring":
        return <Badge className="bg-yellow-500">Wygasa wkrótce</Badge>
      case "expired":
        return <Badge className="bg-red-500">Wygasł</Badge>
      default:
        return <Badge>Nieznany</Badge>
    }
  }

  const expiringContracts = contracts.filter(c => c.status === "expiring")
  const expiredContracts = contracts.filter(c => c.status === "expired")

  return (
    <div className="space-y-6">
      <Card className="border-yellow-500 border-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Umowy wymagające odnowienia ({expiringContracts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {expiringContracts.map(contract => (
            <div key={contract.id} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{contract.customer}</p>
                <p className="text-sm text-muted-foreground">Umowa {contract.type}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>Wygasa: {new Date(contract.endDate).toLocaleDateString()}</span>
                </div>
              </div>
              <Button size="sm">Odnów</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Wszystkie umowy</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Klient</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>Data rozpoczęcia</TableHead>
                <TableHead>Data zakończenia</TableHead>
                <TableHead>Wartość</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map(contract => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.id}</TableCell>
                  <TableCell>{contract.customer}</TableCell>
                  <TableCell>{contract.type}</TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{contract.value.toLocaleString()} zł</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <FileTextIcon className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
